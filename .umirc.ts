import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  locale: { antd: false },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/welcome', component: '@/pages/welcome' },
    { path: '/ddnsConfig', component: '@/pages/DDNS/ConfigMain' },
    { path: '/ipchecker', component: '@/pages/IPCheckerPage' },
    { path: '/msgnotifier', component: '@/pages/MsgNotifierPage' },

    {
      path: '/DDNS',
      name: 'DDNS',
      icon: 'dashboard',
      routes: [
        {
          path: '/DDNS/ConfigMain',
          icon: 'AreaChartOutlined',
          name: '分析页',
          component: '@/pages/DDNS/ConfigMain',
        },
        {
          path: '/DDNS/monitor',
          icon: 'AreaChartOutlined',
          name: '控制页',
          component: '@/pages/DDNS/ConfigMain',
        },
        {
          path: '/DDNS/IPChecker',
          icon: 'SettingOutlined',
          name: '配置管理',
          component: '@/pages/IPCheckerPage',
        },
        {
          path: '/DDNS/MsgNotifier',
          icon: 'SettingOutlined',
          name: '消息通知',
          component: '@/pages/MsgNotifierPage',
        },
      ],
    },
  ],
  fastRefresh: {},
  history: {
    type: 'hash',
  },
});
