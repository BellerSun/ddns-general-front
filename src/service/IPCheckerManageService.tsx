import React from 'react';
import axios from 'axios/index';
import { IPCheckerConfigItem } from '@/obj/IPCheckerConfigItem';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3364/api/',
  timeout: 5000,
});

/**
 * IP检查器配置管理服务
 */
class IPCheckerManageService {
  /**
   * 查询所有IP检查器配置
   */
  public static async queryAll() {
    return axiosInstance.get('manager/ipCheckerConfig/queryAll', {});
  }

  /**
   * 查询当前启用的IP检查器配置
   */
  public static async queryEnable() {
    return axiosInstance.get('manager/ipCheckerConfig/queryEnable', {});
  }

  /**
   * 保存IP检查器配置
   */
  public static async save(record: IPCheckerConfigItem) {
    return axiosInstance.post('manager/ipCheckerConfig/save', record, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * 删除IP检查器配置
   */
  public static async remove(id: number) {
    return axiosInstance.post('manager/ipCheckerConfig/remove', null, {
      params: { id },
    });
  }

  /**
   * 启用指定的IP检查器配置
   */
  public static async enable(id: number) {
    return axiosInstance.post('manager/ipCheckerConfig/enable', null, {
      params: { id },
    });
  }

  /**
   *测试IP检查器配置
   */
  public static async testIpCheckerConfig(
    ipCheckerConfigDO: IPCheckerConfigItem,
  ) {
    return axiosInstance.post(
      'manager/ipCheckerConfig/test',
      ipCheckerConfigDO,
      { headers: { 'Content-Type': 'application/json' } },
    );
  }
}

export default IPCheckerManageService;
