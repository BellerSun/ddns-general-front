export type DDNSConfigKey = {
  domainName: string;
  domainSubName: string;
};

export type DDNSConfigItem = {
  ddnsConfigKey: DDNSConfigKey;
  dnsServerType: string;
  dnsServerParam: string;
  ddnsRecordAliveTime: number;
  ddnsDomainRecordType: string;
  schedulerCron: string;
  activate: boolean;
  lastQueryTime?: number;
  lastIp?: string;
};
