import { ClientGrid, Container, Tabs, TabsProps } from "@components";
import { observer } from "mobx-react-lite";
import styles from "./track-info.module.less";
import { useStore } from "@hooks";
import * as mawbListConfig from './track-log-mawb-config';
import * as pacakgeListConfig from './track-log-package-config';
import { TrackLogStore } from "./track-log.store";
import { useMemo } from "react";
import MawbTrackLog from "./track-log-mawb.component";
import PacakgeTrackLog from "./track-log-package.component";


function TrackInfoComponent() {
  const { store, t } = useStore(TrackLogStore)();
  const mawbGridStore = ClientGrid.useGridStore(mawbListConfig.getRows, false);
  const pacakgeGridStore = ClientGrid.useGridStore(pacakgeListConfig.getRows, false);

  const items: TabsProps["items"] = useMemo(() => [
    {
      key: "mawb",
      label: t('提单轨迹信息'),
      children: <MawbTrackLog store={store} gridStore={mawbGridStore} />,
    },
    {
      key: "pacage",
      label: t('包裹轨迹信息'),
      children: <PacakgeTrackLog store={store} gridStore={pacakgeGridStore} />,
    },
  ], []);

  return (
    <Container className={styles.container} loading={store.loading}>
      <Tabs defaultActiveKey="mawb" items={items} />
    </Container>
  );
}

const TrackInfo = observer(TrackInfoComponent);

export default TrackInfo;
