import { makeAutoObservable } from "mobx";
import { CustomITemsQueryParams } from "./types";
import { loading, net } from "@infra";

export class ClearanceOfGoodsStore {

  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  @loading()
  async export(queryParams: CustomITemsQueryParams = {}) {
    const blob = await net.get('/api/customsItem/export', queryParams, { timeout: 60 * 1000 * 5, responseType: 'blob', maxRedirects: 0 });
    // const url = 'http://customs-service.oss-us-west-1.aliyuncs.com/dev%2Ftemp%2Fd15uo294dyi2fydckm.xlsx?Expires=1715336230&OSSAccessKeyId=LTAI5tK8ZuA8SVmV7LW2jb11&Signature=UKswyTtzEb9aU5MHOzyrkzIfR0Y%3D&response-content-disposition=attachment%3B%20filename%3D%22customs_item_export_1715332628.xlsx%22';
    // const url = 'http://customs-service.oss-us-west-1.aliyuncs.com/dev%2Ftemp%2Fd15yigpyj9b2mj8qeu.xlsx?Expires=1715347077&OSSAccessKeyId=LTAI5tK8ZuA8SVmV7LW2jb11&Signature=NWaNYxWlCsE9NSSnZbixycGkv94%3D&response-content-disposition=attachment%3B%20filename%3D%22customs_item_export_1715343475.xlsx%22';
    // const url = 'http://customs-service.oss-us-west-1.aliyuncs.com/dev%2Ftemp%2Fd15yigpyj9b2mj8qeu.xlsx?Expires=1715347077&OSSAccessKeyId=LTAI5tK8ZuA8SVmV7LW2jb11&Signature=NWaNYxWlCsE9NSSnZbixycGkv94%3D&response-content-disposition=attachment%3B%20filename%3D%22customs_item_export_1715343475.xlsx%22';

    // const res = await axios.get(url, { responseType: 'blob', headers: {
    //   'Access-Control-Allow-Origin': '*',
    // } });

    // const blob = res.data;
    // console.log(typeof blob)
    // if (!(blob instanceof Blob)) throw new Error('blob');

    // const link = document.createElement('a');
    // link.href = window.URL.createObjectURL(blob);
    // link.download = 'customs_item_export_1715332628.xlsx';
    // link.click();
    // window.URL.revokeObjectURL(link.href);
  }
}