import { ServerError, net } from "@infra";
import { makeAutoObservable, runInAction } from "mobx";
import { Account, AccountParams } from "./types";
import { message } from "@components";

export class AccountDetailStore {
  id: number = 0;
  account?: Account = undefined;
  roles: { id: number; val: string }[] = [];

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

  async loadRoles() {
    const { options } = await net.post("/api/option/getRoleNames");
    runInAction(() => {
      this.roles = options;
    });
  } 

  async getAccount(id: number) {
    return await net.post("/api/account/getAccountInfo", { id });
  }

  async create(params: AccountParams) {
    try {
      await net.post("/api/account/createAccount", params);
      return true;
    } catch (err) {
      if (err instanceof ServerError) {
        message.error(err.message);
      }
    }
  }

  async update(params: AccountParams) {
    try {
      await net.post("/api/account/editAccount", { id: this.id, ...params });
      return true;
    } catch (err) {
      if (err instanceof ServerError) {
        message.error(err.message);
      }
    }
  }

  get initialValues() {
    const roleId = this.account?.roleId;
    return {
      ...this.account,
      roleId: roleId || undefined,
    };
  }

}
