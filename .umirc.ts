import {defineConfig} from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  locale: {antd: false},
  routes: [
    {path: '/**', component: '@/pages/index',},
  ],
  fastRefresh: {},
  history: {
    type: "hash"
  }
});
