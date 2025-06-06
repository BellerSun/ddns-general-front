import type {ProSettings} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProLayout, SettingDrawer,} from '@ant-design/pro-components';
import React, {useState} from 'react';
import defaultProps from './_defaultProps';
import {Link} from 'umi';
import {GithubFilled} from "@ant-design/icons";

export default function BaseLayout(props: { children: any; }) {

  const github_url = 'https://github.com/BellerSun/ddns-general-front';
  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
    layout: 'side',
  });

  const [pathname] = useState('/list/sub-page/sub-sub-page1');
  const [num] = useState(40);
  const {children} = props;

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
          <Link to={item.path}>
            <div>
              {dom}
            </div>
          </Link>
        )}
        {...settings}
      >
        <PageContainer
          token={{
            paddingInlinePageContainerContent: num,
          }}
        >
          <ProCard
            style={{
              height: '200vh',
              minHeight: 800,
            }}
          >
            <div>
              {children}
            </div>
          </ProCard>
        </PageContainer>

        <SettingDrawer
          pathname={pathname}
          enableDarkTheme
          getContainer={() => document.getElementById('test-pro-layout')}
          settings={settings}
          onSettingChange={(changeSetting) => {
            setSetting(changeSetting);
          }}
          disableUrlParams={false}
        />
      </ProLayout>
    </div>
  );
};
