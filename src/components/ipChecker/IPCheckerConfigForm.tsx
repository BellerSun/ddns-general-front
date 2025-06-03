import React, { Component } from 'react';
import {
  ModalForm,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { IPCheckerConfigItem, MethodType } from '@/obj/IPCheckerConfigItem';
import IPCheckerManageService from '@/service/IPCheckerManageService';
import { message, Button, Modal, Space } from 'antd';
import { FormInstance } from 'antd/es/form';

type IPCheckerConfigFormProps = {
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
  fromFields: Readonly<IPCheckerConfigItem>;
};

class IPCheckerConfigForm extends Component<any, any> {
  private formRef = React.createRef<FormInstance>();

  state = {
    testLoading: false,
  };

  constructor(props: IPCheckerConfigFormProps) {
    super(props);
  }

  /**
   * 验证是否为有效的IP地址格式（IPv4）
   */
  isValidIPAddress(ip: string): boolean {
    if (!ip || typeof ip !== 'string') {
      return false;
    }

    // 去除首尾空白字符
    const trimmedIp = ip.trim();

    // IPv4 正则表达式：严格验证每个段是否在0-255范围内
    const ipv4Regex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (ipv4Regex.test(trimmedIp)) {
      return true;
    }

    // IPv6 简单验证（可选，根据需要启用）
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
    if (ipv6Regex.test(trimmedIp)) {
      return true;
    }

    return false;
  }

  async formFinished(record: IPCheckerConfigItem) {
    const { modalType, fromFields } = this.props;

    // 在修改模式下，需要将原有记录的id添加到保存数据中
    const saveData =
      modalType === 'add'
        ? record
        : {
            ...record,
            id: fromFields?.id, // 添加原有记录的id
          };

    IPCheckerManageService.save(saveData)
      .then(() => {
        message.success('保存成功').then();
        this.closeSelf(true);
      })
      .catch((e) => {
        message.error('保存失败！').then();
        console.log(e);
      });
  }

  /**
   * 测试当前表单配置
   */
  async testCurrentConfig() {
    if (!this.formRef.current) {
      message.error('表单未准备就绪');
      return;
    }

    try {
      // 验证表单
      const values = await this.formRef.current.validateFields();

      this.setState({ testLoading: true });

      // 构建测试配置对象
      const testConfig: IPCheckerConfigItem = {
        configName: values.configName,
        url: values.url,
        methodType: values.methodType,
        regex: values.regex,
        enable: values.enable,
      };

      console.log('发送测试请求，配置：', testConfig);

      IPCheckerManageService.testIpCheckerConfig(testConfig)
        .then((resp) => {
          console.log('测试响应原始数据：', resp);

          // 尝试多种可能的数据结构
          const result = resp?.data?.data || resp?.data || resp;
          const originalResult = result; // 保存原始结果用于调试显示

          console.log('提取的结果：', result);

          // 检查HTTP状态码
          const isHttpSuccess = resp?.status === 200;

          // 检查结果是否为有效的IP地址字符串
          if (
            result &&
            typeof result === 'string' &&
            result.trim() &&
            result !== 'null' &&
            result !== 'undefined'
          ) {
            const trimmedResult = result.trim();

            // 验证是否为有效IP格式
            if (this.isValidIPAddress(trimmedResult)) {
              Modal.success({
                title: '🎉 测试成功',
                content: (
                  <div>
                    <p>
                      <strong>配置名称：</strong>
                      {testConfig.configName}
                    </p>
                    <p>
                      <strong>检查地址：</strong>
                      {testConfig.url}
                    </p>
                    <p>
                      <strong>请求方法：</strong>
                      {testConfig.methodType}
                    </p>
                    <p>
                      <strong>获取到的IP：</strong>
                      <code
                        style={{
                          color: '#1890ff',
                          fontSize: '14px',
                          fontWeight: 'bold',
                        }}
                      >
                        {trimmedResult}
                      </code>
                    </p>
                    <p
                      style={{
                        color: '#52c41a',
                        fontSize: '12px',
                        marginTop: '8px',
                      }}
                    >
                      ✅ IP格式验证通过，配置可以正常使用！
                    </p>
                  </div>
                ),
                width: 520,
              });
            } else {
              // 返回了数据但不是有效IP格式
              Modal.warning({
                title: '⚠️ 获取到数据但不是有效IP格式',
                content: (
                  <div>
                    <p>
                      <strong>配置名称：</strong>
                      {testConfig.configName}
                    </p>
                    <p>
                      <strong>检查地址：</strong>
                      {testConfig.url}
                    </p>
                    <p>
                      <strong>请求方法：</strong>
                      {testConfig.methodType}
                    </p>
                    <p>
                      <strong>返回的原始数据：</strong>
                    </p>
                    <div
                      style={{
                        backgroundColor: '#f5f5f5',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #d9d9d9',
                        marginTop: '4px',
                      }}
                    >
                      <code
                        style={{ fontSize: '12px', wordBreak: 'break-all' }}
                      >
                        {String(originalResult)}
                      </code>
                    </div>
                    <p>
                      <strong>正则表达式：</strong>
                      <code
                        style={{
                          backgroundColor: '#f5f5f5',
                          padding: '2px 4px',
                        }}
                      >
                        {testConfig.regex}
                      </code>
                    </p>
                    <div
                      style={{
                        marginTop: '12px',
                        padding: '8px',
                        backgroundColor: '#fff7e6',
                        borderRadius: '4px',
                        border: '1px solid #ffd591',
                      }}
                    >
                      <p
                        style={{
                          color: '#d46b08',
                          fontSize: '12px',
                          margin: 0,
                        }}
                      >
                        💡 <strong>可能的原因：</strong>
                      </p>
                      <ul
                        style={{
                          color: '#d46b08',
                          fontSize: '12px',
                          margin: '4px 0 0 16px',
                        }}
                      >
                        <li>
                          <strong>正则表达式匹配异常</strong>
                          ：获取到了内容但不是IP地址格式
                        </li>
                        <li>
                          <strong>目标网站返回格式变化</strong>
                          ：网站可能更改了IP显示格式
                        </li>
                        <li>
                          <strong>包含额外字符</strong>
                          ：结果可能包含换行符、空格或其他字符
                        </li>
                      </ul>
                    </div>
                    <div
                      style={{
                        marginTop: '8px',
                        padding: '8px',
                        backgroundColor: '#f6ffed',
                        borderRadius: '4px',
                        border: '1px solid #b7eb8f',
                      }}
                    >
                      <p
                        style={{
                          color: '#389e0d',
                          fontSize: '12px',
                          margin: 0,
                        }}
                      >
                        🔧 <strong>建议操作：</strong>
                      </p>
                      <ul
                        style={{
                          color: '#389e0d',
                          fontSize: '12px',
                          margin: '4px 0 0 16px',
                        }}
                      >
                        <li>检查并调整正则表达式以准确匹配IP地址</li>
                        <li>在浏览器中访问目标URL，确认返回的内容格式</li>
                        <li>考虑是否需要过滤掉多余的字符（如换行符等）</li>
                      </ul>
                    </div>
                  </div>
                ),
                width: 650,
              });
            }
          } else if (
            isHttpSuccess &&
            (result === '' || result === null || result === undefined)
          ) {
            // HTTP 200 但返回空数据的情况
            Modal.warning({
              title: '⚠️ 请求成功但未获取到数据',
              content: (
                <div>
                  <p>
                    <strong>配置名称：</strong>
                    {testConfig.configName}
                  </p>
                  <p>
                    <strong>检查地址：</strong>
                    {testConfig.url}
                  </p>
                  <p>
                    <strong>请求方法：</strong>
                    {testConfig.methodType}
                  </p>
                  <p>
                    <strong>正则表达式：</strong>
                    <code
                      style={{ backgroundColor: '#f5f5f5', padding: '2px 4px' }}
                    >
                      {testConfig.regex}
                    </code>
                  </p>
                  <p>
                    <strong>服务器响应：</strong>
                    <span style={{ color: '#52c41a' }}>HTTP 200 成功</span>
                    ，但返回空数据
                  </p>
                  <p>
                    <strong>原始响应数据：</strong>
                  </p>
                  <div
                    style={{
                      backgroundColor: '#f5f5f5',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #d9d9d9',
                      marginTop: '4px',
                    }}
                  >
                    <code style={{ fontSize: '11px', wordBreak: 'break-all' }}>
                      {JSON.stringify(originalResult, null, 2)}
                    </code>
                  </div>
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '8px',
                      backgroundColor: '#fff7e6',
                      borderRadius: '4px',
                      border: '1px solid #ffd591',
                    }}
                  >
                    <p
                      style={{ color: '#d46b08', fontSize: '12px', margin: 0 }}
                    >
                      💡 <strong>可能的原因：</strong>
                    </p>
                    <ul
                      style={{
                        color: '#d46b08',
                        fontSize: '12px',
                        margin: '4px 0 0 16px',
                      }}
                    >
                      <li>
                        <strong>正则表达式问题</strong>
                        ：无法从目标网站内容中匹配到IP地址
                      </li>
                      <li>
                        <strong>请求方法不当</strong>：目标网站可能不支持{' '}
                        {testConfig.methodType} 方法
                      </li>
                      <li>
                        <strong>目标网站问题</strong>：网站返回内容格式发生变化
                      </li>
                      <li>
                        <strong>后端处理异常</strong>
                        ：后端在处理过程中遇到了问题
                      </li>
                    </ul>
                  </div>
                  <div
                    style={{
                      marginTop: '8px',
                      padding: '8px',
                      backgroundColor: '#f6ffed',
                      borderRadius: '4px',
                      border: '1px solid #b7eb8f',
                    }}
                  >
                    <p
                      style={{ color: '#389e0d', fontSize: '12px', margin: 0 }}
                    >
                      🔧 <strong>建议操作：</strong>
                    </p>
                    <ul
                      style={{
                        color: '#389e0d',
                        fontSize: '12px',
                        margin: '4px 0 0 16px',
                      }}
                    >
                      <li>尝试使用 GET 方法代替 POST</li>
                      <li>检查目标URL是否在浏览器中能正常显示IP</li>
                      <li>测试正则表达式是否能匹配预期格式</li>
                      <li>查看后端日志确认具体错误原因</li>
                    </ul>
                  </div>
                </div>
              ),
              width: 650,
            });
          } else {
            // 其他异常情况
            Modal.warning({
              title: '⚠️ 测试结果异常',
              content: (
                <div>
                  <p>
                    <strong>配置名称：</strong>
                    {testConfig.configName}
                  </p>
                  <p>
                    <strong>检查地址：</strong>
                    {testConfig.url}
                  </p>
                  <p>
                    <strong>HTTP状态：</strong>
                    {resp?.status || '未知'}
                  </p>
                  <p>
                    <strong>返回结果：</strong>
                    <code
                      style={{ backgroundColor: '#f5f5f5', padding: '2px 4px' }}
                    >
                      {JSON.stringify(result)}
                    </code>
                  </p>
                  <p>
                    <strong>完整响应数据：</strong>
                  </p>
                  <div
                    style={{
                      backgroundColor: '#f5f5f5',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #d9d9d9',
                      marginTop: '4px',
                      maxHeight: '200px',
                      overflow: 'auto',
                    }}
                  >
                    <code style={{ fontSize: '11px', wordBreak: 'break-all' }}>
                      {JSON.stringify(resp, null, 2)}
                    </code>
                  </div>
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '8px',
                      backgroundColor: '#fff7e6',
                      borderRadius: '4px',
                      border: '1px solid #ffd591',
                    }}
                  >
                    <p
                      style={{ color: '#d46b08', fontSize: '12px', margin: 0 }}
                    >
                      💡 <strong>可能的原因：</strong>
                    </p>
                    <ul
                      style={{
                        color: '#d46b08',
                        fontSize: '12px',
                        margin: '4px 0 0 16px',
                      }}
                    >
                      <li>服务器返回了意外的数据格式</li>
                      <li>网络连接存在问题</li>
                      <li>后端接口实现有误</li>
                    </ul>
                  </div>
                </div>
              ),
              width: 600,
            });
          }
        })
        .catch((e) => {
          console.log('测试失败：', e);

          // 提取错误相关的返回数据
          const errorData = e?.response?.data;
          const statusCode = e?.response?.status;

          Modal.error({
            title: '❌ 测试失败',
            content: (
              <div>
                <p>
                  <strong>配置名称：</strong>
                  {testConfig.configName}
                </p>
                <p>
                  <strong>检查地址：</strong>
                  {testConfig.url}
                </p>
                <p>
                  <strong>请求方法：</strong>
                  {testConfig.methodType}
                </p>
                <p>
                  <strong>错误信息：</strong>
                  <span style={{ color: '#ff4d4f' }}>
                    {e?.response?.data?.message || e?.message || '未知错误'}
                  </span>
                </p>
                {statusCode && (
                  <p>
                    <strong>HTTP状态码：</strong>
                    <span style={{ color: '#ff4d4f' }}>{statusCode}</span>
                  </p>
                )}

                {errorData && (
                  <>
                    <p>
                      <strong>服务器返回数据：</strong>
                    </p>
                    <div
                      style={{
                        backgroundColor: '#f5f5f5',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #d9d9d9',
                        marginTop: '4px',
                        maxHeight: '150px',
                        overflow: 'auto',
                      }}
                    >
                      <code
                        style={{ fontSize: '11px', wordBreak: 'break-all' }}
                      >
                        {JSON.stringify(errorData, null, 2)}
                      </code>
                    </div>
                  </>
                )}

                <div
                  style={{
                    marginTop: '12px',
                    padding: '8px',
                    backgroundColor: '#fafafa',
                    borderRadius: '4px',
                  }}
                >
                  <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>
                    💡 <strong>调试建议：</strong>
                  </p>
                  <ul
                    style={{
                      color: '#666',
                      fontSize: '12px',
                      margin: '4px 0 0 16px',
                    }}
                  >
                    <li>确认URL地址是否可以正常访问</li>
                    <li>检查请求方法是否正确（建议优先尝试GET）</li>
                    <li>验证正则表达式是否能匹配目标网站的IP格式</li>
                    <li>检查后端服务是否正常运行</li>
                    {statusCode === 404 && (
                      <li style={{ color: '#ff4d4f' }}>
                        404错误：检查URL地址是否正确
                      </li>
                    )}
                    {statusCode === 403 && (
                      <li style={{ color: '#ff4d4f' }}>
                        403错误：目标网站可能拒绝访问
                      </li>
                    )}
                    {statusCode === 500 && (
                      <li style={{ color: '#ff4d4f' }}>
                        500错误：后端服务器内部错误
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ),
            width: 650,
          });
        })
        .finally(() => {
          this.setState({ testLoading: false });
        });
    } catch (error) {
      message.error('请先填写完整的表单信息');
    }
  }

  closeSelf(refresh: boolean = false) {
    const { changeShow } = this.props;
    changeShow(false, refresh);
  }

  render() {
    const { modalShow, modalType, fromFields } = this.props;
    const { testLoading } = this.state;
    const realFields: IPCheckerConfigItem =
      modalType === 'add' ? {} : fromFields || {};

    return (
      <ModalForm<IPCheckerConfigItem>
        title={modalType === 'add' ? '新增IP检查器配置' : '编辑IP检查器配置'}
        open={modalShow}
        formRef={this.formRef}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            this.closeSelf();
          },
        }}
        submitter={{
          render: (props, defaultDoms) => {
            return [
              <Space key="buttons">
                <Button
                  key="test"
                  type="dashed"
                  loading={testLoading}
                  onClick={() => this.testCurrentConfig()}
                  style={{ borderColor: '#1890ff', color: '#1890ff' }}
                >
                  🧪 测试配置
                </Button>
                {defaultDoms}
              </Space>,
            ];
          },
        }}
        onFinish={async (item) => this.formFinished(item)}
      >
        <ProFormText
          name="configName"
          label="配置名称"
          placeholder="请输入配置名称"
          rules={[{ required: true, message: '请输入配置名称!' }]}
          initialValue={realFields?.configName}
        />

        <ProFormText
          name="url"
          label="检查地址"
          placeholder="请输入IP检查URL地址"
          rules={[{ required: true, message: '请输入IP检查URL地址!' }]}
          initialValue={realFields?.url}
        />

        <ProFormSelect
          name="methodType"
          label="请求方法"
          valueEnum={{
            GET: 'GET',
            POST: 'POST',
            PUT: 'PUT',
            DELETE: 'DELETE',
            HEAD: 'HEAD',
            OPTIONS: 'OPTIONS',
            PATCH: 'PATCH',
          }}
          placeholder="请选择请求方法"
          rules={[{ required: true, message: '请选择请求方法!' }]}
          initialValue={realFields?.methodType || MethodType.GET}
        />

        <ProFormText
          name="regex"
          label="IP提取正则表达式"
          placeholder="请输入用于提取IP地址的正则表达式"
          rules={[{ required: true, message: '请输入IP提取正则表达式!' }]}
          initialValue={
            realFields?.regex || '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b'
          }
        />

        {/* <ProFormSwitch
          name="enable"
          label="启用状态"
          initialValue={realFields?.enable || false}
        /> */}
      </ModalForm>
    );
  }
}

export default IPCheckerConfigForm;
