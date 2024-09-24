import { net } from "@infra";
import { CustomItem, TemplateListQueryParams } from "./types";
import { t } from "@locale";
import { TableColumnsType } from "@components";
import { find } from "lodash";
import optionsService from "@services/options.service";

export const getRows = async (params: TemplateListQueryParams) => {
  return net.post("/api/customsItem/findList", params);
};

export const getGridColumns = (): TableColumnsType<CustomItem> => {
  return [
    {
      key: "mawbInfo.masterWaybillNo",
      dataIndex: ["mawbInfo", "masterWaybillNo"],
      title: t("提单号2"),
    },
    {
      key: "mawbInfo.transportName",
      dataIndex: ["mawbInfo", "transportName"],
      title: t("运输名称"),
    },
    {
      key: "mawbInfo.departPortCode",
      dataIndex: ["mawbInfo", "departPortCode"],
      title: t("起运港代码"),
    },
    {
      key: "mawbInfo.arrivePortCode",
      dataIndex: ["mawbInfo", "arrivePortCode"],
      title: t("目的港代码"),
    },
    {
      key: "mawbInfo.包裹信息获取时间",
      dataIndex: ["packageItemInfo", "createTime"],
      title: t("包裹信息获取时间"),
    },
    {
      key: "mawbInfo.etd",
      dataIndex: ["mawbInfo", "etd"],
      title: t("ETD"),
      sorter: true
    },
    {
      key: "mawbInfo.eta",
      dataIndex: ["mawbInfo", "eta"],
      title: t("ETA"),
      sorter: true
    },
    {
      key: "mawbInfo.customerName",
      dataIndex: ["mawbInfo", "customerName"],
      title: t("客户名称"),
    },
    {
      key: "packageInfo.providerOrderId",
      dataIndex: ["packageInfo", "providerOrderId"],
      title: t("运单号2"),
    },
    {
      key: "packageInfo.declarationBillId",
      dataIndex: ["packageInfo", "declarationBillId"],
      title: t("订单号2"),
    },
    {
      key: "packageInfo.trackingNo",
      dataIndex: ["packageInfo", "trackingNo"],
      title: t("尾程单号2"),
    },
    {
      key: "packageInfo.operateTime",
      dataIndex: ["packageInfo", "operateTime"],
      title: t("操作时间2"),
    },
    {
      key: "packageInfo.remark",
      dataIndex: ["packageInfo", "remark"],
      title: t("备注2"),
    },
    {
      key: "packageInfo.entityCode",
      dataIndex: ["packageInfo", "entityCode"],
      title: t("公司代码2"),
    },
    {
      key: "packageInfo.orderNo",
      dataIndex: ["packageInfo", "orderNo"],
      title: t("交易单号2"),
    },
    {
      key: "packageInfo.bigBagNo",
      dataIndex: ["packageInfo", "bigBagNo"],
      title: t("袋号2"),
    },
    {
      key: "packageInfo.containerNo",
      dataIndex: ["packageInfo", "containerNo"],
      title: t("集装箱号2"),
    },
    {
      key: "packageInfo.buyerRegion",
      dataIndex: ["packageInfo", "buyerRegion"],
      title: t("包裹售卖国家2"),
    },
    {
      key: "packageInfo.lhProviderName",
      dataIndex: ["packageInfo", "lhProviderName"],
      title: t("干线服务商名称"),
    },
    {
      key: "packageInfo.nextProviderName",
      dataIndex: ["packageInfo", "nextProviderName"],
      title: t("下一程服务商"),
    },
    {
      key: "packageInfo.goodsValue",
      dataIndex: ["packageInfo", "goodsValue"],
      title: t("货物价值"),
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageInfo.goodsValueCNY",
      dataIndex: ["packageInfo", "goodsValueCNY"],
      title: `${t("货物价值")}(CNY)`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageInfo.goodsValueUSD",
      dataIndex: ["packageInfo", "goodsValue"],
      title: `${t("货物价值")}(USD)`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageInfo.shippingFee",
      dataIndex: ["packageInfo", "shippingFee"],
      title: t("运费"),
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageInfo.shippingFeeCNY",
      dataIndex: ["packageInfo", "shippingFeeCNY"],
      title: `${t("运费")}(CNY)`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageInfo.shippingFeeUSD",
      dataIndex: ["packageInfo", "shippingFee"],
      title: `${t("运费")}(USD)`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageInfo.currency",
      dataIndex: ["packageInfo", "currency"],
      title: t("币种2"),
    },
    {
      key: "packageInfo.realWeight",
      dataIndex: ["packageInfo", "realWeight"],
      title: t("实际重量"),
    },
    {
      key: "packageInfo.weightUnit",
      dataIndex: ["packageInfo", "weightUnit"],
      title: t("重量单位2"),
    },
    {
      key: "Status",
      dataIndex: ["packageInfo", "status"],
      title: t("状态"),
      render: (value) => find(optionsService.packageStatuses, { value })?.label,
    },
    {
      key: "cancelRemark",
      dataIndex: ["packageInfo", "cancelRemark"],
      title: t("取消原因"),
    },
    {
      key: "packageItemInfo.itemId",
      dataIndex: ["packageItemInfo", "itemId"],
      title: t("商品ID2"),
    },
    {
      key: "packageItemInfo.skuId",
      dataIndex: ["packageItemInfo", "skuId"],
      title: t("SKU ID"),
    },
    {
      key: "packageItemInfo.productName",
      dataIndex: ["packageItemInfo", "productName"],
      title: t("商品名称"),
    },
    {
      key: "packageItemInfo.productNameCn",
      dataIndex: ["packageItemInfo", "productNameCn"],
      title: t("商品中文名称2"),
    },
    {
      key: "packageItemInfo.weight",
      dataIndex: ["packageItemInfo", "weight"],
      title: t("重量"),
    },
    {
      key: "packageItemInfo.exportHsCode",
      dataIndex: ["packageItemInfo", "exportHsCode"],
      title: t("出口HS编码2"),
    },
    {
      key: "packageItemInfo.importHsCode",
      dataIndex: ["packageItemInfo", "importHsCode"],
      title: t("进口HS编码2"),
    },
    {
      key: "packageItemInfo.qty",
      dataIndex: ["packageItemInfo", "qty"],
      title: t("数量2"),
    },
    {
      key: "packageItemInfo.unit",
      dataIndex: ["packageItemInfo", "unit"],
      title: t("单位"),
    },
    {
      key: "packageItemInfo.unitPrice",
      dataIndex: ["packageItemInfo", "unitPrice"],
      title: `${t("单价")}`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageItemInfo.unitPriceCNY",
      dataIndex: ["packageItemInfo", "unitPriceCNY"],
      title: `${t("单价")}(CNY)`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageItemInfo.unitPriceUSD",
      dataIndex: ["packageItemInfo", "unitPriceUSD"],
      title: `${t("单价")}(USD)`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageItemInfo.shippingFee",
      dataIndex: ["packageItemInfo", "shippingFee"],
      title: t("商品运费2"),
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageItemInfo.ShippingFeeCNY",
      dataIndex: ["packageItemInfo", "ShippingFeeCNY"],
      title: `${t("商品运费")}(CNY)`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageItemInfo.ShippingFeeUSD",
      dataIndex: ["packageItemInfo", "ShippingFeeUSD"],
      title: `${t("商品运费")}(USD)`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageItemInfo.codFee",
      dataIndex: ["packageItemInfo", "codFee"],
      title: t("COD费用"),
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageItemInfo.codFeeCNY",
      dataIndex: ["packageItemInfo", "codFeeCNY"],
      title: `${t("COD费用")}(CNY)`,
      // variants: ["CNY", "USD"],
    },
    {
      key: "packageItemInfo.codFeeUSD",
      dataIndex: ["packageItemInfo", "codFeeUSD"],
      title: `${t("COD费用")}(USD)`,
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
      width: 100,
      ellipsis: true,
      render: (value) => (
        <a
          href={value}
          style={{
            color: "blue",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "block",
            width: "100px",
          }}
        >
          {value}
        </a>
      ),
    },
    {
      key: "packageItemInfo.taxMark",
      dataIndex: ["packageItemInfo", "taxMark"],
      title: t("税标"),
    },
  ];
};
