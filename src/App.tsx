import clsx from "clsx";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import styles from "./App.module.less";
import { useTranslation } from "./locale";
import { Button, DatePicker } from "@components";
import dayjs from "dayjs";
import { AntConfigProvider } from "@components";
import {
  DataEditor,
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
} from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";

function App() {
  const [count, setCount] = useState(0);
  const { t } = useTranslation("首页");

  const columns: GridColumn[] = [
    { title: "First Name", width: 100 },
    { title: "Last Name", width: 100 },
  ];

  const data = [
    {
      firstName: "John",
      lastName: "Doe",
    },
    {
      firstName: "Maria",
      lastName: "Garcia",
    },
    {
      firstName: "Nancy",
      lastName: "Jones",
    },
    {
      firstName: "James",
      lastName: "Smith",
    },
  ];

  function getData([col, row]: Item): GridCell {
    const person = data[row];
    if (col === 0) {
      return {
        kind: GridCellKind.Text,
        data: person.firstName,
        allowOverlay: false,
        displayData: person.firstName,
      };
    } else if (col === 1) {
      return {
        kind: GridCellKind.Text,
        data: person.lastName,
        allowOverlay: false,
        displayData: person.lastName,
      };
    } else {
      throw new Error();
    }
  }

  const onColumnResize = (column: GridColumn, newSize: number, colIndex: number, newSizeWithGrow: number) => {
    console.log(column, newSize, colIndex, newSizeWithGrow)
  }

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
      <Button>{t("测试")}</Button>
      <DatePicker value={dayjs("2021-01-01")} />
      <DataEditor
        rowMarkers="both"
        columns={columns}
        getCellContent={getData}
        scaleToRem={true}
        rows={data.length}
        onColumnResize={onColumnResize}
      />
    </AntConfigProvider>
  );
}

export default App;
