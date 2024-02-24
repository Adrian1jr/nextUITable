import { Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import DynamicTable from "../DynamicTable";

export default function AddItemsForm({ register, onFormSubmit }) {
  const [rows, setRows] = useState([]);
  const columns = [
    { name: "Id", uid: "id" },
    { name: "Name", uid: "name" },
    { name: "Pickup / Delivery", uid: "customCell" },
  ];

  // This object is used to create a custom cell in the table
  const customCells = {
    type: "radioBtnGroup",
    propertyKey: "transactionType",
    values: [
      { id: 2, title: "Pickup", defaultChecked: true, value: "pickup" },
      { id: 1, title: "Delivery", defaultChecked: false, value: "delivery" },
    ],
  };

  useEffect(() => {
    setRows([
      { id: 1, name: "Tony Reichert", transactionType: "pickup" },
      { id: 2, name: "Zoey Lang", transactionType: "pickup" },
      { id: 3, name: "Jane Fisher", transactionType: "pickup" },
      { id: 4, name: "William Howard", transactionType: "pickup" },
      { id: 5, name: "Kristen Copper", transactionType: "pickup" },
      { id: 6, name: "Brian Kim", transactionType: "pickup" },
    ]);
  }, []);

  // This function is called when the user changes the value of a cell in the table
  function handleChangePropertyValue(id, propName, value) {
    setRows((prevRows) =>
      prevRows.map((row) => {
        return row.id === id ? { ...row, [propName]: value } : row;
      })
    );
  }

  // This function is called when the user selects a row with the checkbox in the table
  const handleSelectedKeysChange = (selectedKeys) => {
    if (selectedKeys === "all")
      return onFormSubmit({
        items: rows,
      });

    const keysArray = [...selectedKeys];
    const numericKeys = keysArray.map((key) => parseInt(key));
    const selectedKeysWithInfo = rows.filter((item) =>
      numericKeys.includes(item.id)
    );

    console.log("selectedKeysWithInfo", selectedKeysWithInfo);

    onFormSubmit({
      items: selectedKeysWithInfo,
    });
  };

  return (
    <form>
      {/* <Input
        type="text"
        name="title"
        placeholder="title"
        {...register("title")}
        className="mb-4"
      /> */}

      <DynamicTable
        columns={columns}
        rows={rows}
        onChangePropertyValue={handleChangePropertyValue}
        customCells={customCells}
        needSelectionMode={true}
        onSelectedKeysChange={(selectedKeys) =>
          handleSelectedKeysChange(selectedKeys)
        }
        needAddButton={false}
      />
    </form>
  );
}
