export const state = {
  valueFormatter: (params: { value: boolean }) => {
    if (params.value === true) {
      return "启用";
    }
    return "停用";
  },
};