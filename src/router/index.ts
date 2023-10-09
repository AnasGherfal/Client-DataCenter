import { createRouter, createWebHistory, RouterView } from "vue-router";
import DashboardView from "../Dashboard.vue";
import LoginPage from "../views/LoginPage.vue";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ref } from "vue";
import HomeView from "@/views/MainPage/HomeView.vue";
import { useAuthStore } from "../stores/auth";

NProgress.configure({ showSpinner: false });
const loading = ref(false);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/Login",
      name: "loginPage",
      component: LoginPage,
      meta: {
        guest: true,
      },
    },
    {
      path: "/",
      name: "dashboard",
      component: DashboardView,
      meta: {
        guest: false,
      },
      children: [
        {
          path: "",
          name: "home",
          component: HomeView,
        },
        {
          path: "/AdminsRecord",
          name: "AdminsRecord",
          component: () => import("../views/AdminsMangment/AdminsRecords.vue"),
        },
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
        {
          path: "/AuditsRecord",
          props: true,
          component: () => import("../views/Audits/AuditsRecord.vue"),
        },
        {
          path: "/customersRecord",
          name: "CustomersRecord",
          component: () => import("../views/Customers/CustomersRecord.vue"),
        },
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
        {
          path: "/subscriptionsRecord",
          name: "SubscriptionsRecord",
          component: () =>
            import("../views/subscriptions/SubscriptionsRecord.vue"),
        },
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
        {
          path: "/visitsRecords",
          name: "VisitsRecords",
          component: () => import("../views/Visits/VisitsRecord.vue"),
        },
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
        },
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
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../views/NotFound.vue"),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  // if the route is guest only then let the user continue
  if (to.meta.guest) {
    document.getElementById("InitScreenDOM")?.remove();
    return next();
  }

  if (!auth.userData) {
    const res = await auth.getProfile();
    document.getElementById("InitScreenDOM")?.remove();

    if (res) {
      // the user is logged in and trying to access the login page then redirect to dashboard
      if (to.meta.guest) {
        return next("/dashboard");
      }

      // continue to the route
      return next();
    }

    // if the user is not logged in and the route is not guest only then redirect to login
    if (to.meta.guest) {
      return next();
    }

    return next("/Login");
  }

  // otherwise continue to the route
  document.getElementById("InitScreenDOM")?.remove();
  next();

  // Scroll page to top on every route change
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
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
