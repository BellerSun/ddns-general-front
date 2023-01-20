import {CrownFilled, SmileFilled, ReloadOutlined} from '@ant-design/icons';
import WelcomePage from "@/pages/welcome";
import ConfigMainPage from "@/pages/DDNS/ConfigMain";

export default {
  route: {
    path: '/',
    routes: [
      {
        path: '/welcome',
        name: '欢迎',
        icon: <SmileFilled/>,
        component: <WelcomePage/>,
      },
      {
        path: '/DDNS',
        name: 'DDNS配置',
        icon: <CrownFilled/>,
        component: <ConfigMainPage />,
        routes: [
          {
            path: '/DDNS/ConfigMain',
            name: '基础配置',
            icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
            component: <ConfigMainPage />,
          },
        ],
      },
    ],
  },
  location: {
    pathname: '/',
  },
};
