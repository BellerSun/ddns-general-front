import type {ProSettings} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProLayout, SettingDrawer,} from '@ant-design/pro-components';
import React, {Component} from 'react';
import defaultProps from './_defaultProps';
import {GithubFilled} from "@ant-design/icons";
import WelcomePage from "@/pages/welcome";


//const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({layout: 'side',});
//const [pathname, setPathname] = useState('/list/sub-page/sub-sub-page1');
//const [innerComponent, setInnerComponent] = useState(<WelcomePage/>);
//const [num] = useState(40);

class BaseLayout extends Component<any, any> {

  private defaultSetting: ProSettings = {layout: 'side',};

  state = {
    settings: this.defaultSetting,
    pathname: '/welcome',
    innerComponent: <WelcomePage/>,
  }


  render() {
    const github_url = 'https://github.com/BellerSun/ddns-general-front';
    const {pathname} = this.state;


    const hash = window.location.hash;
    debugger

    return (
      <div
        id="test-pro-layout"
        style={{
          height: '100vh',
        }}
      >
        <ProLayout
          title="DDNS General"
          prefixCls="my-prefix"
          bgLayoutImgList={[
            {
              src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
              left: 85,
              bottom: 100,
              height: '303px',
            },
            {
              src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
              bottom: -68,
              right: -45,
              height: '303px',
            },
            {
              src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
              bottom: 0,
              left: 0,
              width: '331px',
            },
          ]}
          {...defaultProps}
          location={{
            pathname,
          }}
          menu={{
            collapsedShowGroupTitle: true,
          }}
          avatarProps={{
            src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
            size: 'small',
            title: 'Admin',
          }}
          actionsRender={(props) => {
            if (props.isMobile) return [];
            return [
              <GithubFilled key="GithubFilled" onClick={() => {
                window.open(github_url, '_blank')
              }}/>,
            ];
          }}
          headerTitleRender={(logo, title, _) => {
            const defaultDom = (<a>{logo}{title}</a>);
            if (document.body.clientWidth < 1400) {
              return defaultDom;
            }
            if (_.isMobile) return defaultDom;
            return (<>{defaultDom}</>);
          }}
          // 左下角渲染器
          menuFooterRender={(props) => {
            if (props?.collapsed) return undefined;
            return (
              <div
                style={{
                  textAlign: 'center',
                  paddingBlockStart: 12,
                }}
              >
                <div>© 2021 Made with love</div>
                <div>by BellerSun （AntD）</div>
              </div>
            );
          }}
          onMenuHeaderClick={(e) => console.log(e)}
          menuItemRender={(item, dom) => (
            <div
              onClick={() => {
                //setPathname(item.path || '/welcome');
                //setInnerComponent(item.component);
                this.setState({innerComponent: item.component})
              }}
            >
              {dom}
            </div>
          )}
          {...this.state.settings}
        >
          <PageContainer
            token={{
              paddingInlinePageContainerContent: 40,
            }}
          >
            <ProCard
              style={{
                height: '200vh',
                minHeight: 800,
              }}
            >
              <div>
                {this.state.innerComponent}
              </div>
            </ProCard>
          </PageContainer>

          <SettingDrawer
            pathname={pathname}
            enableDarkTheme
            getContainer={() => document.getElementById('test-pro-layout')}
            settings={this.state.settings}
            onSettingChange={(changeSetting) => {
              //setSetting(changeSetting);
              this.setState({settings: changeSetting});
            }}
            disableUrlParams={false}
          />
        </ProLayout>
      </div>
    );
  };

}

export default function BaseLayoutPage() {
  return <BaseLayout/>;
}

