export interface Role {
  id: number;
  name: string;
  active: boolean;
  permissions: string[];
  linkedAccounts: Pick<Account, 'id' | 'account' | 'username'>[];
  linkedCount: number;
}

export interface Permission {
  key: string;
  text: string;
  items: Permission[];
}

export interface Account {
  id: number;
  roleName: string;
  account: string;
  username: string;
  active: boolean;
  roleId: Role['id'];
  isManager: boolean;
}