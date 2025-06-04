import { ProColumns, ProTable } from '@ant-design/pro-components';
import { DDNSConfigItem, DDNSConfigKey } from '@/obj/DDNSConfigItem';
import { Button, message, Popconfirm, Switch, Tooltip } from 'antd';
import React, { Component } from 'react';
import BaseLayout from '@/pages/BaseLayout';
import DdnsConfigForm from '@/components/ddnsConfig/DDNSConfigForm';
import DdnsConfigManageService from '@/service/DDNSConfigManageService';
import { PlayCircleOutlined } from '@ant-design/icons';

export class ConfigMainComponent extends Component<any, any> {
  state = {
    ddnsConfigList: [],
    modalShow: false,
    modalType: 'add',
    modalRecord: {},
  };

  constructor(props: any, context: any) {
    super(props, context);
  }

  componentDidMount() {
    this.refreshTable();
  }

  refreshTable() {
    DdnsConfigManageService.queryAll()
      .then((resp) => {
        const results = resp && resp.data;
        this.setState({ ddnsConfigList: results });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  removeConfig(key: DDNSConfigKey) {
    DdnsConfigManageService.remove(key)
      .then(() => {
        message.success('删除成功').then();
        this.refreshTable();
      })
      .catch((e) => {
        message.error('删除失败').then();
        console.log(e);
      });
  }

  saveConfig(record: DDNSConfigItem) {
    DdnsConfigManageService.save(record)
      .then(() => {
        message.success('状态修改成功').then();
        this.refreshTable();
      })
      .catch((e) => {
        message.error('状态修改失败！').then();
        console.log(e);
      });
  }

  /**
   * 立即运行DDNS配置
   * @param key DDNS配置的key
   */
  runNowConfig(key: DDNSConfigKey) {
    DdnsConfigManageService.runNow(key)
      .then(() => {
        message.success('立即运行成功！').then();
      })
      .catch((e) => {
        message.error('立即运行失败！').then();
        console.log(e);
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
    const { ddnsConfigList, modalShow, modalType, modalRecord } = this.state;
    return (
      <BaseLayout>
        <div>
          <ProTable<DDNSConfigItem>
            dataSource={ddnsConfigList}
            rowKey={(item) =>
              item.ddnsConfigKey.domainName +
              '_' +
              item.ddnsConfigKey.domainSubName
            }
            pagination={{ showQuickJumper: true }}
            columns={this.columns}
            search={false}
            dateFormatter="string"
            headerTitle="配置列表"
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

        <DdnsConfigForm
          modalShow={modalShow}
          modalType={modalType}
          changeShow={this.changeModalOpen}
          fromFields={modalRecord}
        />
      </BaseLayout>
    );
  }

  // 数据列配置
  columns: ProColumns<DDNSConfigItem>[] = [
    {
      title: '二级域名',
      width: 80,
      key: 'ddnsConfigKey_domainSubName',
      dataIndex: 'ddnsConfigKey',
      render: (_, item) => item.ddnsConfigKey.domainSubName,
    },
    {
      title: '顶级域名',
      width: 80,
      key: 'ddnsConfigKey_domainName',
      dataIndex: 'ddnsConfigKey',
      render: (_, item) => item.ddnsConfigKey.domainName,
      sorter: (a, b) =>
        a.ddnsConfigKey.domainName > b.ddnsConfigKey.domainSubName ? 1 : -1,
    },
    {
      title: '服务商类型',
      width: 80,
      dataIndex: 'dnsServerType',
      valueEnum: {
        all: { text: '全部' },
        TENCENT: { text: '腾讯云' },
        HUAWEI: { text: '华为云' },
        ALIYUN: { text: '阿里云' },
      },
    },
    /*  {
        title: '服务商配置',
        width: 80,
        dataIndex: 'dnsServerParam',
      },*/
    {
      title: '记录生存时间',
      width: 80,
      dataIndex: 'ddnsRecordAliveTime',
      render: (_) => _,
    },

    {
      title: '刷新周期',
      width: 80,
      dataIndex: 'schedulerCron',
      render: (_) => _,
    },
    {
      title: '启动状态',
      width: 80,
      dataIndex: 'activate',
      render: (_, item) => (
        <Switch
          checked={item.activate}
          onChange={(newActivate, b) => {
            item.activate = newActivate;
            this.saveConfig(item);
          }}
        />
      ),
      valueEnum: {
        true: { text: '启动' },
        false: { text: '停止' },
      },
    },
    {
      title: '操作',
      width: 180,
      key: 'option',
      valueType: 'option',
      render: (_, item) => [
        <Popconfirm
          key="runNow"
          title="立即运行DDNS"
          description={`确定要立即运行 ${item.ddnsConfigKey.domainSubName}.${item.ddnsConfigKey.domainName} 的任务吗？`}
          onConfirm={() => this.runNowConfig(item.ddnsConfigKey)}
          okText="确定运行"
          okButtonProps={{ type: 'primary' }}
          cancelText="取消"
        >
          <Tooltip title="立即运行">
            <Button
              type="text"
              icon={<PlayCircleOutlined />}
              size="small"
              style={{
                color: '#52c41a',
                transition: 'all 0.2s ease-in-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.2)';
                e.currentTarget.style.color = '#389e0d';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.color = '#52c41a';
              }}
            />
          </Tooltip>
        </Popconfirm>,

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

        <Popconfirm
          title="删除任务配置"
          description="😯你确定要删除吗?不可恢复喔~"
          onConfirm={() => {
            this.removeConfig(item.ddnsConfigKey);
          }}
          okText="删除"
          okButtonProps={{ danger: true }}
          cancelText="算了~"
        >
          <a href="#" key="remove">
            删除
          </a>
        </Popconfirm>,
      ],
    },
  ];
}
