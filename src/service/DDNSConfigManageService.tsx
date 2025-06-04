import React from 'react';
import axios from 'axios/index';
import { DDNSConfigItem, DDNSConfigKey } from '@/obj/DDNSConfigItem';
import { API_CONFIG } from '@/config/api.config';

const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
});

/**
 * 调用后端的服务
 */
class DdnsConfigManageService {
  public static async queryAll() {
    return axiosInstance.get('manager/ddnsConfig/queryAll', {});
  }

  public static async remove(key: DDNSConfigKey) {
    return axiosInstance.postForm('manager/ddnsConfig/remove', key);
  }

  public static async save(record: DDNSConfigItem) {
    return axiosInstance.post('manager/ddnsConfig/save', record, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export default DdnsConfigManageService;
