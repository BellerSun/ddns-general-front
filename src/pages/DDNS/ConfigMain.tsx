import React, {Component} from 'react';
import axios from "axios";

import {ProColumns, ProTable} from '@ant-design/pro-components';
import {DDNSConfigItem} from "@/obj/DDNSConfigItem";
import {Button, Switch} from "antd";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3364/api/',
  timeout: 1000
});

class ConfigMain extends Component<any, any> {

  state = {ddnsConfigList: []}

  constructor(props: any, context: any) {
    super(props, context);
  }

  componentDidMount() {
    this.refreshTable();
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    }
  }

  refreshTable() {
    axiosInstance.get("manager/ddnsConfig/queryAll", {})
      .then(resp => {
        const results = resp && resp.data;
        this.setState({ddnsConfigList: results});
      })
      .catch(e => {
        console.log(e)
      });
  }

  render() {
    const {ddnsConfigList} = this.state;
    return (
      <div>
        <ProTable<DDNSConfigItem>
          dataSource={ddnsConfigList}
          rowKey={record => record.ddnsConfigKey.domainName + record.ddnsConfigKey.domainSubName}
          pagination={{showQuickJumper: true,}}
          columns={columns}
          search={false}
          dateFormatter="string"
          headerTitle="配置列表"
          toolBarRender={() => [
            <Button key="refreshConfig" onClick={() => this.refreshTable()}>刷新配置</Button>,
            <Button key="addConfig">新增配置</Button>,
          ]}
        />
      </div>
    );
  }
}


// 数据列配置
const columns: ProColumns<DDNSConfigItem>[] = [
  {
    title: '顶级域名',
    width: 80,
    key: 'ddnsConfigKey_domainName',
    dataIndex: 'ddnsConfigKey',
    render: (_, item) => item.ddnsConfigKey.domainName,
    sorter: (a, b) => (a.ddnsConfigKey.domainName > b.ddnsConfigKey.domainSubName ? 1 : -1),
  },
  {
    title: '二级域名',
    width: 80,
    key: 'ddnsConfigKey_domainSubName',
    dataIndex: 'ddnsConfigKey',
    render: (_, item) => item.ddnsConfigKey.domainSubName,
  },
  {
    title: '服务商类型',
    width: 80,
    dataIndex: 'dnsServerType',
    valueEnum: {
      all: {text: '全部'},
      TENCENT: {text: '腾讯云'},
      HUAWEI: {text: '华为云'},
      ALIYUN: {text: '阿里云'},
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
    render: (_, item) => <Switch checked={item.activate}/>,
    valueEnum: {
      true: {text: '启动'},
      false: {text: '停止'},
    },
  },
  {
    title: '操作',
    width: 180,
    key: 'option',
    valueType: 'option',
    render: () => [
      //todo 待实现逻辑
      <a key="link">修改</a>,
      //todo 待实现逻辑
      <a key="link2">删除</a>,
    ],
  },
];

export default function ConfigMainPage() {
  return <ConfigMain/>;
}
