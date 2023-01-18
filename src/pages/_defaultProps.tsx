import {CrownFilled, SmileFilled, ReloadOutlined} from '@ant-design/icons';

export default {
  route: {
    path: '/',
    routes: [
      {
        path: '/welcome',
        name: '欢迎',
        icon: <SmileFilled/>,
        component: './Welcome',
      },
      {
        path: '/ddnsConfig',
        name: 'DDNS配置',
        icon: <ReloadOutlined/>,
        access: 'canAdmin',
        component: './ddnsConfig',
        routes: [
          {
            path: '/ddnsConfig/sub-page1',
            name: '一级页面',
            icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
            component: './Welcome',
          },
          {
            path: '/ddnsConfig/sub-page2',
            name: '二级页面',
            icon: <CrownFilled/>,
            component: './Welcome',
          },
          {
            path: '/ddnsConfig/sub-page3',
            name: '三级页面',
            icon: <CrownFilled/>,
            component: './Welcome',
          },
        ],
      },
    ],
  },
  location: {
    pathname: '/',
  },
};
