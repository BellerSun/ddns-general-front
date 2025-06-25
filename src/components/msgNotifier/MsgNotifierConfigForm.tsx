import React, { Component } from 'react';
import {
  ModalForm,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import {
  MsgNotifierConfigItem,
  MsgNotifierTypeDTO,
  MsgTypeDTO,
} from '@/obj/MsgNotifierConfigItem';
import MsgNotifierConfigManageService from '@/service/MsgNotifierConfigManageService';
import { message, Button, Modal, Space, Card, Tag } from 'antd';
import { FormInstance } from 'antd/es/form';

type MsgNotifierConfigFormProps = {
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
  record: Readonly<Partial<MsgNotifierConfigItem>>;
  /**
   * 通知器类型列表
   */
  notifierTypes: Readonly<MsgNotifierTypeDTO[]>;
  /**
   * 控制表单是否显示
   */
  modalShow: Readonly<boolean>;
};

class MsgNotifierConfigForm extends Component<MsgNotifierConfigFormProps, any> {
  private formRef = React.createRef<FormInstance>();
  private msgTemplateRef = React.createRef<any>();

  state = {
    testLoading: false,
    notifierTypes: [] as MsgNotifierTypeDTO[],
    notifierTypesLoading: false,
    currentHookDesc: '',
    msgTypes: [] as MsgTypeDTO[],
    msgTypesLoading: false,
    currentMsgParams: {} as Record<string, string>,
  };

  constructor(props: MsgNotifierConfigFormProps) {
    super(props);
  }

  async componentDidMount() {
    await this.loadNotifierTypes();
    await this.loadMsgTypes();
    this.updateHookDescFromInitialValue();
    this.updateMsgParamsFromInitialValue();
  }

  /**
   * 从初始值更新hookDesc（用于编辑模式）
   */
  updateHookDescFromInitialValue() {
    const { record } = this.props;
    if (record?.notifierType) {
      this.updateHookDesc(record.notifierType);
    }
  }

  /**
   * 根据notifierType更新hookDesc
   */
  updateHookDesc(notifierTypeName: string) {
    const { notifierTypes } = this.state;
    const selectedType = notifierTypes.find(
      (type) => type.name === notifierTypeName,
    );
    if (selectedType) {
      this.setState({
        currentHookDesc:
          selectedType.hookDesc || '通知器的Webhook地址或其他通知地址',
      });
    }
  }

  /**
   * 处理notifierType选择变化
   */
  handleNotifierTypeChange = (value: string) => {
    this.updateHookDesc(value);
  };

  /**
   * 从初始值更新msgParams（用于编辑模式）
   */
  updateMsgParamsFromInitialValue() {
    const { record } = this.props;
    if (record?.msgType) {
      this.updateMsgParams(record.msgType);
    }
  }

  /**
   * 根据msgType更新参数说明
   */
  updateMsgParams(msgTypeName: string) {
    const { msgTypes } = this.state;
    const selectedType = msgTypes.find((type) => type.name === msgTypeName);
    if (selectedType) {
      this.setState({
        currentMsgParams: selectedType.params || {},
      });
    }
  }

  /**
   * 处理msgType选择变化
   */
  handleMsgTypeChange = (value: string) => {
    this.updateMsgParams(value);
  };

  /**
   * 加载通知器类型列表
   */
  async loadNotifierTypes() {
    this.setState({ notifierTypesLoading: true });
    try {
      const response = await MsgNotifierConfigManageService.getNotifierTypes();
      const notifierTypes = response.data || [];
      this.setState({ notifierTypes });

      // 如果有初始值，更新hookDesc
      const { record } = this.props;
      if (record?.notifierType) {
        const selectedType = notifierTypes.find(
          (type: MsgNotifierTypeDTO) => type.name === record.notifierType,
        );
        if (selectedType) {
          this.setState({
            currentHookDesc:
              selectedType.hookDesc || '通知器的Webhook地址或其他通知地址',
          });
        }
      }
    } catch (error) {
      console.error('加载通知器类型失败：', error);
      message.error('加载通知器类型失败');
    } finally {
      this.setState({ notifierTypesLoading: false });
    }
  }

  /**
   * 加载消息类型列表
   */
  async loadMsgTypes() {
    this.setState({ msgTypesLoading: true });
    try {
      const response = await MsgNotifierConfigManageService.getMsgTypes();
      const msgTypes = response.data || [];
      this.setState({ msgTypes });

      // 如果有初始值，更新参数说明
      const { record } = this.props;
      if (record?.msgType) {
        const selectedType = msgTypes.find(
          (type: MsgTypeDTO) => type.name === record.msgType,
        );
        if (selectedType) {
          this.setState({
            currentMsgParams: selectedType.params || {},
          });
        }
      }
    } catch (error) {
      console.error('加载消息类型失败：', error);
      message.error('加载消息类型失败');
    } finally {
      this.setState({ msgTypesLoading: false });
    }
  }

  async formFinished(record: MsgNotifierConfigItem) {
    const { modalType } = this.props;

    // 在修改模式下，需要将原有记录的id添加到保存数据中
    const saveData =
      modalType === 'add'
        ? record
        : {
            ...record,
            id: this.props.record?.id, // 添加原有记录的id
          };

    MsgNotifierConfigManageService.save(saveData)
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
      const testConfig: MsgNotifierConfigItem = {
        configName: values.configName,
        msgType: values.msgType,
        notifierType: values.notifierType,
        hook: values.hook,
        msgTemplate: values.msgTemplate,
        enable: values.enable,
      };

      console.log('发送测试消息，配置：', testConfig);

      MsgNotifierConfigManageService.sendMsg(testConfig)
        .then((resp) => {
          console.log('测试响应数据：', resp);
          const success = resp?.data || false;

          if (success) {
            Modal.success({
              title: '🎉 测试消息发送成功',
              content: (
                <div>
                  <p>
                    <strong>配置名称：</strong>
                    {testConfig.configName}
                  </p>
                  <p>
                    <strong>通知类型：</strong>
                    {testConfig.notifierType}
                  </p>
                  <p>
                    <strong>消息类型：</strong>
                    {testConfig.msgType}
                  </p>
                  <p
                    style={{
                      color: '#52c41a',
                      fontSize: '12px',
                      marginTop: '8px',
                    }}
                  >
                    ✅ 测试消息已成功发送，配置可以正常使用！
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
                    {testConfig.configName}
                  </p>
                  <p>
                    <strong>通知类型：</strong>
                    {testConfig.notifierType}
                  </p>
                  <p
                    style={{
                      color: '#d46b08',
                      fontSize: '12px',
                      marginTop: '8px',
                    }}
                  >
                    请检查Hook地址和消息模板是否正确
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
                  {testConfig.configName}
                </p>
                <p>
                  <strong>错误信息：</strong>
                  <span style={{ color: '#ff4d4f' }}>
                    {e?.response?.data?.message || e?.message || '未知错误'}
                  </span>
                </p>
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
                    <li>确认Hook地址是否正确</li>
                    <li>检查消息模板格式是否符合要求</li>
                    <li>验证通知器类型是否支持</li>
                  </ul>
                </div>
              </div>
            ),
            width: 450,
          });
        })
        .finally(() => {
          this.setState({ testLoading: false });
        });
    } catch (error) {
      console.log('表单验证失败：', error);
      message.error('请完善表单内容后再测试');
    }
  }

  closeSelf(refresh: boolean = false) {
    this.props.changeShow(false, refresh);
  }

  render() {
    const { modalType, record } = this.props;
    const {
      notifierTypes,
      notifierTypesLoading,
      currentHookDesc,
      msgTypes,
      msgTypesLoading,
      currentMsgParams,
    } = this.state;

    // 将通知器类型转换为下拉选项
    const notifierTypeOptions = (notifierTypes || []).map(
      (type: MsgNotifierTypeDTO) => ({
        label: `${type.displayName}`,
        value: type.name,
      }),
    );

    // 将消息类型转换为下拉选项
    const msgTypeOptions = (msgTypes || []).map((type: MsgTypeDTO) => ({
      label: `${type.displayName}`,
      value: type.name,
    }));

    return (
      <ModalForm<MsgNotifierConfigItem>
        title={modalType === 'add' ? '新增消息通知配置' : '编辑消息通知配置'}
        formRef={this.formRef}
        open={this.props.modalShow}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => this.closeSelf(),
          width: 800,
        }}
        initialValues={record || {}}
        onFinish={async (values) => {
          await this.formFinished(values);
        }}
        submitter={{
          render: (props, defaultDoms) => {
            return [
              <Space key="buttons">
                <Button onClick={() => this.closeSelf()}>取消</Button>
                <Button
                  type="default"
                  loading={this.state.testLoading}
                  onClick={() => this.testCurrentConfig()}
                >
                  测试发送
                </Button>
                <Button type="primary" onClick={() => props.submit()}>
                  保存
                </Button>
              </Space>,
            ];
          },
        }}
      >
        <ProFormText
          name="configName"
          label="配置名称"
          placeholder="请输入配置名称"
          rules={[
            {
              required: true,
              message: '配置名称为必填项',
            },
          ]}
        />

        <ProFormSelect
          name="msgType"
          label="消息类型"
          placeholder="请选择消息类型"
          options={msgTypeOptions}
          fieldProps={{
            loading: msgTypesLoading,
            onChange: this.handleMsgTypeChange,
          }}
          rules={[
            {
              required: true,
              message: '消息类型为必填项',
            },
          ]}
          tooltip="选择消息的类型，不同类型支持不同的参数占位符"
        />

        <ProFormSelect
          name="notifierType"
          label="通知器类型"
          placeholder="请选择通知器类型"
          options={notifierTypeOptions}
          fieldProps={{
            loading: notifierTypesLoading,
            onChange: this.handleNotifierTypeChange,
          }}
          rules={[
            {
              required: true,
              message: '通知器类型为必填项',
            },
          ]}
          tooltip="选择要使用的通知方式"
        />

        <ProFormText
          name="hook"
          label={'HookID：' + currentHookDesc}
          placeholder="请输入通知的HookID"
          rules={[
            {
              required: true,
              message: 'HookID为必填项',
            },
          ]}
        />

        {/* 消息参数提示区域 */}
        {Object.keys(currentMsgParams).length > 0 && (
          <Card
            size="small"
            title="🔖 可用参数占位符"
            style={{ marginBottom: 16 }}
            bodyStyle={{ padding: '8px 16px' }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(currentMsgParams).map(([key, desc]) => (
                <Tag
                  key={key}
                  color="blue"
                  style={{ margin: 0, cursor: 'pointer' }}
                  onClick={() => {
                    // 点击标签在光标位置插入到msgTemplate中
                    const formRef = this.formRef.current;
                    const textareaRef = this.msgTemplateRef.current;

                    if (!formRef || !textareaRef) return;

                    const placeholder = `\${${key}}`;

                    // 获取textarea元素（优化：直接使用最常见的方式）
                    const textareaElement =
                      textareaRef.resizableTextArea?.textArea ||
                      textareaRef.querySelector?.('textarea') ||
                      textareaRef;

                    if (
                      textareaElement &&
                      textareaElement.tagName === 'TEXTAREA'
                    ) {
                      const start = textareaElement.selectionStart || 0;
                      const end = textareaElement.selectionEnd || 0;
                      const currentTemplate =
                        formRef.getFieldValue('msgTemplate') || '';

                      // 在光标位置插入占位符
                      const newTemplate =
                        currentTemplate.slice(0, start) +
                        placeholder +
                        currentTemplate.slice(end);

                      // 更新表单值
                      formRef.setFieldsValue({
                        msgTemplate: newTemplate,
                      });

                      // 立即设置光标位置（移除setTimeout避免卡顿）
                      const newCursorPos = start + placeholder.length;
                      textareaElement.setSelectionRange(
                        newCursorPos,
                        newCursorPos,
                      );
                      textareaElement.focus();
                    } else {
                      // 回退方案：末尾插入
                      const currentTemplate =
                        formRef.getFieldValue('msgTemplate') || '';
                      formRef.setFieldsValue({
                        msgTemplate: currentTemplate + placeholder,
                      });
                    }
                  }}
                  title={`点击插入 \${${key}} 占位符`}
                >
                  {`\${${key}}`} - {desc}
                </Tag>
              ))}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: '#666',
                marginTop: '8px',
                fontStyle: 'italic',
              }}
            >
              💡 点击上方标签可自动插入对应的占位符到消息模板中
            </div>
          </Card>
        )}

        <ProFormTextArea
          name="msgTemplate"
          label="消息模板"
          placeholder="请输入消息模板，在上方选择消息类型后可查看可用的占位符参数"
          rules={[
            {
              required: true,
              message: '消息模板为必填项',
            },
          ]}
          fieldProps={{
            rows: 4,
            ref: this.msgTemplateRef,
          }}
          tooltip="消息的模板内容，可以使用占位符来动态替换内容"
        />

        <ProFormSwitch
          name="enable"
          label="是否启用"
          tooltip="控制该配置是否生效"
        />
      </ModalForm>
    );
  }
}

export default MsgNotifierConfigForm;
