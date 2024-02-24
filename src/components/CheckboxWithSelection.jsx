import { Checkbox } from "@nextui-org/react";

const CheckboxWithSelection = ({
  defaultSelected,
  itemId,
  selectedKeys,
  setSelectedKeys,
  onSelectedKeysChange,
  onChangePropertyValue,
}) => {
  const handleChange = (e) => {
    const newSelectedKeys = new Set(selectedKeys);
    selectedKeys.has(itemId)
      ? newSelectedKeys.delete(itemId)
      : newSelectedKeys.add(itemId);

    setSelectedKeys(newSelectedKeys);
    onSelectedKeysChange(newSelectedKeys);
    onChangePropertyValue(itemId, "selected", e.target.checked);
  };

  return (
    <Checkbox
      className="outline-none"
      defaultSelected={defaultSelected}
      onChange={handleChange}
    />
  );
};

export default CheckboxWithSelection;
