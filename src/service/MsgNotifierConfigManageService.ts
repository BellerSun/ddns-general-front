import axios from 'axios/index';
import { MsgNotifierConfigItem } from '@/obj/MsgNotifierConfigItem';
import { API_CONFIG } from '@/config/api.config';

const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
});

/**
 * 消息通知配置管理服务
 */
class MsgNotifierConfigManageService {
  /**
   * 获取消息通知类型枚举列表
   */
  public static async getNotifierTypes() {
    return axiosInstance.get('manager/msgNotifierConfig/getNotifierTypes', {});
  }

  /**
   * 获取消息类型枚举列表
   */
  public static async getMsgTypes() {
    return axiosInstance.get('manager/msgNotifierConfig/getMsgTypes', {});
  }

  /**
   * 查询所有消息通知配置
   */
  public static async queryAll() {
    return axiosInstance.get('manager/msgNotifierConfig/queryAll', {});
  }

  /**
   * 保存消息通知配置
   */
  public static async save(record: MsgNotifierConfigItem) {
    return axiosInstance.post('manager/msgNotifierConfig/save', record, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * 删除消息通知配置
   */
  public static async remove(id: number) {
    return axiosInstance.post('manager/msgNotifierConfig/remove', null, {
      params: { id },
    });
  }

  /**
   * 启用/禁用消息通知配置
   */
  public static async toggleEnable(id: number, enable: boolean) {
    return axiosInstance.post('manager/msgNotifierConfig/toggleEnable', null, {
      params: { id, enable },
    });
  }

  /**
   * 发送测试消息
   */
  public static async sendMsg(msgNotifierConfigDO: MsgNotifierConfigItem) {
    return axiosInstance.post(
      'manager/msgNotifierConfig/sendMsg',
      msgNotifierConfigDO,
      { headers: { 'Content-Type': 'application/json' } },
    );
  }
}

export default MsgNotifierConfigManageService;
