import { createRouter, createWebHashHistory } from 'vue-router';
import Layout from '@/layouts/index.vue';
import i18n from '@/locales';
const { global } = i18n;
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
    },
    hidden: true,
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/errorPage/401.vue'),
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/errorPage/404.vue'),
    hidden: true,
  },
];

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    name: 'Root',
    children: [
      {
        path: '/index',
        name: 'Index',
        component: () => import('../views/index/index.vue'),
        meta: {
          title: global.t('route.home'),
          icon: 'icon-home',
          affix: true,
          noKeepAlive: true,
        },
      },
    ],
  },
  {
    path: '/fileManager',
    component: Layout,
    name: 'File',
    meta: { title: '文件管理', icon: 'icon-form-one' },
    children: [
      {
        path: '/fileManager/allfile',
        name: 'AllFile',
        component: () => import('@/views/FileManager/allfile.vue'),
        meta: {
          title: '全文件管理',
          icon: 'icon-data-file',
        },
      },
      {
        path: '/fileManager/yinzhou',
        name: 'Yinzhou',
        component: () => import('@/views/FileManager/yinzhou.vue'),
        meta: {
          title: '鄞州房屋初始化',
          icon: 'icon-green-house',
        },
      },
      {
        path: '/fileManager/renfang',
        name: 'Renfang',
        component: () => import('@/views/FileManager/renfang.vue'),
        meta: {
          title: '人房关系',
          icon: 'icon-relational-graph',
        },
      },
      {
        path: '/fileManager/qidi',
        name: 'Qidi',
        component: () => import('@/views/FileManager/qidi.vue'),
        meta: {
          title: '企地关系',
          icon: 'icon-transform',
        },
      },
    ],
  },
  {
    path: '/dataManager',
    component: Layout,
    name: 'Data',
    meta: { title: '元数据管理', icon: 'icon-adjacent-item' },
    children: [
      {
        path: '/dataManager/table',
        name: 'table',
        component: () => import('@/views/dataManager/table.vue'),
        meta: {
          title: 'dw信息',
          icon: 'icon-analysis',
        },
      },
      {
        path: '/dataManager/gb4754',
        name: 'gb4754',
        component: () => import('@/views/dataManager/gb4754.vue'),
        meta: {
          title: '经济行业分类',
          icon: 'icon-dollar',
        },
      },
      {
        path: '/dataManager/education_code',
        name: 'education_code',
        component: () => import('@/views/dataManager/education_code.vue'),
        meta: {
          title: '教育厅码值',
          icon: 'icon-treasure-chest',
        },
      },
      {
        path: '/dataManager/social_insurance_code',
        name: 'social_insurance_code',
        component: () => import('@/views/dataManager/social_insurance_code.vue'),
        meta: {
          title: '社保缴纳码值',
          icon: 'icon-transform',
        },
      },
      {
        path: '/dataManager/region',
        name: 'region',
        component: () => import('@/views/dataManager/region.vue'),
        meta: {
          title: '地域纬度管理',
          icon: 'icon-chart-line-area',
        },
      },
      {
        path: '/dataManager/alias',
        name: 'alias',
        component: () => import('@/views/dataManager/alias.vue'),
        meta: {
          title: '别名维护',
          icon: 'icon-curve-adjustment',
        },
      },
    ],
  },
  {
    path: '/relationship',
    component: Layout,
    redirect: '/relationship/index',
    name: 'Relationship',
    children: [
      {
        path: '/relationship/index',
        name: 'RelationshipIndex',
        component: () => import('../views/Relationship/index.vue'),
        meta: {
          title: '关系图谱',
          icon: 'icon-move-in',
          noKeepAlive: true,
        },
      },
    ],
  },
  {
    path: '/search',
    component: Layout,
    redirect: '/search/index',
    name: 'Search',
    children: [
      {
        path: '/search/index',
        name: 'SearchIndex',
        component: () => import('../views/Search/index.vue'),
        meta: {
          title: '搜索',
          icon: 'icon-search',
          noKeepAlive: true,
        },
      },
    ],
  },
  // {
  //   path: '*',
  //   redirect: '/404',
  //   hidden: true,
  // },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
});

// reset router
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

export default router;
