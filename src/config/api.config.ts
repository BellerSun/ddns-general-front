// API配置
const getApiBaseUrl = (): string => {
  // 调试信息
  console.log('当前环境:', process.env.NODE_ENV);
  console.log('环境变量API地址:', process.env.REACT_APP_API_BASE_URL);

  // 优先使用环境变量
  if (process.env.REACT_APP_API_BASE_URL) {
    console.log('使用环境变量API地址:', process.env.REACT_APP_API_BASE_URL);
    return process.env.REACT_APP_API_BASE_URL;
  }

  // 如果是生产环境，使用当前域名
  if (process.env.NODE_ENV === 'production') {
    const apiUrl = `${window.location.protocol}//${window.location.host}/api/`;
    console.log('生产环境，使用当前域名API地址:', apiUrl);
    return apiUrl;
  }

  // 开发环境默认使用localhost
  console.log('开发环境，使用localhost API地址');
  return 'http://localhost:3364/api/';
};

export const API_CONFIG = {
  baseURL: getApiBaseUrl(),
  timeout: 5000,
};
