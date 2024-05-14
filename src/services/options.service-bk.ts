// import { net } from "@infra";
// import { Option } from "../types/common";
// import localStorage from "./localStorage";
// import { makeAutoObservable, runInAction } from "mobx";

// export interface Options {
//   actives: Option[];
//   customsItemInfoOtherTypes: Option[];
//   mawbStatuses: Option[];
//   packageStatuses: Option[];
//   customsStatusNoTypes: Option[];
//   customsStatusTypes: Option[];
//   templateTypes: Option[];
//   // templateColumns: { key: string; cnName: string; enName: string }[];
//   unitTypes: { key: string; val: string }[];
//   tikTokActionCodeList: { code: string; name: string }[];
//   tikTokReasonCodeList: { code: string; name: string }[];
//   tikTokWaybillStatusList: { code: string; name: string }[];
//   customTemplateTypes: Option[];
//   timeZones: { key: string; val: string }[];
// }

// const defaultOptions: Options = {
//   actives: [],
//   customsItemInfoOtherTypes: [],
//   mawbStatuses: [],
//   packageStatuses: [],
//   customsStatusNoTypes: [],
//   customsStatusTypes: [],
//   timeZones: [],
//   templateTypes: [],
//   // templateColumns: [],
//   unitTypes: [],
//   tikTokActionCodeList: [],
//   tikTokReasonCodeList: [],
//   tikTokWaybillStatusList: [],
//   customTemplateTypes: [],
// };
// class OptionService {
//   data: Omit<Options, "templateColumns"> = defaultOptions;

//   templateColumns: { key: string; cnName: string; enName: string }[] = [];
//   roles: Option[] = [];
//   customsTemplates: Option[] = [];
//   prealertTemplates: Option[] = [];

//   constructor() {
//     makeAutoObservable(this);
//   }

//   async load() {
//     this.loadBase();
//     this.loadRoles();
//     this.loadCustomsTemplates();
//     this.loadPrealertTemplates();
//   }

//   async loadRoles() {
//     const options = await net.post("/api/option/getRoleNames");
//     runInAction(() => {
//       this.roles = options.options;
//     });
//     localStorage.setItem("options.roles", {
//       data: this.roles,
//       params: [],
//       time: Date.now(),
//     });
//   }

//   async loadBase() {
//     const options = await net.post("/api/option/getBase");
//     runInAction(() => {
//       const { templateColumns, ...rest } = options;
//       this.templateColumns = templateColumns;
//       this.data = {
//         ...rest,
//         customTemplateTypes: [
//           { id: 0, val: "清关文件模板" },
//           { id: 1, val: "预报文件模板" },
//         ],
//       };
//     });
//     localStorage.setItem("options.templateColumns", {
//       data: this.templateColumns,
//       params: [],
//       time: Date.now(),
//     });
//     localStorage.setItem("options", {
//       data: this.data,
//       params: [],
//       time: Date.now(),
//     });
//   }

//   async loadCustomsTemplates() {
//     const { templates } = await net.post("/api/option/getCustomsTemplates");
//     runInAction(() => {
//       this.customsTemplates = templates;
//     });
//     localStorage.setItem("options.customsTemplates", {
//       data: templates,
//       params: [],
//       time: Date.now(),
//     });
//   }

//   async loadPrealertTemplates() {
//     const { templates } = await net.post("/api/option/getPrealertTemplates");
//     runInAction(() => {
//       this.prealertTemplates = templates;
//     });
//     localStorage.setItem("options.prealertTemplates", {
//       data: templates,
//       params: [],
//       time: Date.now(),
//     });
//   }

//   init() {
//     this.data = localStorage.getItem("options")?.data ?? defaultOptions;
//     this.templateColumns =
//       localStorage.getItem("options.templateColumns")?.data ?? [];
//     this.roles = localStorage.getItem("options.roles")?.data ?? [];
//     this.customsTemplates = localStorage.getItem("options.customsTemplates")?.data ?? [];
//     this.prealertTemplates = localStorage.getItem("options.prealertTemplates")?.data ?? [];
//     this.load();
//   }

//   get<K extends keyof Options>(
//     key?: K | "roles"
//   ): { value: string | number; label: string }[] {
//     if (!key) {
//       return [] as unknown as { value: string | number; label: string }[];
//     }
//     let opts = [];
//     opts = this.data?.[key as K] || [];
//     if ((key as unknown) === "roles") {
//       opts = this.roles;
//     }
//     if (
//       [
//         "tikTokActionCodeList",
//         "tikTokReasonCodeList",
//         "tikTokWaybillStatusList",
//       ].includes(key)
//     ) {
//       return (opts as unknown as { code: string; name: string }[]).map(
//         (item) => ({
//           value: item.code,
//           label: item.name,
//         })
//       );
//     }
//     if (["timeZones"].includes(key)) {
//       return (opts as unknown as { key: string; val: string }[]).map(
//         (item) => ({
//           value: item.key,
//           label: item.val,
//         })
//       );
//     }
//     return (opts as { id: number; val: string }[]).map((item) => ({
//       value: item.id,
//       label: item.val,
//     }));
//   }

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   format(opts: any[]) {
//     return opts.map(item => {
//       const { id, val } = item;
//       return { label: val, value: id };
//     });

//   }
// }

// export default new OptionService();
