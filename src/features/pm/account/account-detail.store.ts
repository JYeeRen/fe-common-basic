import { loading, net } from "@infra";
import { makeAutoObservable, runInAction } from "mobx";
import { Account, AccountParams } from "./types";

export class AccountDetailStore {
  id: number = 0;
  account?: Account = undefined;
  roles: { id: number; val: string }[] = [];
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async onLoad(id?: number) {
    this.loadRoles();
    if (!id) return;
    this.id = id;
    const account = await this.getAccount(this.id);
    runInAction(() => {
      this.account = account;
    });
  }

  @loading()
  async loadRoles() {
    const { options } = await net.post("/api/option/getRoleNames");
    runInAction(() => {
      this.roles = options;
    });
  }

  @loading()
  async getAccount(id: number) {
    return await net.post("/api/account/getAccountInfo", { id });
  }

  @loading()
  async create(params: AccountParams) {
    await net.post("/api/account/createAccount", params);
  }

  @loading()
  async update(params: AccountParams) {
    await net.post("/api/account/editAccount", { id: this.id, ...params });
    return true;
  }

  get initialValues() {
    const roleId = this.account?.roleId;
    return {
      active: true,
      ...this.account,
      roleId: roleId || undefined,
    };
  }
}
