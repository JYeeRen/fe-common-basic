import { makeAutoObservable } from "mobx";
import { CustomITemsQueryParams } from "./types";
import { loading, net } from "@infra";
import axios from "axios";

export class ClearanceOfGoodsStore {

  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  @loading()
  async export(queryParams: CustomITemsQueryParams = {}) {
    // await net.post('/api/customsItem/export', queryParams, { timeout: 60 * 1000 * 5, responseType: 'blob',maxRedirects: 0 });
    const url = 'http://customs-service.oss-us-west-1.aliyuncs.com/dev%2Ftemp%2Fd15uo294dyi2fydckm.xlsx?Expires=1715336230&OSSAccessKeyId=LTAI5tK8ZuA8SVmV7LW2jb11&Signature=UKswyTtzEb9aU5MHOzyrkzIfR0Y%3D&response-content-disposition=attachment%3B%20filename%3D%22customs_item_export_1715332628.xlsx%22';
    const blob = await axios.get(url, { responseType: 'blob', headers: {
      'Access-Control-Allow-Origin': '*',
    } });

    const fileUrl = window.URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = fileUrl;
  
    link.setAttribute('download', `customs_item_export_1715332628.xlsx`);
    document.body.appendChild(link);
  
    link.click();
    window.URL.revokeObjectURL(fileUrl);
    link.parentNode?.removeChild(link);
    
  }
}