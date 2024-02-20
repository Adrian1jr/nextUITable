import { useState } from "react";
import DynamicTable from "./components/DynamicTable";
import DialogWithForm from "./components/DialogWithForm";
import { MdModeEdit } from "react-icons/md";

function App() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const columns = [
    { name: "Id", uid: "id" },
    { name: "Actions", uid: "actions" },
    { name: "Name", uid: "name" },
    { name: "Pickup / Delivery", uid: "transactionType" },
  ];

  const actionButtons = [
    {
      name: "Edit",
      click: (row) => console.log(row),
      icon: <MdModeEdit />,
    },
  ];

  const handleTableTopButtons = (button) => {
    if (button === "add") setIsAddModalOpen(true);
  };

  const handleAddItems = (formData) => {
    setIsAddModalOpen(false);
    const { items } = formData;
    if (!items) return;

    setItems((prevItems) => {
      return [
        ...prevItems,
        ...items.map((item, index) => ({
          id: prevItems.length + index + 1,
          name: item.name,
          transactionType: item.transactionType,
        })),
      ];
    });
  };

  return (
    <div className="m-10">
      <h1 className="font-bold text-5xl mb-10">Table V2</h1>

      <DynamicTable
        columns={columns}
        rows={items}
        onTopButtonsClick={handleTableTopButtons}
        rowButtons={actionButtons}
      />

      {isAddModalOpen && (
        <DialogWithForm
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={"Add User"}
          form={"addItems"}
          actionButtonText={"Save"}
          size="4xl"
          onAction={handleAddItems}
        />
      )}
    </div>
  );
}

export default App;
