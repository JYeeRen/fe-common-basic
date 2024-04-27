import { Container } from "@components";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore.hook";
import { TemplateListStore } from "./template-list.store";
import styles from './template-list.module.less';

function TemplateListComponent() {
  const { t } = useStore(TemplateListStore)();

  return (
    <Container className={styles.container}>
      <div style={{ width: '100px', height: '100px' }}></div>
      <Container title={t('模板维护')}>
        
      </Container>
    </Container>
  );
}

const Template = observer(TemplateListComponent);

export default Template;
