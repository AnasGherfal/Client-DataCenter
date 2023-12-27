import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/MainPage/HomeView.vue";
import LoginPage from "../views/LoginPage.vue";
import { useAuthStore } from "../stores/auth";
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
      meta: {
        guest: true,
      },
    },

    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        guest: false,
      },
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
      path: "/AuditsRecord",
      props: true,
      component: () => import("../views/Audits/AuditsRecord.vue"),
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

      children: [
        {
          path: "timeShiftDetails/:id",
          props: true,
          component: () =>
            import("../views/Settings/TimeShift/TimeShiftDetailsView.vue"),
        },
      ],
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

router.beforeEach(async (to, from, next) => {
  // Check if the user is authorized/logged in (you can use your own logic here)
  const authorized = useAuthStore();

  // if the route is guest only then let the user continue
  if (to.meta.guest) {
    document.getElementById("InitScreenDOM")?.remove();
    return next();
  }
  const res = await authorized.getProfile();


  if (!authorized.userData) {
    const res = await authorized.getProfile();
    document.getElementById("InitScreenDOM")?.remove();

    if (res) {
      // the user is logged in and trying to access the login page then redirect to the home page
      if (to.name == 'loginPage') {
        return next("/");
      }

      // continue to the route
      return next();
    }

        // Continue to the requested route
        document.getElementById("InitScreenDOM")?.remove();
        return next();
      

    // if the user is not logged in and the route is not guest only then redirect to login
    if (to.meta.guest) {
      return next();
    }

    return next("/Login");
    
  }

  // If the user is logged in and trying to access the login page, redirect to the home page
  if ( authorized.userData && to.name == 'loginPage') {
    return next("/");
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
  window.addEventListener('popstate', () => {
    // Your logic to handle the back button press

    // For example, you might want to redirect the user to a specific route:
    router.push('/'); // Replace '/specific-route' with your desired route
  });
  loading.value = false;
  // Complete the animation of the route progress bar.
  NProgress.done();
});

export default router;
