import { observer } from "mobx-react-lite";
import { useStore } from "@hooks";
import { ClientGrid, Container } from "@components";
import { ClearanceOfGoodsStore } from "./clearance-of-goods.store";
import * as CustomItemConfig from "./clearance-of-goods.config";
import styles from './clerance-of-goods.module.less';

function ClearanceOfGoodsComponent() {

  const { t } = useStore(ClearanceOfGoodsStore)();
  const gridStore = ClientGrid.useGridStore(CustomItemConfig.getRows);
  return (
    <Container className={styles.container}>
    <Container title={t('商品详细信息')}>
      <ClientGrid
        columns={CustomItemConfig.getGridColumns()}
        store={gridStore}
      />
    </Container>
    </Container>
  );
}

const ClearanceOfGoods = observer(ClearanceOfGoodsComponent);

export default ClearanceOfGoods;
