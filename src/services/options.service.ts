/* eslint-disable @typescript-eslint/no-explicit-any */
import { net } from "@infra";
import { Option } from "../types/common";
import { makeAutoObservable } from "mobx";
import { BackendOptions, Schema } from "@types";
import { get } from "lodash";
import localStorage from "./localStorage";
import { TZ } from "../types/api/options.types";

export type InnerOptions = { value: string | number; label: string }[];

export type OptionKey =
  | "reasonCodeList"
  | "clearanceFileStatusTypes"
  | "customsTrackAddPackageNoTypes"
  | "actives"
  | "customsItemInfoOtherTypes"
  | "mawbStatuses"
  | "packageStatuses"
  | "customsStatusNoTypes"
  | "customsStatusTypes"
  | "timeZones"
  | "templateTypes"
  | "templateColumns"
  | "unitTypes"
  | "actionCodeList"
  | "reasonCodeList"
  | "waybillTrackStatusList"
  | "customsTrackPackageNoTypes"
  | "customsTrackStatusNoTypes"
  | "customsTrackStatusTypes"
  | "roles"
  | "customsTemplates"
  | "prealertTemplates"
  | "permissions"
  | "noTypes"
  | "receiptNoTypes"
  | "receiptStatusTypes"
  | "trackUploadStatusTypes"
  | "deductionStatusTypes"
  | "customsDocumentTypesetting"
  | "loadingTypes"
  | "handoverTypes"
  | "truckTypes"
  | "receiptIssueStatusTypes"
  | "trailProviders"
  | "vendorTypes"
  | "portCodes";

class OptionService {
  clearanceFileStatusTypes: InnerOptions = [];
  actives: InnerOptions = [];
  customsItemInfoOtherTypes: InnerOptions = [];
  mawbStatuses: InnerOptions = [];
  packageStatuses: InnerOptions = [];
  customsStatusNoTypes: InnerOptions = [];
  customsStatusTypes: InnerOptions = [];
  timeZones: (TZ & { label: string; originValue: string })[] = [];
  templateTypes: InnerOptions = [];
  templateColumns: BackendOptions["templateColumns"] = [];
  unitTypes: InnerOptions = [];
  actionCodeList: InnerOptions = [];
  reasonCodeList: InnerOptions = [];
  waybillTrackStatusList: InnerOptions = [];
  customsTrackPackageNoTypes: InnerOptions = [];
  customsTrackStatusNoTypes: InnerOptions = [];
  customsTrackStatusTypes: InnerOptions = [];
  customsTrackAddPackageNoTypes: InnerOptions = [];
  roles: InnerOptions = [];
  customsTemplates: InnerOptions = [];
  prealertTemplates: InnerOptions = [];
  permissions: Schema.Permission[] = [];
  noTypes: InnerOptions = [];
  receiptNoTypes: InnerOptions = [];
  receiptStatusTypes: InnerOptions = [];
  deductionStatusTypes: InnerOptions = [];
  trackUploadStatusTypes: InnerOptions = [];
  receiptIssueStatusTypes: InnerOptions = [];
  customsDocumentTypesetting: InnerOptions = [];
  loadingTypes: InnerOptions = [];
  handoverTypes: InnerOptions = [];
  truckTypes: InnerOptions = [];
  providers: { key: string; label: string }[] = [];
  trailProviders: InnerOptions = [];
  vendorTypes: InnerOptions = [];
  portCodes: InnerOptions = [];

  customTemplateTypes = [
    { value: 1, label: "清关文件模板" },
    { value: 2, label: "预报文件模板" },
  ];

  optionConfig = {
    actives: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.id_val_formatter,
    },
    providers: {
      url: "/api/option/getTailProviders",
      optsfrom: "providers",
      formater: (data: { key: string; val: string }[]) => {
        return data?.map((item) => ({ label: item.val, key: item.key })) ?? [];
      },
    },
    customsItemInfoOtherTypes: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.id_val_formatter,
    },
    mawbStatuses: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.id_val_formatter,
    },
    packageStatuses: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.id_val_formatter,
    },
    customsStatusNoTypes: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.id_val_formatter,
    },
    customsDocumentTypesetting: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.id_val_formatter,
    },
    customsStatusTypes: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.id_val_formatter,
    },
    loadingTypes: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.code_name_formater,
    },
    handoverTypes: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.code_name_formater,
    },
    truckTypes: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.code_name_formater,
    },
    customsTrackAddPackageNoTypes: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.id_val_formatter,
    },
    timeZones: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: (opts: TZ[]) =>
        opts.map((zone) => ({
          ...zone,
          // value: `${zone.value}_${zone.offset}`,
          // originValue: zone.value,
          label: zone.text,
        })),
    },
    templateTypes: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.id_val_formatter,
    },
    templateColumns: {
      url: "/api/option/getBase",
      optsfrom: "base",
      // formater: (opts: BackendOptions["templateColumns"]) =>
      //   opts.map((item) => ({ label: item.cnName, value: item.key })),
      formater: (opts: BackendOptions["templateColumns"]) => opts,
    },
    unitTypes: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.key_val_formater,
    },
    clearanceFileStatusTypes: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.id_val_formatter,
    },
    actionCodeList: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.code_name_formater,
    },
    reasonCodeList: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.code_name_formater,
    },
    waybillTrackStatusList: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.code_name_formater,
    },
    customsTrackPackageNoTypes: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.id_val_formatter,
    },
    customsTrackStatusNoTypes: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.id_val_formatter,
    },
    customsTrackStatusTypes: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.id_val_formatter,
    },
    roles: {
      url: "/api/option/getRoleNames",
      dataGetter: "options",
      optsfrom: "roles",
      formater: this.id_val_formatter,
    },
    customsTemplates: {
      url: "/api/option/getCustomsTemplates",
      dataGetter: "templates",
      optsfrom: "customsTemplates",
      formater: this.id_val_formatter,
    },
    prealertTemplates: {
      url: "/api/option/getPrealertTemplates",
      dataGetter: "templates",
      optsfrom: "prealertTemplates",
      formater: this.id_val_formatter,
    },
    permissions: {
      url: "/api/option/getPermissions",
      dataGetter: "permissions",
      optsfrom: "permissions",
      formater: (opts: Schema.Permission[]) => opts,
    },
    noTypes: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.id_val_formatter,
    },
    receiptNoTypes: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.id_val_formatter,
    },
    receiptStatusTypes: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.id_val_formatter,
    },
    deductionStatusTypes: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.id_val_formatter,
    },
    trackUploadStatusTypes: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.id_val_formatter,
    },
    receiptIssueStatusTypes: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.id_val_formatter,
    },
    trailProviders: {
      url: "/api/warehouse/option/getTailProviders",
      dataGetter: "providers",
      optsfrom: "trailProviders",
      formater: this.id_val_formatter,
    },
    vendorTypes: {
      url: "/api/warehouse/option/getVendorTypes",
      dataGetter: "vendorTypes",
      optsfrom: "vendorTypes",
      formater: this.id_val_formatter,
    },
    portCodes: {
      url: "/api/warehouse/option/getPortCodes",
      optsfrom: "portCodes",
      formater: (data: string[]) => {
        return data?.map((item) => ({ label: item, value: item })) ?? [];
      },
    }
  } as const;

  constructor() {
    makeAutoObservable(this);
  }

  async laodData() {
    const base = await net.post("/api/option/getBase");
    const roles = await net.post("/api/option/getRoleNames");
    const customsTemplates = await net.post("/api/option/getCustomsTemplates");
    const prealertTemplates = await net.post(
      "/api/option/getPrealertTemplates"
    );
    const permissions = await net.post("/api/option/getPermissions");
    const trailProviders = await net.post("/api/warehouse/option/getTailProviders");
    const vendorTypes = await net.post("/api/warehouse/option/getVendorTypes");
    const portCodes = await net.post("/api/warehouse/option/getPortCodes");
    localStorage.setItem("options.base", base);
    localStorage.setItem("options.roles", roles);
    localStorage.setItem("options.customsTemplates", customsTemplates);
    localStorage.setItem("options.prealertTemplates", prealertTemplates);
    localStorage.setItem("options.permissions", permissions);
    localStorage.setItem("options.trailProviders", trailProviders);
    localStorage.setItem("options.vendorTypes", vendorTypes);
    localStorage.setItem("options.portCodes", portCodes);
    return {
      base,
      roles,
      customsTemplates,
      prealertTemplates,
      permissions,
      trailProviders,
      vendorTypes,
      portCodes,
    };
    }

  async init() {
    // const base = localStorage.getItem("options.base") || {};
    // const roles = localStorage.getItem("options.roles") || {};
    // const customsTemplates =
    //   localStorage.getItem("options.customsTemplates") || {};
    // const prealertTemplates =
    //   localStorage.getItem("options.prealertTemplates") || {};
    // const permissions = localStorage.getItem("options.permissions") || {};

    const data = await this.laodData();
    await Promise.all(
      Object.keys(this.optionConfig).map((k) =>
        this.refresh(k as keyof OptionService["optionConfig"], data)
      )
    );
  }

  async refresh<K extends keyof OptionService["optionConfig"]>(
    key: K,
    prefetchedData?: any
  ) {
    const config = this.optionConfig[key];
    const { url, formater, optsfrom } = config;
    const data = (prefetchedData?.[optsfrom] as any) || (await net.post(url));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const opts = get(data, config.dataGetter ?? key);
    const options = formater(opts);
    (this as OptionService)[key] = options as OptionService[K];
  }

  id_val_formatter(data: Option[]): InnerOptions {
    return data?.map((item) => ({ label: item.val, value: item.id })) ?? [];
  }

  key_val_formater(data: { key: string; val: string }[]): InnerOptions {
    return data?.map((item) => ({ label: item.val, value: item.key })) ?? [];
  }

  code_name_formater(data: { code: string; name: string }[]): InnerOptions {
    return data?.map((item) => ({ label: item.name, value: item.code })) ?? [];
  }
}

export default new OptionService();
