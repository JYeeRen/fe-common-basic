import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore.hook';
import CustomTemplateComponent from './custom-template-operation.component';
import { CustomTemplateOperationStore } from './custom-template-operation.store';
import { useParams } from 'react-router-dom';

const CustomTemplateDetail = observer(() => {
  const { id } = useParams();
  const { store, t } = useStore(CustomTemplateOperationStore)({ id });

  return (
    <CustomTemplateComponent
      title={t('编辑模板')}
      store={store}
    />
  );
});

export default CustomTemplateDetail;
