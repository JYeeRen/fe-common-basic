import { loading, net, dayjs } from "@infra";
import { WarehouseReceipt } from "./type.ts";
import { makeAutoObservable, runInAction } from "mobx";
import { isEqual } from "lodash";

export class PredictionOperationStore {
  loading = false;
  id: number = 0;
  info: WarehouseReceipt = {
    id: 0,
    masterWaybillNo: "",
    bigBagNo: "",
    tailProviderName: "",
    customerName: "",
    ata: dayjs().format(),
    status: 0,
    arrivePortCode: "",
  }

  constructor() {
    makeAutoObservable(this);
  }

  get initialValues(): WarehouseReceipt {
    return this.info;
  }

  @loading()
  async onLoad(id = 0) {
    this.id = id;
    if (this.id) {
      const result = await this.getInfo(id);
      runInAction(() => {
        this.info = result;
      });
    }
  }

  isFieldChanged(formValues: {
    masterWaybillNo: string,
    bigBagNo: string,
    tailProviderName: string,
  }) {
    if (!this.id) {
      return false;
    }
    const { masterWaybillNo, bigBagNo, tailProviderName } = this.initialValues;
    if (
      !isEqual(formValues, {
        masterWaybillNo,
        bigBagNo,
        tailProviderName,
      })
    ) {
      return true;
    }
  }

  @loading()
  async handleSubmit(formValues: WarehouseReceipt) {
    if (this.id) {
      formValues.id = this.id;
      await this.update(formValues);
      return;
    }
    await this.create(formValues);
  }

  @loading()
  async getInfo(id: number) {
    return await net.post("/api/warehouse/receipt/getInfo", { id });
  }

  @loading()
  async create(params: WarehouseReceipt) {
    await net.post("/api/warehouse/receipt/created", params);
  }

  @loading()
  async update(params: WarehouseReceipt) {
    await net.post("/api/warehouse/receipt/edit", params);
    return true;
  }
}