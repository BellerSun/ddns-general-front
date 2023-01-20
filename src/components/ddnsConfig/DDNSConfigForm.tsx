import React, {Component} from 'react';
import {ModalForm, ProFormDigit, ProFormSelect, ProFormSwitch, ProFormText} from "@ant-design/pro-components";
import {DDNSConfigItem} from "@/obj/DDNSConfigItem";
import DdnsConfigManageService from "@/service/DDNSConfigManageService";
import {message} from "antd";

type DdnsConfigFormProps = {
  /**
   * 是否展示弹窗
   */
  modalShow: Readonly<boolean>
  /**
   * 展示类型：新增、更新
   */
  modalType: Readonly<string>
  /**
   * 修改是否展示的回调
   */
  changeShow: Readonly<Function>
  /**
   * 更新时候，回显传过来的内容
   */
  fromFields: Readonly<DDNSConfigItem>
}

class DdnsConfigForm extends Component<any, any> {

  constructor(props: DdnsConfigFormProps) {
    super(props);
  }

  async formFinished(record: DDNSConfigItem) {
    DdnsConfigManageService.save(record)
      .then(() => {
        message.success('修改成功').then();
        this.closeSelf(true);
      })
      .catch(e => {
        message.error('修改失败！').then();
        console.log(e)
      })
  }

  closeSelf(refresh: boolean = false) {
    const {changeShow} = this.props;
    changeShow(false, refresh);
  }


  render() {
    const {modalShow, modalType, fromFields} = this.props;
    const realFields: DDNSConfigItem = modalType === 'add' ? {} : (fromFields || {});
    return (
      <ModalForm<DDNSConfigItem>
        title={"表单啊"}
        open={modalShow}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            this.closeSelf();
          },
        }}
        onFinish={async (item) => this.formFinished(item)}
      >
        modalType:{modalType}

        <ProFormText name={["ddnsConfigKey", "domainName"]}
                     label="顶级域名"
                     placeholder="请输入顶级域名(例如：baidu.com)"
                     rules={[{required: true, message: '请输入顶级域名!'}]}
                     initialValue={realFields && realFields.ddnsConfigKey && realFields.ddnsConfigKey.domainName}
        />
        <ProFormText name={["ddnsConfigKey", "domainSubName"]}
                     label="解析记录值"
                     placeholder="请输入解析值(例如：www、@等)"
                     rules={[{required: true, message: '请输入解析记录值!'}]}
                     initialValue={realFields && realFields.ddnsConfigKey && realFields.ddnsConfigKey.domainSubName}
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
          placeholder="请选择云服务商类型"
          rules={[{required: true, message: '请选择解析记录类型!'}]}
          fieldProps={{defaultValue: "A"}}
          initialValue={realFields && realFields.ddnsDomainRecordType}
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
          rules={[{required: true, message: '请选择云服务商类型!'}]}
          fieldProps={{defaultValue: "TENCENT"}}
          initialValue={realFields && realFields.dnsServerType}
        />

        <ProFormText name="dnsServerParam"
                     label="服务商验证配置"
                     placeholder="请输入服务商验证配置"
                     rules={[{required: true, message: '请输入服务商验证配置!'}]}
                     fieldProps={{defaultValue: "{}"}}
                     initialValue={realFields && realFields.dnsServerParam}
        />

        <ProFormDigit name="ddnsRecordAliveTime"
                      label="服务商记录缓存时间(ms)"
                      min={1000} max={3600000}
                      fieldProps={{step: 1, defaultValue: 60000}}
                      rules={[{required: true, message: '请输入服务商记录缓存时间!'}]}
                      initialValue={realFields && realFields.ddnsRecordAliveTime}

        />

        <ProFormText name="schedulerCron"
                     label="任务刷新周期Cron表达式"
                     placeholder="请输入任务刷新周期Cron表达式"
                     rules={[{required: true, message: '请输入任务刷新周期Cron表达式!'}]}
                     fieldProps={{defaultValue: "0 0/1 * * * ? "}}
                     initialValue={realFields && realFields.schedulerCron}
        />

        <ProFormSwitch
          name="activate"
          label="启动任务"


          fieldProps={{
            checked: false,
          }}
          initialValue={realFields && realFields.activate}
        />
      </ModalForm>
    );
  }
}

export default DdnsConfigForm;
