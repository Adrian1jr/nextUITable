import { useEffect, useState } from "react";
import DynamicTable from "./components/DynamicTable";

function App() {
  const [rows, setRows] = useState([]);
  const columns = [
    { name: "Id", uid: "id" },
    { name: "Name", uid: "name" },
    { name: "Pickup / Delivery", uid: "custom" },
  ];

  // This object is used to create a custom cell in the table
  const customCells = {
    type: "radioBtnGroup",
    propertyKey: "deliveryType",
    values: [
      { id: 2, title: "Pickup", defaultChecked: true, value: "pickup" },
      { id: 1, title: "Delivery", defaultChecked: false, value: "delivery" },
    ],
  };

  useEffect(() => {
    setRows([
      { id: 1, name: "Tony Reichert", deliveryType: "pickup" },
      { id: 2, name: "Zoey Lang", deliveryType: "pickup" },
      { id: 3, name: "Jane Fisher", deliveryType: "pickup" },
      { id: 4, name: "William Howard", deliveryType: "pickup" },
      { id: 5, name: "Kristen Copper", deliveryType: "pickup" },
      { id: 6, name: "Brian Kim", deliveryType: "pickup" },
    ]);
  }, []);

  // This function is called when the user changes the value of a cell in the table
  function handleChangePropertyValue(id, propName, value) {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id == id ? { ...row, [propName]: value } : row
      )
    );
  }

  // This function is called when the user selects a row with the checkbox in the table
  const handleSelectedKeysChange = (selectedKeys) => {
    if (selectedKeys === "all") return console.log("All rows selected");

    const keysArray = [...selectedKeys];
    const numericKeys = keysArray.map((key) => parseInt(key));
    const selectedKeysWithInfo = rows.filter((item) =>
      numericKeys.includes(item.id)
    );

    console.log("Selected rows: ", selectedKeysWithInfo);
  };

  return (
    <div className="m-10">
      <h1 className="font-bold text-5xl mb-10">Table V2</h1>

      <DynamicTable
        columns={columns}
        rows={rows}
        onChangePropertyValue={handleChangePropertyValue}
        customCells={customCells}
        needSelectionMode={true}
        onSelectedKeysChange={(selectedKeys) =>
          handleSelectedKeysChange(selectedKeys)
        }
      />
    </div>
  );
}

export default App;
