import { VendorInfo } from "@features/baseinfo/vendor/vendor-info.type.ts";
import { makeAutoObservable, runInAction } from "mobx";
import { isEqual } from "lodash";
import { net, loading } from "@infra";

export class VendorInfoOperationStore {
  loading = false;
  id: number = 0;
  info: VendorInfo = {
    id: 0,
    name: "",
    address: "",
    contactDetails: "",
    email: "",
    typeList: [],
    tailProviders: [],
    portCode: "",
    remarks: "",
    active: 0,
  }

  constructor() {
    makeAutoObservable(this);
  }

  get initialValues(): VendorInfo {
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
    name: string;
    address: string;
    contactDetails: string;
    email: string;
    typeList: number[];
    tailProviders: string[];
    portCode: string;
    remarks: string;
  }) {
    if (!this.id) {
      return false;
    }
    const { name, address, contactDetails, email, typeList, tailProviders, portCode, remarks, } = this.initialValues;
    if (
      !isEqual(formValues, {
        name, address, contactDetails, email, typeList, tailProviders, portCode, remarks,
      })
    ) {
      return true;
    }
  }

  @loading()
  async handleSubmit(formValues: VendorInfo) {
    if (this.id) {
      formValues.id = this.id;
      await this.update(formValues);
      return;
    }
    await this.create(formValues);
  }

  @loading()
  async getInfo(id: number) {
    return await net.post("/api/warehouse/vendor/getInfo", { id });
  }

  @loading()
  async create(params: VendorInfo) {
    await net.post("/api/warehouse/vendor/create", params);
  }

  @loading()
  async update(params: VendorInfo) {
    await net.post("/api/warehouse/vendor/edit", params);
    return true;
  }
}