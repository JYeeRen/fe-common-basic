import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useStore } from "@hooks";
import { VendorInfoOperationStore } from "@features/baseinfo/vendor/vendor-info-operation.store.ts";
import VendorInfoOperationComponent from "@features/baseinfo/vendor/vendor-info-operation.component.tsx";

const VendorInfoEditComponent = observer(() => {
  const { id } = useParams();
  const { store, t } = useStore(VendorInfoOperationStore)(id);

  return (
    <VendorInfoOperationComponent
      title={t('编辑入库预报')}
      store={store}
    />
  );
})

export default VendorInfoEditComponent;