import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore.hook';
import CustomTemplateComponent from './custom-template-operation.component';
import { CustomTemplateOperationStore } from './custom-template-operation.store';

const CustomTemplateCreate = observer(() => {
  const { store, t } = useStore(CustomTemplateOperationStore)();
  return (
    <CustomTemplateComponent
      title={t('新增模板')}
      store={store}
    />
  );
});

export default CustomTemplateCreate;
