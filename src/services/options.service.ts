import { net } from "@infra";
import { Option } from "../types/common";
import localStorage from "./localStorage";
import { makeAutoObservable, runInAction } from "mobx";

export interface Options {
  actives: Option[];
  customsItemInfoOtherTypes: Option[];
  mawbStatuses: Option[];
  packageStatuses: Option[];
  customsStatusNoTypes: Option[];
  customsStatusTypes: Option[];
  timeZones: Option[];
  templateTypes: Option[];
  // templateColumns: { key: string; cnName: string; enName: string }[];
  unitTypes: Option[];
  tikTokActionCodeList: Option[];
  tikTokReasonCodeList: Option[];
  tikTokWaybillStatusList: Option[];
  customTemplateTypes: Option[];
}

const defaultOptions: Options = {
  actives: [],
  customsItemInfoOtherTypes: [],
  mawbStatuses: [],
  packageStatuses: [],
  customsStatusNoTypes: [],
  customsStatusTypes: [],
  timeZones: [],
  templateTypes: [],
  // templateColumns: [],
  unitTypes: [],
  tikTokActionCodeList: [],
  tikTokReasonCodeList: [],
  tikTokWaybillStatusList: [],
  customTemplateTypes: [],
};
class OptionService {
  data: Omit<Options, "templateColumns"> = defaultOptions;

  templateColumns: { key: string; cnName: string; enName: string }[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async load() {
    const options = await net.post("/api/option/getBase");
    runInAction(() => {
      const { templateColumns, ...rest } = options;
      this.templateColumns = templateColumns;
      this.data = {
        ...rest,
        customTemplateTypes: [
          { id: 0, val: "清关文件模板" },
          { id: 1, val: "预报文件模板" },
        ],
      };
    });
    localStorage.setItem("options.templateColumns", {
      data: this.templateColumns,
      params: [],
      time: Date.now(),
    });
    localStorage.setItem("options", {
      data: this.data,
      params: [],
      time: Date.now(),
    });
  }

  init() {
    this.data = localStorage.getItem("options")?.data ?? defaultOptions;
    this.load();
  }

  get<K extends keyof Options>(key: K) {
    const opts = this.data?.[key] || [];
    return opts.map((item) => ({ value: item.id, label: item.val }));
  }
}

export default new OptionService();
