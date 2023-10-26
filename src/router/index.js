import {createRouter, createWebHistory} from "vue-router";
import HomeComponent from "../home/pages/home.component.vue";
import LoginComponent from "../authentication/pages/login.component.vue";
import ProductsComponent from "../store/pages/products.component.vue";
import ProductDetails from "../store/pages/product-details.component.vue";
import {useUserStore} from "../authentication/services/user-store.store.js";
import PurchasesComponent from "../store/pages/purchases.component.vue";
import PageNotFoundComponent from "../shared/pages/page-not-found.component.vue";

// Pages

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/home', name: 'Home', component: HomeComponent, meta: { requiresAuth: false }},
    { path: '/login', name: 'Log In', component: LoginComponent, meta: { requiresAuth: false }},
    { path: '/products', name: 'Products', component: ProductsComponent, meta: { requiresAuth: true }},
    { path: '/products/:id', name: 'Product', component: ProductDetails, meta: { requiresAuth: true }},
    { path: '/purchases', name: 'Purchases', component: PurchasesComponent, meta: { requiresAuth: true }},
    { path: '/:notFound(.*)', name: 'Page Not Found', component: PageNotFoundComponent, meta: { requiresAuth: true } },
    {
      path: '/',
      redirect: (to) => {
        if (to.meta.requiresAuth) {
          return '/products';
        } else {
          return '/home';
        }
      },
    },
  ]
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next('/login');
  } else if (!to.meta.requiresAuth && userStore.isAuthenticated) {
    next('/products');
  } else {
    next();
  }
});


export default router;