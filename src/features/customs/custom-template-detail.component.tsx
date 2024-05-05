import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore.hook';
import CustomTemplateComponent from './custom-template-operation.component';
import { CustomTemplateOperationStore } from './custom-template-operation.store';

const CustomTemplateDetail = observer(() => {
  const { store, t, navigate } = useStore(CustomTemplateOperationStore)();

  return (
    <CustomTemplateComponent
      title={t('查看模板')}
    />
  );
});

export default CustomTemplateDetail;
