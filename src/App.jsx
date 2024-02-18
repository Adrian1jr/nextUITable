import { useEffect, useState } from 'react';
import DynamicTable from './components/DynamicTable';

function App() {
  const [rows, setRows] = useState([]);
  const columns = [
    { name: 'Id', uid: 'id' },
    { name: 'Name', uid: 'name' },
    { name: 'Radio Buttons Group', uid: 'radioBtnGroup' },
  ];

  useEffect(() => {
    setRows([
      { id: 1, name: 'Tony Reichert', deliveryType: 'pickup' },
      { id: 2, name: 'Zoey Lang', deliveryType: 'delivery' },
      { id: 3, name: 'Jane Fisher', deliveryType: 'pickup' },
      { id: 4, name: 'William Howard', deliveryType: 'pickup' },
      { id: 5, name: 'Kristen Copper', deliveryType: 'pickup' },
      { id: 6, name: 'Brian Kim', deliveryType: 'pickup' },
    ]);
  }, []);

  function handleChangePropertyValue(id, propName, value) {
    console.log(id, propName, value);
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id == id ? { ...row, [propName]: value } : row
      )
    );
  }

  return (
    <div className="m-10">
      <h1 className="font-bold text-5xl mb-10">Table V2</h1>

      <DynamicTable
        columns={columns}
        rows={rows}
        onChangePropertyValue={handleChangePropertyValue}
      />
    </div>
  );
}

export default App;
