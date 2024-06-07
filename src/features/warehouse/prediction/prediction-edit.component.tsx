import {observer} from "mobx-react-lite";
import {PredictionOperationStore} from "@features/warehouse/prediction/prediction-operation.store.ts";
import {useStore} from "@hooks";
import PredictionOperationComponent from "@features/warehouse/prediction/prediction-operation.component.tsx";
import {useParams} from "react-router-dom";

const PredictionEditComponent = observer(() => {
    const { id } = useParams();
    const { store, t } = useStore(PredictionOperationStore)(id);

    return (
        <PredictionOperationComponent
            title={t('编辑入库预报')}
            store={store}
        />
    );
})

export default PredictionEditComponent;