import { groupBy } from "lodash";
import { makeAutoObservable, runInAction } from "mobx";
import { loading, net } from "@infra";
import { RoleDetail, RoleCreateParams, Permission } from "./types";

export class RoleDetailStore {
  id?: number = undefined;
  mode: "create" | "edit" | "view" = "create";
  role?: RoleDetail = undefined;
  loading = false;

  permissions: Permission[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  onLoad(id?: number) {
    this.loadPermissions();
    this.id = id;
    if (this.id) this.loadRole(this.id);
  }

  @loading()
  async loadPermissions() {
    const { permissions } = await net.post("/api/option/getPermissions");
    runInAction(() => {
      this.permissions = permissions;
    });
  }

  @loading()
  async createRole(params: RoleCreateParams) {
    await net.post("/api/role/createRole", params);
  }

  @loading()
  async updateRole(params: RoleCreateParams) {
    if (!this.id) return;
    await net.post("/api/role/editRole", { id: this.id, ...params });
  }

  @loading()
  async loadRole(id: number) {
    const role = await net.post("/api/role/getRoleInfo", { id });
    runInAction(() => {
      this.role = role;
    });
  }

  @loading()
  async unlinkAccount(accountId: number) {
    if (!this.id) return;

    await net.post("/api/role/unlinkAccount", { accountId });
    this.loadRole(this.id);
  }

  get readonly() {
    return this.mode === "view";
  }

  get initialValue() {
    if (!this.role) {
      return { active: true };
    }

    const initialValue = {
      name: this.role.name,
      active: this.role.active,
      ...groupBy(this.role.permissions, (item) => item.split(".")[0]),
    };

    return initialValue;
  }
}
