export interface Role {
  id: number;
  name: string;
  active: boolean;
  permissions: string[];
  linkedAccounts: Pick<Account, "id" | "account" | "username">[];
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
  roleId: Role["id"];
  isManager: boolean;
  /**  */
  scope: 1 | 2;
}

export interface CustomItem {
  itemId: number;
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
    lhProviderName: string;
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

export interface CustomTemplateCol {
  key: string;
  index: number;
  cnName: string;
  enName: string;
  exportName: string;
  fixedValue: string;
  interceptBeforeStart?: number;
  interceptBeforeEnd?: number;
  interceptAfterStart?: number;
  interceptAfterEnd?: number;
  targetUnit: string;
  isMerge?: boolean;
  amountUnit?: string;
}

export interface CustomTemplate {
  id: number;
  name: string;
  type: number;
  active: boolean;
  mergeOrderNumber: boolean;
  typesetting: number;
  columns: CustomTemplateCol[];
}

export interface CustomsRisk {
  id: number;
  customerName: string;
  productName: string;
  productNameCn: string;
  exportHsCode: string;
  importHsCode: string;
}

export interface CustomsStatus {
  id: number;
  masterWaybillNo: string;
  bigBagNo: string;
  transportName: string;
  departPortCode: string;
  arrivePortCode: string;
  etd: string;
  eta: string;
  flightDate: string;
  customsStatus: number;
  customsRemark: string;
  customerName: string;
  warning: boolean;
  ata: string;
  atd: string;
}

export interface CustomsDocument extends CustomsStatus {
  customsFile: boolean;
  prealertFile: boolean;
  copyImgFile: boolean;
  atdIso: string;
  etdIso: string;
}

export interface CustomsTrackStatus {
  mawbId?: number;
  id: number;
  masterWaybillNo: string;
  bigBagNo: string;
  providerOrderId: string;
  trackingNo: string;
  declarationBillId: string;
  status: number;
  pickedUpTime: string;
  deliveredTime: string;
  transportName: string;
  flightDate: string;
  atd: string;
  ata: string;
  departPortCode: string;
  arrivePortCode: string;
}

export interface PackagCustomsTrackLog {
  id: number;
  bigBagNo: string;
  providerOrderId: string;
  declarationBillId: string;
  trackingNo: string;
  actionCode: string;
  operateTime: string;
  operateTimeCn: string;
  createdTimeCn: string;
  userName: string;
}

export interface MawbCustomsTrackLog {
  id: number;
  masterWaybillNo: string;
  waybillStatusCode: string;
  operateTime: string;
  operateTimeCn: string;
  createdTimeCn: string;
  userName: string;
  uploadCompleted: number;
}

export interface PackageCustomsTrack {
  id: number;
  bigBagNo: string;
  providerOrderId: string;
  declarationBillId: string;
  trackingNo: string;
  actionCode: string;
  operateTime: string;
  createdTime: string;
  userName: string;
  masterWaybillNo: string;
  nextProviderName: string;
  uploadCompleted: number;
}

export interface MawbCustomsTrack {
  id: number;
  masterWaybillNo: string;
  transportName: string;
  flightDate: string;
  etd: string;
  eta: string;
  atd: string;
  ata: string;
  departPortCode: string;
  arrivePortCode: string;
  pickedUpTime: string;
  customsSubmittedTime: string;
  customsAcceptedTime: string;
  customsInspection: string;
  customsReleaseTime: string;
  handedOverTime: string;
  userName: string;
}

export interface PacakgeChange {
  uid: string;
  id: number;
  masterWaybillNo: string;
  change: string;
  changeType: string;
  changeTypeValue: string;
  trackingNoList: string;
}

export interface WarehouseReceipt {
  id: number;
  masterWaybillNo: string;
  bigBagNo: string;
  tailProviderName: string;
  status: number;
}
export interface MawbStatus {
  id: number;
  masterWaybillNo: string;
  customsStart: string;
  customsInspection: string;
  customsRelease: string;
  customsFinished: string;
  customsException: string;
  transportHandover: string;
}

export interface Clearance {
  id: number;
  masterWaybillNo: string;
  nextProviderNames: string;
  status: number;
}

export interface Deduction {
  id: number;
  masterWaybillNo: string;
  bigBagNo: string;
  receiptStatus: number;
  deductionStatus: number;
  deductionOperator: string;
  deductionTime: string;
}

export interface DeductionInitiate {
  id: number;
  masterWaybillNo: string;
  bigBagNo: string;
  receiptStatus: number;
}

export interface WarehouseOutbound {
  id: number;
  masterWaybillNo: string;
  bigBagNo: string;
  receiptTime: string;
  tailProviderName: string;
  palletCode: string;
  status: number;
}

export interface PalletInfo {
  id: number;
  code: string;
  date: string;
}

export interface CargoTrack {
  id: number;
  masterWaybillNo: string;
  bigBagNo: string;
  tailProviderName: string;
  receiptStatus: number;
  deductionStatus: number;
  receiptTime: string;
  loadTime: string;
  outboundTime: string;
  palletCode: string;
  cabinetNo: string;
  lockNo: string;
  companyName: string;
  driverName: string;
  driverContact: string;
  bolCode: string;
  vehiclePhoto: boolean;
  direction: string;
  inboundUser: string;
  loadUser: string;
  deductionUser: string;
}

export interface ReceiptIssue {
  id: number;
  masterWaybillNo: string;
  bigBagNo: string;
  receiptTime: string;
  tailProviderName: string;
  palletCode: string;
  remark: string;
  waybillPhotoFile: boolean;
  status: number;
}

export interface ReceiptIssueLink {
  id: number;
  masterWaybillNo: string;
  bigBagNo: string;
  tailProviderName: string;
  status: number;
}

export interface WaybillStatistics {
  id: number;
  port: string;
  ata: string;
  flightNumber: string;
  pmc: string;
  masterWaybillNo: string;
  tailProviders: {
    name: string;
    pcl: string;
    ctn: string;
    wgt: string;
  }[];
}
