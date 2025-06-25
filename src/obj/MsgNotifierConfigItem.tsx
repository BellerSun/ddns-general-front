/**
 * 消息通知类型 DTO
 * 用于前端下拉列表展示
 */
export type MsgNotifierTypeDTO = {
  /**
   * 枚举值名称
   */
  name: string;
  /**
   * 显示名称
   */
  displayName: string;
  /**
   * Hook 描述
   */
  hookDesc: string;
};

/**
 * 消息类型 DTO
 * 用于前端下拉列表展示
 */
export type MsgTypeDTO = {
  /**
   * 枚举值名称
   */
  name: string;
  /**
   * 显示名称
   */
  displayName: string;
  /**
   * 描述信息
   */
  desc: string;
  /**
   * 参数说明
   */
  params: Record<string, string>;
};

export type MsgNotifierConfigItem = {
  id?: number;
  /**
   * 纯展示使用，名称
   */
  configName: string;
  /**
   * 消息类型，通常是事件类型或通知类型.不区分大小写
   */
  msgType: string;
  /**
   * 通知器的类型，不区分大小写
   */
  notifierType: string;
  /**
   * 通知的hook
   */
  hook: string;
  /**
   * 通知模板
   */
  msgTemplate: string;
  /**
   * 是否启用
   */
  enable?: boolean;
};
