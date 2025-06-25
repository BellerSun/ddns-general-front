## ddns-general-front
通用的ddns服务器前端页面源码  
ddns-general 项目链接:[http://localhost:3364/console ]  

## Getting Started

### 调试启动

#### 1. 安装依赖,

node推荐版本：v16.20.2

```bash
$ yarn
```

#### 2. 启动调试服务,
```bash
$ yarn start
```
 

### 打包部署到后端项目
#### 1. 打包
  ```shell
    npm run build 
  ```
#### 2. 部署
  复制 [dist] 目录下 [umi.js] 和 [umi.css] 文件，粘贴到后端项目的[resources/static]目录下，并替换原本js文件。

