import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/Front.vue'),
    children: [
      {
        // 第二層不加斜線
        path: 'index',
        component: () => import('../views/Index.vue')
      },
      {
        // 第二層不加斜線
        path: 'products',
        component: () => import('../views/Products.vue')
      },
      {
        // 第二層不加斜線
        path: 'product/:id',
        component: () => import('../views/Product.vue')
      },
      {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../views/About.vue')
      },
      {
        // 第二層不加斜線
        path: 'cart',
        component: () => import('../views/Cart.vue')
      },
      {
        // 第二層不加斜線
        path: 'login',
        component: () => import('../views/Login.vue')
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('../views/Dashboard.vue'),
    children: [
      {
        // 第二層不加斜線
        path: 'products',
        component: () => import('../views/admin/Products.vue')
      },
      {
        // 第二層不加斜線
        path: 'orders',
        component: () => import('../views/admin/Orders.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
