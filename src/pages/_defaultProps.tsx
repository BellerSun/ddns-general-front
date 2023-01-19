import {CrownFilled, SmileFilled, ReloadOutlined} from '@ant-design/icons';

export default {
  route: {
    path: '/',
    routes: [
      {
        path: '/welcome',
        name: '欢迎',
        icon: <SmileFilled/>,
      },
      {
        path: '/DDNS',
        name: 'DDNS配置',
        icon: <CrownFilled/>,
        routes: [
          {
            path: '/DDNS/ConfigMain',
            name: '基础配置',
            icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
          },
        ],
      },
    ],
  },
  location: {
    pathname: '/',
  },
};
