import clsx from "clsx";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import styles from "./App.module.less";
import { useTranslation } from "./locale";
import { Button, DatePicker, Form } from "@components";
import dayjs from "dayjs";
import { AntConfigProvider } from "@components";

function App() {
  const [count, setCount] = useState(0);
  const { t } = useTranslation("首页");

  return (
    <AntConfigProvider>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className={styles.logo} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img
            src={reactLogo}
            className={clsx(styles.logo, styles.react)}
            alt="React logo"
          />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className={styles.card}>
        <button type="button" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className={styles["read-the-docs"]}>
        Click on the Vite and React logos to learn more
      </p>
      <Form />
      <Button>{t("测试")}</Button>
      <DatePicker value={dayjs("2021-01-01")} />
    </AntConfigProvider>
  );
}

export default App;
