import { observer } from "mobx-react-lite";
import { useStore } from "@hooks";
import { VendorInfoOperationStore } from "@features/baseinfo/vendor/vendor-info-operation.store.ts";
import VendorInfoOperationComponent from "@features/baseinfo/vendor/vendor-info-operation.component.tsx";

const VendorInfoCreateComponent = observer(() => {
  const { store, t } = useStore(VendorInfoOperationStore)();

  return (
    <VendorInfoOperationComponent
      title={t('新增入库预报')}
      store={store}
    />
  );
})

export default VendorInfoCreateComponent;