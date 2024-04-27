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
  /**  */
  scope: 1 | 2;
}

export interface CustomItem {
  mawbInfo: {
    masterWaybillNo: string;
    transportName: string;
    departPortCode: string;
    arrivePortCode: string;
    etd: string;
    eta: string;
    customerName: string;
  };
  packageInfo: {
    providerOrderId: string;
    declarationBillId: string;
    trackingNo: string;
    operateTime: string;
    remark: string;
    entityCode: string;
    orderNo: string;
    bigBagNo: string;
    containerNo: string;
    buyerRegion: string;
    nextProviderName: string;
    goodsValue: string;
    shippingFee: string;
    currency: string;
    realWeight: string;
    weightUnit: string;
    status: number;
    cancelRemark: string;
  };
  packageItemInfo: {
    itemId: string;
    skuId: string;
    productName: string;
    productNameCn: string;
    weight: string;
    exportHsCode: string;
    importHsCode: string;
    qty: number;
    unit: string;
    unitPrice: string;
    shippingFee: string;
    codFee: string;
    vatRate: string;
    vatFee: string;
    originCountry: string;
    itemType: string;
    itemUrl: string;
    taxMark: string;
  };
}