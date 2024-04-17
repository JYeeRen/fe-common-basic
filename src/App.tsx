import { AntConfigProvider } from "@components";
import { DataGrid } from "./components/data-grid/DataGridV2";

function App() {

  return (
    <AntConfigProvider>
      <div style={{ width: '1000px' }}>
        <DataGrid />
      </div>
    </AntConfigProvider>
  );
}

export default App;
