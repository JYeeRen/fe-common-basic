import {observer} from "mobx-react-lite";
import {PredictionOperationStore} from "@features/warehouse/prediction/prediction-operation.store.ts";
import {useStore} from "@hooks";
import PredictionOperationComponent from "@features/warehouse/prediction/prediction-operation.component.tsx";

const PredictionCreateComponent = observer(() => {
    const { store, t } = useStore(PredictionOperationStore)();

    return (
        <PredictionOperationComponent
            title={t('新增入库预报')}
            store={store}
        />
    );
})

export default PredictionCreateComponent;