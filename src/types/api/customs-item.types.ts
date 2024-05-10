import { Schema } from "@types";
import { ListParams, ListRes } from "./common.types";

export interface CustomsItemAPI {
  "/api/customsItem/findList": {
    params: ListParams & {
      masterWaybillNoList?: string[];
      bigBagNoList?: string[];
      otherType?: number;
      otherList?: string[];
    };
    res: ListRes<Schema.CustomItem>;
  };
  "/api/customsItem/export": {
    params: {
      masterWaybillNoList?: string[];
      bigBagNoList?: string[];
      otherType?: number;
      otherList?: string[];
    };
    res: unknown;
  };
}

export interface TMasterAirwayBills {
  id: number;
  /** 主提运单号 */
  masterWaybillNo: string;
  /** 关务提单号 */
  customsWaybillId: string;
  /** 贸易⽅式 */
  tradeType: string;
  /** ⼤包裹数量 */
  bigBagQuantity: number;
  /** 包裹售卖国家 */
  buyerRegion: string;
  /** 运输⼯具代码（空运、公路、铁路、海运） */
  transportCode: string;
  /** 运⼒名称，空运航班号，⻋牌号 */
  transportName: string;
  /** 始发地港⼝代码，例如航空为始发地机场三字码 */
  departPortCode: string;
  /** ⽬的地港⼝代码，例如航空为⽬的地机场三字码 */
  arrivePortCode: string;
  /** 预计离开时间(ETD)，RFC3339格式传输2023-03-06T06:00:00+08:00 */
  etd: string;
  /** 预计抵达时间(ETA)，RFC3339格式传输 */
  eta: string;
  /** 计费重量：航司途径 decimal.Decimal */
  chargeableWeight: string;
  /** 实际重量：航司途径 decimal.Decimal */
  realWeight: string;
  /** 下发申报类型：create， update */
  declareType: string;
  /** 状态 */
  status: number;
  /** 取消原因 */
  cancelRemark: string;
  /** 复印件图片 */
  copyImgFile: string;
  /** 复印件图片类型 */
  copyImgType: string;
  /** 复印件接收时间 //time string , at datetime */
  copyImgReceiptTime: string;
  /** 关务文件 */
  clearanceFile: string;
  /** 关务文件类型 File type: PDF、PNG */
  clearanceFileType: string;
  /** 关务文件上传时间 */
  clearanceFileUploadAt: string;
}
