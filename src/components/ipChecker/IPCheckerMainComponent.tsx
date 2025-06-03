import { ProColumns, ProTable } from '@ant-design/pro-components';
import { IPCheckerConfigItem } from '@/obj/IPCheckerConfigItem';
import { Button, message, Popconfirm, Switch, Tag, Modal } from 'antd';
import React, { Component } from 'react';
import BaseLayout from '@/pages/BaseLayout';
import IPCheckerConfigForm from '@/components/ipChecker/IPCheckerConfigForm';
import IPCheckerManageService from '@/service/IPCheckerManageService';

export class IPCheckerMainComponent extends Component<any, any> {
  state = {
    ipCheckerConfigList: [],
    modalShow: false,
    modalType: 'add',
    modalRecord: {},
    testLoading: false,
  };

  constructor(props: any, context: any) {
    super(props, context);
  }

  componentDidMount() {
    this.refreshTable();
  }

  refreshTable() {
    IPCheckerManageService.queryAll()
      .then((resp) => {
        const results = resp && resp.data;
        this.setState({ ipCheckerConfigList: results });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  removeConfig(id: number) {
    IPCheckerManageService.remove(id)
      .then(() => {
        message.success('删除成功').then();
        this.refreshTable();
      })
      .catch((e) => {
        message.error('删除失败').then();
        console.log(e);
      });
  }

  enableConfig(id: number) {
    IPCheckerManageService.enable(id)
      .then(() => {
        message.success('启用成功').then();
        this.refreshTable();
      })
      .catch((e) => {
        message.error('启用失败！').then();
        console.log(e);
      });
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

  /**
   * 测试IP检查器配置
   */
  testConfig(item: IPCheckerConfigItem) {
    this.setState({ testLoading: true });

    IPCheckerManageService.testIpCheckerConfig(item)
      .then((resp) => {
        console.log('测试响应原始数据：', resp);

        // 尝试获取返回的IP结果
        const result = resp?.data?.data || resp?.data || resp;
        const originalResult = result; // 保存原始结果用于调试显示

        // 检查HTTP状态码
        const isHttpSuccess = resp?.status === 200;

        console.log('提取的IP结果：', result);
        console.log('HTTP状态码：', resp?.status);

        if (result && typeof result === 'string' && result.trim()) {
          const trimmedResult = result.trim();

          // 验证是否为有效IP格式
          if (this.isValidIPAddress(trimmedResult)) {
            Modal.success({
              title: '🎉 测试成功',
              content: (
                <div>
                  <p>
                    <strong>配置名称：</strong>
                    {item.configName}
                  </p>
                  <p>
                    <strong>检查地址：</strong>
                    {item.url}
                  </p>
                  <p>
                    <strong>请求方法：</strong>
                    {item.methodType}
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
                    {item.configName}
                  </p>
                  <p>
                    <strong>检查地址：</strong>
                    {item.url}
                  </p>
                  <p>
                    <strong>请求方法：</strong>
                    {item.methodType}
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
                    <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                      {String(originalResult)}
                    </code>
                  </div>
                  <p>
                    <strong>正则表达式：</strong>
                    <code
                      style={{ backgroundColor: '#f5f5f5', padding: '2px 4px' }}
                    >
                      {item.regex}
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
        } else if (isHttpSuccess) {
          // HTTP 200 但返回空数据的情况
          Modal.warning({
            title: '⚠️ 请求成功但未获取到数据',
            content: (
              <div>
                <p>
                  <strong>配置名称：</strong>
                  {item.configName}
                </p>
                <p>
                  <strong>检查地址：</strong>
                  {item.url}
                </p>
                <p>
                  <strong>请求方法：</strong>
                  {item.methodType}
                </p>
                <p>
                  <strong>HTTP状态：</strong>
                  <span style={{ color: '#52c41a' }}>200 成功</span>
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
                  <p style={{ color: '#d46b08', fontSize: '12px', margin: 0 }}>
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
                      <strong>正则表达式无法匹配</strong>
                      ：目标网站内容中没有匹配的IP地址
                    </li>
                    <li>
                      <strong>请求方法不当</strong>：目标网站可能不支持{' '}
                      {item.methodType} 方法
                    </li>
                    <li>
                      <strong>后端处理异常</strong>：后端在解析过程中遇到了问题
                    </li>
                  </ul>
                </div>
              </div>
            ),
            width: 650,
          });
        } else {
          // 其他HTTP状态码或异常情况
          Modal.error({
            title: '❌ 请求失败',
            content: (
              <div>
                <p>
                  <strong>配置名称：</strong>
                  {item.configName}
                </p>
                <p>
                  <strong>检查地址：</strong>
                  {item.url}
                </p>
                <p>
                  <strong>HTTP状态码：</strong>
                  <span style={{ color: '#ff4d4f' }}>
                    {resp?.status || '未知'}
                  </span>
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
                    maxHeight: '200px',
                    overflow: 'auto',
                  }}
                >
                  <code style={{ fontSize: '11px', wordBreak: 'break-all' }}>
                    {JSON.stringify(resp, null, 2)}
                  </code>
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
                {item.configName}
              </p>
              <p>
                <strong>检查地址：</strong>
                {item.url}
              </p>
              <p>
                <strong>请求方法：</strong>
                {item.methodType}
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
                    <code style={{ fontSize: '11px', wordBreak: 'break-all' }}>
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
  }

  /**
   * 给子组件回调使用的，调整弹窗是否展示
   * @param open 是否展示弹窗
   * @param refresh 是否刷新外层表格
   */
  changeModalOpen = (open: boolean, refresh: boolean = false) => {
    this.setState({ modalShow: open });

    if (refresh) {
      this.refreshTable();
    }
  };

  render() {
    const {
      ipCheckerConfigList,
      modalShow,
      modalType,
      modalRecord,
      testLoading,
    } = this.state;
    return (
      <BaseLayout>
        <div>
          <ProTable<IPCheckerConfigItem>
            dataSource={ipCheckerConfigList}
            rowKey={(item) => item.id || Math.random()}
            pagination={{ showQuickJumper: true }}
            columns={this.columns}
            search={false}
            dateFormatter="string"
            headerTitle="IP检查器配置列表"
            toolBarRender={() => [
              <Button key="refreshConfig" onClick={() => this.refreshTable()}>
                刷新配置
              </Button>,
              <Button
                key="addConfig"
                onClick={() =>
                  this.setState({
                    modalShow: true,
                    modalType: 'add',
                    modalRecord: {},
                  })
                }
              >
                新增配置
              </Button>,
            ]}
          />
        </div>

        <IPCheckerConfigForm
          modalShow={modalShow}
          modalType={modalType}
          changeShow={this.changeModalOpen}
          fromFields={modalRecord}
        />
      </BaseLayout>
    );
  }

  // 数据列配置
  columns: ProColumns<IPCheckerConfigItem>[] = [
    {
      title: '配置名称',
      width: 120,
      dataIndex: 'configName',
      sorter: (a, b) => (a.configName > b.configName ? 1 : -1),
    },
    {
      title: '检查地址',
      width: 200,
      dataIndex: 'url',
      ellipsis: true,
    },
    {
      title: '请求方法',
      width: 80,
      dataIndex: 'methodType',
      render: (_, item) => (
        <Tag
          color={
            item.methodType === 'GET'
              ? 'green'
              : item.methodType === 'POST'
              ? 'blue'
              : item.methodType === 'PUT'
              ? 'orange'
              : item.methodType === 'DELETE'
              ? 'red'
              : 'default'
          }
        >
          {item.methodType}
        </Tag>
      ),
    },
    {
      title: 'IP提取正则',
      width: 150,
      dataIndex: 'regex',
      render: (text) => (
        <code
          style={{
            fontSize: '12px',
            backgroundColor: '#f5f5f5',
            padding: '2px 4px',
            borderRadius: '3px',
          }}
        >
          {text}
        </code>
      ),
    },
    {
      title: '启用状态',
      width: 80,
      dataIndex: 'enable',
      render: (_, item) => (
        <Switch
          checked={item.enable}
          onChange={(checked) => {
            if (checked) {
              this.enableConfig(item.id!);
            } else {
              // 如果需要禁用功能，可以在这里添加相应的服务调用
              message.info('请通过启用其他配置来禁用当前配置');
            }
          }}
        />
      ),
      valueEnum: {
        true: { text: '启用' },
        false: { text: '禁用' },
      },
    },
    {
      title: '操作',
      width: 220,
      key: 'option',
      valueType: 'option',
      render: (_, item) => {
        const actions = [
          <a
            key="test"
            onClick={() => this.testConfig(item)}
            style={{ color: '#1890ff' }}
          >
            测试
          </a>,
        ];

        // 只有 id >= 0 的记录才显示修改和删除操作
        if (item.id !== undefined && item.id >= 0) {
          actions.push(
            <a
              key="update"
              onClick={() =>
                this.setState({
                  modalShow: true,
                  modalType: 'update',
                  modalRecord: item,
                })
              }
            >
              修改
            </a>,
          );

          actions.push(
            <Popconfirm
              title="删除IP检查器配置"
              description="😯你确定要删除吗?不可恢复喔~"
              onConfirm={() => {
                this.removeConfig(item.id!);
              }}
              okText="删除"
              okButtonProps={{ danger: true }}
              cancelText="算了~"
            >
              <a href="#" key="remove">
                删除
              </a>
            </Popconfirm>,
          );
        }

        return actions;
      },
    },
  ];
}
