export interface ToolsAPI {
  "/api/tools/validateAndCorrectMawbImportTemplate": {
    params: FormData;
    res: {
      url: string;
      fileName: string;
    };
  };
}
