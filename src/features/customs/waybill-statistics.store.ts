import { loading, net } from "@infra";
import { makeAutoObservable, runInAction } from "mobx";
import { QueryParams, DownloadParams } from "./waybill-statistics.types";
import optionsService from "@services/options.service";
import { compact, flatten, keyBy } from "lodash";
import { getSubColumns } from "./waybill-statistics-config";

export class Store {
  loading = false;
  settingVisible = false;
  bolVisible = false;

  selectedCols: number[] = [];
  provider: {
    ids: number[];
    name: string;
    others: Record<string, number[]>;
  } = {
    ids: [],
    name: "",
    others: {},
  };

  constructor() {
    makeAutoObservable(this);
  }

  get vendorTailProviders() {
    return optionsService.vendorTailProviders ?? [];
  }

  @loading()
  async onLoad() {
    await this.getSetting();
  }

  hideSetting() {
    this.settingVisible = false;
  }

  showSetting() {
    this.settingVisible = true;
  }

  showBOL() {
    this.bolVisible = true;
  }

  hideBOL() {
    this.bolVisible = false;
  }

  @loading()
  async setPmc(id: number, pmc: string) {
    await net.post("/api/dataStatistics/setPmc", { id, pmc });
  }

  @loading()
  async getSetting() {
    const { provider } = await net.post(
      "/api/dataStatistics/getSetting"
    );
    runInAction(() => {
      this.selectedCols = provider.ids;
      this.provider = provider ?? {
        ids: [],
        name: "",
        others: {},
      };
    });
  }

  @loading()
  async downloadBOL(params: DownloadParams) {
    await net.download("/api/dataStatistics/exportBillOfLading", params);
    runInAction(() => {
      this.hideBOL();
    });
  }

  get dynamicCols() {
    return compact(
      flatten(
        this.selectedCols.map((key) => {
          const item = this.settingDict[key];
          return item && getSubColumns(key.toString(), item.label);
        })
      )
    );
  }

  get settingDict() {
    return keyBy(this.setting, "key");
  }

  get setting(): { key: number; label: string }[] {
    return optionsService.vendorTailProviders.map((item) => ({
      key: item.value as number,
      label: item.label,
    }));
  }

  @loading()
  async setSetting(selectedCols: string[], provider: Store["provider"]) {
    this.selectedCols = provider.ids;
    await net.post("/api/dataStatistics/setSetting", {
      providerNames: selectedCols,
      provider,
    });
  }

  @loading()
  async export(params: QueryParams) {
    await net.download("/api/dataStatistics/export", params);
  }
}
