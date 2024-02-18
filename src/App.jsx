import { useEffect, useState } from "react";
import DynamicTable from "./components/DynamicTable";

function App() {
  const [rows, setRows] = useState([]);
  const columns = [
    { name: "Id", uid: "id" },
    { name: "Name", uid: "name" },
    { name: "Radio Buttons Group", uid: "radioBtnGroup" },
  ];

  useEffect(() => {
    setRows([
      { id: 1, name: "Tony Reichert", radioBtnGroup: "pickup" },
      { id: 2, name: "Zoey Lang", radioBtnGroup: "pickup" },
      { id: 3, name: "Jane Fisher", radioBtnGroup: "pickup" },
      { id: 4, name: "William Howard", radioBtnGroup: "pickup" },
      { id: 5, name: "Kristen Copper", radioBtnGroup: "pickup" },
      { id: 6, name: "Brian Kim", radioBtnGroup: "pickup" },
    ]);
  }, []);

  const handleUpdateRowValues = (row) => {
    setRows((prevRows) => {
      return prevRows.map((item) =>
        item.id === row.id
          ? {
              ...item,
              radioBtnGroup: row.radioBtnGroup,
            }
          : item
      );
    });
  };

  return (
    <div className="m-10">
      <h1 className="font-bold text-5xl mb-10">Table V2</h1>

      <DynamicTable
        columns={columns}
        rows={rows}
        onUpdateRowValues={handleUpdateRowValues}
      />
    </div>
  );
}

export default App;
