import { net } from "@infra";
import { CustomItem, TemplateListQueryParams } from "./types";
import { t } from "@locale";
import { Button, TableColumnsType } from "@components";

export const getRows = async (params: TemplateListQueryParams) => {
  return net.post("/api/customsItem/findList", params);
};

export const getGridColumns = (): TableColumnsType<CustomItem> => {
  return [
    {
      key: "mawbInfo.masterWaybillNo",
      dataIndex: ["mawbInfo", "masterWaybillNo"],
      title: t("主提运单号"),
      render: (value, record) => {
        console.log(value, record.mawbInfo.masterWaybillNo);
        return record.mawbInfo.masterWaybillNo;
      },
    },
    {
      key: "transportName",
      dataIndex: "transportName",
      title: t("运输方式"),
    },
    {
      key: "mawbInfo.departPortCode",
      dataIndex: ["mawbInfo", "departPortCode"],
      title: t("起运港"),
    },
    {
      key: "mawbInfo.arrivePortCode",
      dataIndex: ["mawbInfo", "arrivePortCode"],
      title: t("抵运港"),
    },
    {
      key: "mawbInfo.etd",
      dataIndex: ["mawbInfo", "etd"],
      title: t("预计离港日期"),
    },
    {
      key: "mawbInfo.eta",
      dataIndex: ["mawbInfo", "eta"],
      title: t("预计抵港日期"),
    },
    {
      key: "mawbInfo.customerName",
      dataIndex: ["mawbInfo", "customerName"],
      title: t("客户名称"),
    },
    {
      key: "packageInfo.providerOrderId",
      dataIndex: ["packageInfo", "providerOrderId"],
      title: t("物流订单号"),
    },
    {
      key: "packageInfo.declarationBillId",
      dataIndex: ["packageInfo", "declarationBillId"],
      title: t("申报订单号"),
    },
    {
      key: "packageInfo.trackingNo",
      dataIndex: ["packageInfo", "trackingNo"],
      title: t("面单号"),
    },
    {
      key: "packageInfo.operateTime",
      dataIndex: ["packageInfo", "operateTime"],
      title: t("操作时间"),
    },
    {
      key: "packageInfo.remark",
      dataIndex: ["packageInfo", "remark"],
      title: t("用户发货备注"),
    },
    {
      key: "packageInfo.entityCode",
      dataIndex: ["packageInfo", "entityCode"],
      title: t("公司代码"),
    },
    {
      key: "packageInfo.orderNo",
      dataIndex: ["packageInfo", "orderNo"],
      title: t("交易单号"),
    },
    {
      key: "packageInfo.bigBagNo",
      dataIndex: ["packageInfo", "bigBagNo"],
      title: t("大包号"),
    },
    {
      key: "packageInfo.containerNo",
      dataIndex: ["packageInfo", "containerNo"],
      title: t("集装箱号"),
    },
    {
      key: "packageInfo.buyerRegion",
      dataIndex: ["packageInfo", "buyerRegion"],
      title: t("包裹售卖国家"),
    },
    {
      key: "packageInfo.nextProviderName",
      dataIndex: ["packageInfo", "nextProviderName"],
      title: t("下一段服务商名称"),
    },
    {
      key: "packageInfo.goodsValue",
      dataIndex: ["packageInfo", "goodsValue"],
      title: t("包裹申报价格"),
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageInfo.goodsValueCNY",
      dataIndex: ["packageInfo", "goodsValueCNY"],
      title: `${t("包裹申报价格")}(CNY)`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageInfo.goodsValueUSD",
      dataIndex: ["packageInfo", "goodsValue"],
      title: `${t("包裹申报价格")}(USD)`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageInfo.packageShippingFee",
      dataIndex: ["packageInfo", "packageShippingFee"],
      title: t("包裹运费"),
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageInfo.packageShippingFeeCNY",
      dataIndex: ["packageInfo", "packageShippingFeeCNY"],
      title: `${t("包裹运费")}(CNY)`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageInfo.packageShippingFeeUSD",
      dataIndex: ["packageInfo", "packageShippingFee"],
      title: `${t("包裹运费")}(USD)`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageInfo.currency",
      dataIndex: ["packageInfo", "currency"],
      title: t("币种"),
    },
    {
      key: "packageInfo.realWeight",
      dataIndex: ["packageInfo", "realWeight"],
      title: t("毛重"),
    },
    {
      key: "packageInfo.weightUnit",
      dataIndex: ["packageInfo", "weightUnit"],
      title: t("重量单位"),
    },
    {
      key: "packageItemInfo.itemId",
      dataIndex: ["packageItemInfo", "itemId"],
      title: t("商品ID"),
    },
    {
      key: "packageItemInfo.skuId",
      dataIndex: ["packageItemInfo", "skuId"],
      title: t("商品sku标识id"),
    },
    {
      key: "packageItemInfo.productName",
      dataIndex: ["packageItemInfo", "productName"],
      title: t("商品英文品名"),
    },
    {
      key: "packageItemInfo.productNameCn",
      dataIndex: ["packageItemInfo", "productNameCn"],
      title: t("商品中文名称"),
    },
    {
      key: "packageItemInfo.weight",
      dataIndex: ["packageItemInfo", "weight"],
      title: t("item重量"),
    },
    {
      key: "packageItemInfo.exportHsCode",
      dataIndex: ["packageItemInfo", "exportHsCode"],
      title: t("出口HS编码"),
    },
    {
      key: "packageItemInfo.importHsCode",
      dataIndex: ["packageItemInfo", "importHsCode"],
      title: t("进口HS编码"),
    },
    {
      key: "packageItemInfo.qty",
      dataIndex: ["packageItemInfo", "qty"],
      title: t("数量"),
    },
    {
      key: "packageItemInfo.unit",
      dataIndex: ["packageItemInfo", "unit"],
      title: t("数量单位"),
    },
    {
      key: "packageItemInfo.unitPrice",
      dataIndex: ["packageItemInfo", "unitPrice"],
      title: `${t("商品申报单价")}`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageItemInfo.unitPriceCNY",
      dataIndex: ["packageItemInfo", "unitPriceCNY"],
      title: `${t("商品申报单价")}(CNY)`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageItemInfo.unitPriceUSD",
      dataIndex: ["packageItemInfo", "unitPriceUSD"],
      title: `${t("商品申报单价")}(USD)`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageItemInfo.itemShippingFee",
      dataIndex: ["packageItemInfo", "itemShippingFee"],
      title: t("商品运费"),
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageItemInfo.itemShippingFeeCNY",
      dataIndex: ["packageItemInfo", "itemShippingFeeCNY"],
      title: `${t("商品运费")}(CNY)`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageItemInfo.itemShippingFeeUSD",
      dataIndex: ["packageItemInfo", "itemShippingFeeUSD"],
      title: `${t("商品运费")}(USD)`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageItemInfo.codFee",
      dataIndex: ["packageItemInfo", "codFee"],
      title: t("COD金额"),
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageItemInfo.codFeeCNY",
      dataIndex: ["packageItemInfo", "codFeeCNY"],
      title: `${t("COD金额")}(CNY)`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageItemInfo.codFeeUSD",
      dataIndex: ["packageItemInfo", "codFeeUSD"],
      title: `${t("COD金额")}(USD)`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageItemInfo.vatRate",
      dataIndex: ["packageItemInfo", "vatRate"],
      title: t("增值税率"),
    },
    {
      key: "packageItemInfo.vatFee",
      dataIndex: ["packageItemInfo", "vatFee"],
      title: `${t("增值税")}`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageItemInfo.vatFeeCNY",
      dataIndex: ["packageItemInfo", "vatFeeCNY"],
      title: `${t("增值税")}(CNY)`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageItemInfo.vatFeeUSD",
      dataIndex: ["packageItemInfo", "vatFeeUSD"],
      title: `${t("增值税")}(USD)`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageItemInfo.originCountry",
      dataIndex: ["packageItemInfo", "originCountry"],
      title: t("原产国"),
    },
    {
      key: "packageItemInfo.itemType",
      dataIndex: ["packageItemInfo", "itemType"],
      title: t("类型"),
    },
    {
      key: "packageItemInfo.itemUrl",
      dataIndex: ["packageItemInfo", "itemUrl"],
      title: t("商品链接"),
      render: (value) => (
        <Button
          type="link"
          href={value}
          target="_blank"
          rel="noopener noreferrer"
        >
          点击跳转
        </Button>
      ),
    },
    {
      key: "packageItemInfo.taxMark",
      dataIndex: ["packageItemInfo", "taxMark"],
      title: t("商品已税/未税"),
    },
  ];
};
