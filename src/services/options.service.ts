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
  | "permissions";

class OptionService {
  actives: InnerOptions = [];
  customsItemInfoOtherTypes: InnerOptions = [];
  mawbStatuses: InnerOptions = [];
  packageStatuses: InnerOptions = [];
  customsStatusNoTypes: InnerOptions = [];
  customsStatusTypes: InnerOptions = [];
  timeZones: (TZ & { label: string, originValue: string })[] = [];
  templateTypes: InnerOptions = [];
  templateColumns: BackendOptions["templateColumns"] = [];
  unitTypes: InnerOptions = [];
  actionCodeList: InnerOptions = [];
  reasonCodeList: InnerOptions = [];
  waybillTrackStatusList: InnerOptions = [];
  customsTrackPackageNoTypes: InnerOptions = [];
  customsTrackStatusNoTypes: InnerOptions = [];
  customsTrackStatusTypes: InnerOptions = [];
  roles: InnerOptions = [];
  customsTemplates: InnerOptions = [];
  prealertTemplates: InnerOptions = [];
  permissions: Schema.Permission[] = [];

  customTemplateTypes = [
    { value: 1, label: "清关文件模板" },
    { value: 2, label: "预报文件模板" },
  ]

  optionConfig = {
    actives: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.id_val_formatter,
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
    customsStatusTypes: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: this.id_val_formatter,
    },
    timeZones: {
      url: "/api/option/getBase",
      optsfrom: "base",
      formater: (opts: TZ[]) => opts.map(zone => ({
        ...zone,
        // value: `${zone.value}_${zone.offset}`,
        // originValue: zone.value,
        label: zone.text,
      }))
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
  } as const;

  constructor() {
    makeAutoObservable(this);
  }

  async laodData() {
    const base = await net.post("/api/option/getBase");
    const roles = await net.post("/api/option/getRoleNames");
    const customsTemplates = await net.post("/api/option/getCustomsTemplates");
    const prealertTemplates = await net.post("/api/option/getPrealertTemplates");
    const permissions = await net.post("/api/option/getPermissions");
    localStorage.setItem('options.base', base);
    localStorage.setItem('options.roles', roles);
    localStorage.setItem('options.customsTemplates', customsTemplates);
    localStorage.setItem('options.prealertTemplates', prealertTemplates);
    localStorage.setItem('options.permissions', permissions);
    return {
      base,
      roles,
      customsTemplates,
      prealertTemplates,
      permissions,
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
