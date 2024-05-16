import { Container, Tabs, TabsProps } from "@components";
import { observer } from "mobx-react-lite";
import styles from "./track-info.module.less";
import { useStore } from "@hooks";
import { TrackLogStore } from "./track-log.store";
import { useMemo } from "react";
import MawbTrackLog from "./track-log-mawb.component";
import PacakgeTrackLog from "./track-log-package.component";


function TrackInfoComponent() {
  const { store, t } = useStore(TrackLogStore)();
  
  const items: TabsProps["items"] = useMemo(() => [
    {
      key: "mawb",
      label: t('提单轨迹信息'),
      children: (<MawbTrackLog store={store} />),
    },
    {
      key: "pacage",
      label: t('包裹轨迹信息'),
      children: (<PacakgeTrackLog store={store} />),
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
