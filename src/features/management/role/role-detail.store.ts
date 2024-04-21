import { groupBy } from "lodash";
import { makeAutoObservable, runInAction } from "mobx";
import { ServerError, net } from "@infra";
import { message } from '@components';
import { RoleDetail, RoleCreateParams, Permission } from "./types";

export class RoleDetailStore {

  id?: number = undefined;
  mode: 'create' | 'edit' | 'view' = 'create';
  role?: RoleDetail = undefined;

  permissions: Permission[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  onLoad(id?: number) {
    this.loadPermissions();
    this.id = id;
    if (this.id) this.loadRole(this.id);
  }

  async loadPermissions() {
    const { permissions } = await net.post('/api/option/getPermissions');
    runInAction(() => {
      this.permissions = permissions;
    });
  }

  async createRole(params: RoleCreateParams) {
    try {
      await net.post('/api/role/createRole', params);
      return true;
    } catch (err) {
      if (err instanceof ServerError) {
        message.error(err.message);
      }
    }
  }

  async updateRole(params: RoleCreateParams) {
    try {
      await net.post('/api/role/editRole', { id: this.id, ...params });
    } catch (err) {
      if (err instanceof ServerError) {
        message.error(err.message);
      }
    }
  }

  async loadRole(id: number) {
    const role = await net.post('/api/role/getRoleInfo', { id });
    runInAction(() => {
      this.role = role;
    });
  }

  async unlinkAccount(accountId: number) {
    if (!this.id) return;

    await net.post('/api/role/unlinkAccount', { accountId });
    this.loadRole(this.id);
  }

  get readonly() {
    return this.mode === 'view';
  }

  get initialValue() {
    if(!this.role) {
      return {};
    }

    const initialValue = {
      name: this.role.name,
      active: this.role.active,
      ...groupBy(this.role.permissions, (item) => item.split('.')[0])
    };

    return initialValue;
  }

}
