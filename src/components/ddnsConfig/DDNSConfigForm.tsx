import React, { Component } from 'react';
import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProFormInstance,
} from '@ant-design/pro-components';
import { DDNSConfigItem } from '@/obj/DDNSConfigItem';
import DdnsConfigManageService from '@/service/DDNSConfigManageService';
import { message, Space, Typography } from 'antd';

const { Link } = Typography;

type DdnsConfigFormProps = {
  /**
   * 是否展示弹窗
   */
  modalShow: Readonly<boolean>;
  /**
   * 展示类型：新增、更新
   */
  modalType: Readonly<string>;
  /**
   * 修改是否展示的回调
   */
  changeShow: Readonly<Function>;
  /**
   * 更新时候，回显传过来的内容
   */
  fromFields: Readonly<DDNSConfigItem>;
};

// 云服务商默认配置模板
const DNS_SERVER_DEFAULTS = {
  TENCENT: {
    template: '{"ak": "yourSecretId","sk": "yourSecretKey"}',
    helpLink: 'https://console.cloud.tencent.com/cam/capi',
    helpText: '腾讯云访问管理页面获取SecretId(ak)、SecretKey(sk)',
  },
  ALIYUN: {
    template: '{"ak": "yourAk","sk": "yourSk"}',
    helpLink:
      'https://usercenter.console.aliyun.com/?spm=api-workbench.API%20Explorer.0.0.113b1e0fG0CkQG#/manage/ak',
    helpText: '阿里云用户信息管理页面生成ak、sk',
  },
  HUAWEI: {
    template: '{"ak": "yourAk","sk": "yourSk"}',
    helpLink:
      'https://console.huaweicloud.com/iam/?region=cn-north-4&locale=zh-cn#/mine/accessKey',
    helpText: '华为云我的凭证页面生成ak、sk',
  },
};

interface DdnsConfigFormState {
  currentDnsServerType: string;
}

class DdnsConfigForm extends Component<any, DdnsConfigFormState> {
  private formRef = React.createRef<ProFormInstance>();

  constructor(props: DdnsConfigFormProps) {
    super(props);
    const { modalType, fromFields } = this.props;
    const realFields: DDNSConfigItem =
      modalType === 'add' ? {} : fromFields || {};
    const initialDnsServerType =
      (realFields && realFields.dnsServerType) || 'TENCENT';

    this.state = {
      currentDnsServerType: initialDnsServerType,
    };
  }

  async formFinished(record: DDNSConfigItem) {
    DdnsConfigManageService.save(record)
      .then(() => {
        message.success('修改成功').then();
        this.closeSelf(true);
      })
      .catch((e) => {
        message.error('修改失败！').then();
        console.log(e);
      });
  }

  closeSelf(refresh: boolean = false) {
    const { changeShow } = this.props;
    changeShow(false, refresh);
  }

  // 处理云服务商类型变化
  handleDnsServerTypeChange = (value: string) => {
    this.setState({ currentDnsServerType: value });

    // 自动设置对应的默认模板
    const defaultConfig =
      DNS_SERVER_DEFAULTS[value as keyof typeof DNS_SERVER_DEFAULTS];
    if (defaultConfig && this.formRef.current) {
      // 使用formRef来动态设置字段值
      this.formRef.current.setFieldsValue({
        dnsServerParam: defaultConfig.template,
      });
    }
  };

  // 获取当前服务商的帮助信息
  getCurrentHelpInfo = () => {
    const { currentDnsServerType } = this.state;
    return DNS_SERVER_DEFAULTS[
      currentDnsServerType as keyof typeof DNS_SERVER_DEFAULTS
    ];
  };

  render() {
    const { modalShow, modalType, fromFields } = this.props;
    const realFields: DDNSConfigItem =
      modalType === 'add' ? {} : fromFields || {};
    const helpInfo = this.getCurrentHelpInfo();

    return (
      <ModalForm<DDNSConfigItem>
        title={'DDNS配置'}
        open={modalShow}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            this.closeSelf();
          },
        }}
        onFinish={async (item) => this.formFinished(item)}
        formRef={this.formRef}
      >
        <ProFormText
          name={['ddnsConfigKey', 'domainName']}
          label="顶级域名"
          placeholder="请输入顶级域名(例如：baidu.com)"
          rules={[{ required: true, message: '请输入顶级域名!' }]}
          initialValue={
            realFields &&
            realFields.ddnsConfigKey &&
            realFields.ddnsConfigKey.domainName
          }
        />
        <ProFormText
          name={['ddnsConfigKey', 'domainSubName']}
          label="解析记录值"
          placeholder="请输入解析值(例如：www、@等)"
          rules={[{ required: true, message: '请输入解析记录值!' }]}
          initialValue={
            realFields &&
            realFields.ddnsConfigKey &&
            realFields.ddnsConfigKey.domainSubName
          }
        />

        <ProFormSelect
          name="ddnsDomainRecordType"
          label="解析记录类型"
          valueEnum={{
            A: 'A – 将域名指向IPv4地址',
            CNAME: 'CNAME – 将域名指向另外一个域名',
            MX: 'MX – 将域名指向邮件服务器地址',
            TXT: 'TXT – 设置文本记录',
            NS: 'NS – 将子域名授权给其他NS服务器解析',
            AAAA: 'AAAA – 将域名指向IPv6地址',
            SRV: 'SRV – 记录提供特定服务的服务器',
            CAA: 'CAA – CA证书颁发机构授权校验',
          }}
          placeholder="请选择解析记录类型"
          rules={[{ required: true, message: '请选择解析记录类型!' }]}
          initialValue={(realFields && realFields.ddnsDomainRecordType) || 'A'}
        />

        <ProFormSelect
          name="dnsServerType"
          label="云服务商类型"
          valueEnum={{
            TENCENT: '腾讯云',
            HUAWEI: '华为云',
            ALIYUN: '阿里云',
          }}
          placeholder="请选择云服务商类型"
          rules={[{ required: true, message: '请选择云服务商类型!' }]}
          initialValue={this.state.currentDnsServerType}
          fieldProps={{
            onChange: (value: string) => {
              this.handleDnsServerTypeChange(value);
            },
          }}
        />

        <ProFormTextArea
          name="dnsServerParam"
          label={
            <Space direction="vertical" size={4}>
              <span>服务商验证配置</span>
              {helpInfo && (
                <Link
                  href={helpInfo.helpLink}
                  target="_blank"
                  style={{ fontSize: '12px', color: '#1890ff' }}
                >
                  点击前往{helpInfo.helpText} →
                </Link>
              )}
            </Space>
          }
          placeholder="请输入服务商验证配置(JSON格式)"
          rules={[
            { required: true, message: '请输入服务商验证配置!' },
            {
              validator: (_: any, value: any) => {
                try {
                  JSON.parse(value);
                  return Promise.resolve();
                } catch (e) {
                  return Promise.reject(new Error('请输入有效的JSON格式'));
                }
              },
            },
          ]}
          initialValue={
            (realFields && realFields.dnsServerParam) ||
            DNS_SERVER_DEFAULTS.TENCENT.template
          }
          fieldProps={{
            rows: 3,
          }}
        />

        <ProFormDigit
          name="ddnsRecordAliveTime"
          label="服务商记录缓存时间(ms)"
          min={1000}
          max={3600000}
          fieldProps={{ step: 1, defaultValue: 60000 }}
          rules={[{ required: true, message: '请输入服务商记录缓存时间!' }]}
          initialValue={(realFields && realFields.ddnsRecordAliveTime) || 60000}
        />

        <ProFormText
          name="schedulerCron"
          label="任务刷新周期Cron表达式"
          placeholder="请输入任务刷新周期Cron表达式"
          rules={[{ required: true, message: '请输入任务刷新周期Cron表达式!' }]}
          initialValue={
            (realFields && realFields.schedulerCron) || '0 0/1 * * * ? '
          }
        />

        <ProFormSwitch
          name="activate"
          label="启动任务"
          initialValue={(realFields && realFields.activate) || false}
        />
      </ModalForm>
    );
  }
}

export default DdnsConfigForm;
