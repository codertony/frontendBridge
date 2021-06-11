import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/c1', component: '@/pages/children/index' },
    { path: '/c2', component: '@/pages/children2/index' },
    { path: '/c3', component: '@/pages/children3/index' },
  ],
  fastRefresh: {},
});
