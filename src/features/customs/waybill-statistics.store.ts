import { loading, net } from "@infra";
import { makeAutoObservable, runInAction } from "mobx";
import { QueryParams } from "./waybill-statistics.types";
import optionsService from "@services/options.service";
import { compact, flatten, keyBy } from "lodash";
import { getSubColumns } from "./waybill-statistics-config";

export class Store {
  loading = false;
  settingVisible = false;

  selectedCols: string[] = [];

  constructor() {
    makeAutoObservable(this);
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

  @loading()
  async setPmc(id: number, pmc: string) {
    await net.post("/api/dataStatistics/setPmc", { id, pmc });
  }

  @loading()
  async getSetting() {
    const { providerNames } = await net.post("/api/dataStatistics/getSetting");
    runInAction(() => {
      this.selectedCols = providerNames;
    });
  }

  get dynamicCols() {
    return compact(
      flatten(
        this.selectedCols.map((key) => {
          const item = this.settingDict[key];
          return item && getSubColumns(key, item.label);
        })
      )
    );
  }

  get settingDict() {
    return keyBy(this.setting, "key");
  }

  get setting() {
    return optionsService.providers;
  }

  @loading()
  async setSetting(selectedCols: string[]) {
    this.selectedCols = selectedCols;
    await net.post("/api/dataStatistics/setSetting", {
      providerNames: selectedCols,
    });
  }

  @loading()
  async export(params: QueryParams) {
    await net.download("/api/dataStatistics/export", params);
  }
}
