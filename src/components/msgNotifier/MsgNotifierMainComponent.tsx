import { ProColumns, ProTable } from '@ant-design/pro-components';
import {
  MsgNotifierConfigItem,
  MsgNotifierTypeDTO,
} from '@/obj/MsgNotifierConfigItem';
import { Button, message, Popconfirm, Switch, Tag, Modal } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import React, { Component } from 'react';
import BaseLayout from '@/pages/BaseLayout';
import MsgNotifierConfigForm from './MsgNotifierConfigForm';
import MsgNotifierConfigManageService from '@/service/MsgNotifierConfigManageService';

export class MsgNotifierMainComponent extends Component<any, any> {
  state = {
    msgNotifierConfigList: [],
    notifierTypes: [],
    modalShow: false,
    modalType: 'add',
    modalRecord: {},
    sendLoading: false,
    hookVisibility: {} as { [key: number]: boolean }, // 记录每个配置项的Hook显示状态
  };

  constructor(props: any, context: any) {
    super(props, context);
  }

  componentDidMount() {
    this.refreshTable();
    this.loadNotifierTypes();
  }

  refreshTable() {
    MsgNotifierConfigManageService.queryAll()
      .then((resp) => {
        const results = resp && resp.data;
        this.setState({ msgNotifierConfigList: results });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  loadNotifierTypes() {
    MsgNotifierConfigManageService.getNotifierTypes()
      .then((resp) => {
        const results = resp && resp.data;
        this.setState({ notifierTypes: results });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  removeConfig(id: number) {
    MsgNotifierConfigManageService.remove(id)
      .then(() => {
        message.success('删除成功').then();
        this.refreshTable();
      })
      .catch((e) => {
        message.error('删除失败').then();
        console.log(e);
      });
  }

  toggleEnable(id: number, enable: boolean) {
    MsgNotifierConfigManageService.toggleEnable(id, enable)
      .then(() => {
        message.success(enable ? '启用成功' : '禁用成功').then();
        this.refreshTable();
      })
      .catch((e) => {
        message.error(enable ? '启用失败' : '禁用失败').then();
        console.log(e);
      });
  }

  /**
   * 发送测试消息
   */
  sendTestMsg(item: MsgNotifierConfigItem) {
    this.setState({ sendLoading: true });

    MsgNotifierConfigManageService.sendMsg(item)
      .then((resp) => {
        const success = resp?.data || false;
        if (success) {
          Modal.success({
            title: '🎉 测试消息发送成功',
            content: (
              <div>
                <p>
                  <strong>配置名称：</strong>
                  {item.configName}
                </p>
                <p>
                  <strong>通知类型：</strong>
                  {item.notifierType}
                </p>
                <p>
                  <strong>消息类型：</strong>
                  {item.msgType}
                </p>
                <p
                  style={{
                    color: '#52c41a',
                    fontSize: '12px',
                    marginTop: '8px',
                  }}
                >
                  ✅ 测试消息已成功发送！
                </p>
              </div>
            ),
            width: 420,
          });
        } else {
          Modal.warning({
            title: '⚠️ 测试消息发送失败',
            content: (
              <div>
                <p>
                  <strong>配置名称：</strong>
                  {item.configName}
                </p>
                <p>
                  <strong>通知类型：</strong>
                  {item.notifierType}
                </p>
                <p
                  style={{
                    color: '#d46b08',
                    fontSize: '12px',
                    marginTop: '8px',
                  }}
                >
                  请检查配置信息是否正确
                </p>
              </div>
            ),
            width: 420,
          });
        }
      })
      .catch((e) => {
        console.log('发送测试消息失败：', e);
        Modal.error({
          title: '❌ 发送失败',
          content: (
            <div>
              <p>
                <strong>配置名称：</strong>
                {item.configName}
              </p>
              <p>
                <strong>错误信息：</strong>
                <span style={{ color: '#ff4d4f' }}>
                  {e?.response?.data?.message || e?.message || '未知错误'}
                </span>
              </p>
            </div>
          ),
          width: 450,
        });
      })
      .finally(() => {
        this.setState({ sendLoading: false });
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

  /**
   * 切换Hook地址的显示/隐藏状态
   */
  toggleHookVisibility = (configId: number) => {
    this.setState((prevState: any) => ({
      hookVisibility: {
        ...prevState.hookVisibility,
        [configId]: !prevState.hookVisibility[configId],
      },
    }));
  };

  columns: ProColumns<MsgNotifierConfigItem>[] = [
    {
      title: '配置名称',
      dataIndex: 'configName',
      key: 'configName',
      width: 200,
    },
    {
      title: '消息类型',
      dataIndex: 'msgType',
      key: 'msgType',
      width: 120,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '通知器类型',
      dataIndex: 'notifierType',
      key: 'notifierType',
      width: 120,
      render: (text) => {
        const colorMap: { [key: string]: string } = {
          DINGTALK: 'orange',
          FEISHU: 'green',
        };
        return (
          <Tag color={colorMap[text as keyof typeof colorMap] || 'default'}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: 'Hook地址',
      dataIndex: 'hook',
      key: 'hook',
      width: 250,
      render: (text: any, record: MsgNotifierConfigItem) => {
        if (!text || (typeof text === 'string' && text.trim() === '')) {
          return <Tag color="default">空</Tag>;
        }

        const hookText = String(text);
        const isVisible = this.state.hookVisibility[record.id!];
        const displayText = isVisible
          ? hookText
          : '****************************';

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isVisible ? (
              <EyeInvisibleOutlined
                style={{ cursor: 'pointer', color: '#1890ff', flexShrink: 0 }}
                onClick={() => this.toggleHookVisibility(record.id!)}
                title="隐藏Hook地址"
              />
            ) : (
              <EyeOutlined
                style={{ cursor: 'pointer', color: '#1890ff', flexShrink: 0 }}
                onClick={() => this.toggleHookVisibility(record.id!)}
                title="显示Hook地址"
              />
            )}
            <span
              style={{
                flex: 1,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                fontFamily: isVisible ? 'inherit' : 'monospace',
              }}
              title={isVisible ? hookText : '点击眼睛图标查看'}
            >
              {displayText}
            </span>
          </div>
        );
      },
    },
    {
      title: '消息模板',
      dataIndex: 'msgTemplate',
      key: 'msgTemplate',
      width: 200,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'enable',
      key: 'enable',
      width: 80,
      render: (text: any, record: MsgNotifierConfigItem) => (
        <Switch
          checked={record.enable}
          onChange={(checked) => this.toggleEnable(record.id!, checked)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (text, record: MsgNotifierConfigItem) => (
        <div>
          <Button
            type="link"
            size="small"
            onClick={() => {
              this.setState({
                modalShow: true,
                modalType: 'edit',
                modalRecord: record,
              });
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            loading={this.state.sendLoading}
            onClick={() => this.sendTestMsg(record)}
          >
            测试
          </Button>
          <Popconfirm
            title="确定要删除这个配置吗？"
            onConfirm={() => this.removeConfig(record.id!)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  render() {
    return (
      <BaseLayout>
        <ProTable<MsgNotifierConfigItem>
          columns={this.columns}
          dataSource={this.state.msgNotifierConfigList}
          rowKey="id"
          pagination={{
            showQuickJumper: true,
          }}
          search={false}
          dateFormatter="string"
          headerTitle="消息通知配置管理"
          toolBarRender={() => [
            <Button
              key="button"
              type="primary"
              onClick={() => {
                this.setState({
                  modalShow: true,
                  modalType: 'add',
                  modalRecord: {},
                });
              }}
            >
              新建配置
            </Button>,
          ]}
        />
        <MsgNotifierConfigForm
          modalType={this.state.modalType}
          record={this.state.modalRecord}
          notifierTypes={this.state.notifierTypes}
          changeShow={this.changeModalOpen}
          modalShow={this.state.modalShow}
        />
      </BaseLayout>
    );
  }
}
