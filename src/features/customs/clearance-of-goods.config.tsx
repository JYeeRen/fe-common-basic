import { net } from "@infra";
import { CustomItem, TemplateListQueryParams } from "./types";
import { t } from "@locale";
import { AgGridTypes } from "@components";

export const getRows = async (params: TemplateListQueryParams) => {
  return net.post("/api/customsItem/findList", params);
};

export const getGridColumns = (): AgGridTypes.ColumnDefs<CustomItem> => {
  return [
    {
      field: "mawbInfo.masterWaybillNo",
      headerName: t("主提运单号"),
    },
    {
      field: "mawbInfo.transportName",
      headerName: t("运⼒名称，空运航班号，⻋牌号"),
    },
    {
      field: "mawbInfo.departPortCode",
      headerName: t("始发地港⼝代码"),
    },
    {
      field: "mawbInfo.arrivePortCode",
      headerName: t("arrivePortCode"),
    },
    { field: "mawbInfo.etd", headerName: t("预计离开时间(ETD)") },
    { field: "mawbInfo.eta", headerName: t("预计抵达时间(ETA)") },
    { field: "mawbInfo.customerName", headerName: t("customerName") },
    {
      field: "packageInfo.providerOrderId",
      headerName: t("物流订单号"),
    },
    {
      field: "packageInfo.declarationBillId",
      headerName: t("申报订单号"),
    },
    {
      field: "packageInfo.trackingNo",
      headerName: t("⾯单号"),
    },
    {
      field: "packageInfo.operateTime",
      headerName: t("操作时间"),
    },
    { field: "packageInfo.remark", headerName: t("取消原因") },
    {
      field: "packageInfo.entityCode",
      headerName: t("公司代码"),
    },
    { field: "packageInfo.orderNo", headerName: t("交易单号") },
    { field: "packageInfo.bigBagNo", headerName: t("⼤包号") },
    {
      field: "packageInfo.containerNo",
      headerName: t("海运/铁路的集装箱号"),
    },
    {
      field: "packageInfo.buyerRegion",
      headerName: t("包裹售卖国家"),
    },
    {
      field: "packageInfo.nextProviderName",
      headerName: t("下⼀段服务商名称（交接⽤）"),
    },
    {
      field: "packageInfo.goodsValue",
      headerName: t("包裹申报价格"),
    },
    {
      field: "packageInfo.shippingFee",
      headerName: t("包裹运费"),
    },
    { field: "packageInfo.currency", headerName: t("币种") },
    {
      field: "packageInfo.realWeight",
      headerName: t("⽑重"),
    },
    {
      field: "packageInfo.weightUnit",
      headerName: t("重量单位"),
    },
    { field: "packageInfo.status", headerName: t("状态") },
    {
      field: "packageInfo.cancelRemark",
      headerName: t("取消原因"),
    },
    {
      field: "packageItemInfo.itemId",
      headerName: t("商品ID"),
    },
    { field: "packageItemInfo.skuId", headerName: t("商品sku标识id") },
    {
      field: "packageItemInfo.productName",
      headerName: t("/商品英⽂品名"),
    },
    {
      field: "packageItemInfo.productNameCn",
      headerName: t("商品中文名称"),
    },
    {
      field: "packageItemInfo.weight",
      headerName: t("重量"),
    },
    {
      field: "packageItemInfo.exportHsCode",
      headerName: t("出口HS编码"),
    },
    {
      field: "packageItemInfo.importHsCode",
      headerName: t("进口HS编码"),
    },
    { field: "packageItemInfo.qty", headerName: t("数量") },
    { field: "packageItemInfo.unit", headerName: t("数量单位") },
    {
      field: "packageItemInfo.unitPrice",
      headerName: t("商品申报单价"),
    },
    {
      field: "packageItemInfo.shippingFee",
      headerName: t("商品运费"),
    },
    {
      field: "packageItemInfo.codFee",
      headerName: t("COD⾦额"),
    },
    {
      field: "packageItemInfo.vatRate",
      headerName: t("增值税率"),
    },
    {
      field: "packageItemInfo.vatFee",
      headerName: t("增值税"),
    },
    {
      field: "packageItemInfo.originCountry",
      headerName: t("原产国"),
    },
    {
      field: "packageItemInfo.itemType",
      headerName: t("类型"),
    },
    {
      field: "packageItemInfo.itemUrl",
      headerName: t("商品链接"),
    },
    {
      field: "packageItemInfo.taxMark",
      headerName: t("商品已税/未税"),
    },
  ];
};
