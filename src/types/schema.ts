export interface Role {
  id: number;
  name: string;
  active: boolean;
  permissions: string[];
  linkedAccounts: unknown[];
  linkedCount: number;
}