import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/MainPage/HomeView.vue";
import LoginPage from "../views/LoginPage.vue";
import { isAuthorized } from "../auth";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ref } from "vue";

NProgress.configure({ showSpinner: false });
const loading = ref(false);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/Login",
      name: "loginPage",
      component: LoginPage,
    },

    {
      path: "/",
      name: "home",
      component: HomeView,
    },

    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../views/NotFound.vue"),
    },
    {
      path: "/AdminsRecord",
      name: "AdminsRecord",
      component: () => import("../views/AdminsMangment/AdminsRecords.vue"),
      children: [
        {
          path: "AddAdmin",
          props: true,
          component: () => import("../views/AdminsMangment/AddAdmin.vue"),
        },
        {
          path: "AdminsProfile/:id",
          props: true,
          component: () => import("../views/AdminsMangment/ProfileAdmin.vue"),
        },
      ],
    },

    {
      path: "/customersRecord",
      name: "CustomersRecord",

      component: () => import("../views/Customers/CustomersRecord.vue"),

      children: [
        {
          path: "addCustomer",
          props: true,
          component: () => import("../views/Customers/AddCustomer.vue"),
        },
        {
          path: "CustomerProfile/:id",
          props: true,
          component: () =>
            import("../views/Customers/Profile/CustomerProfile.vue"),
        },
      ],
    },
    {
      path: "/subscriptionsRecord",
      name: "SubscriptionsRecord",

      component: () => import("../views/subscriptions/SubscriptionsRecord.vue"),

      children: [
        {
          path: "addSubsciptions",
          component: () => import("../views/subscriptions/Addsubscription.vue"),
        },
        {
          path: "SubscriptionsDetaView/:id",
          props: true,
          component: () =>
            import("../views/subscriptions/SubscriptionsDetails.vue"),
        },
      ],
    },

    {
      path: "/visitsRecords",
      name: "VisitsRecords",

      component: () => import("../views/Visits/VisitsRecord.vue"),

      children: [
        {
          path: "createVisit",
          props: true,

          component: () => import("../views/Visits/VisitForm.vue"),
        },
        {
          path: "visitDetails/:id",
          props: true,
          component: () => import("../views/Visits/VisitDetailsView.vue"),
        },
      ],
    },
    {
      path: "/settingsView",
      name: "SettingsView",

      component: () => import("../views/Settings/SettingsView.vue"),
    },
    {
      path: "/adminProfile",
      name: "AdminProfile",

      component: () => import("../views/AdminProfile/adminProfileView.vue"),
    },
    {
      path: "/invoices",
      name: "Invoices",
      component: () => import("../views/Invoices/InvoicesRecord.vue"),
      children: [
        {
          path: "invoicesDetails/:id",
          props: true,
          component: () => import("../views/Invoices/InvoicesDetailsView.vue"),
        },
        {
          path: "addInvoice",
          component: () => import("../views/Invoices/AddInvoice.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  // Check if the user is authorized/logged in (you can use your own logic here)
  const authorized = isAuthorized();

  // If the user is authorized and trying to access the login page, redirect to the home page
  if (authorized && to.name === "loginPage") {
    next({ name: "/" });
  } else {
    // Otherwise, continue with the navigation as usual
    next();
  }
});
router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  NProgress.start();
  if (to.name) {
    loading.value = true;
    // Start the route progress bar.
  }
  next();
});

router.afterEach(() => {
  loading.value = false;
  // Complete the animation of the route progress bar.
  NProgress.done();
});

export default router;
