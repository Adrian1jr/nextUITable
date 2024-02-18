import { useCallback, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
} from "@nextui-org/react";
import { PlusIcon } from "./Icons/PlusIcon";
import { SearchIcon } from "./Icons/SearchIcon";
import { ChevronDownIcon } from "./Icons/ChevronDownIcon";
import capitalize from "../helpers/capitalize";

export default function DynamicTable({ columns, rows, onUpdateRowValues }) {
  const [isLoading, _setIsLoading] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const loadingState = isLoading || rows?.length === 0 ? "loading" : "idle";

  const radioButtons = [
    { id: 2, title: "Pickup", defaultChecked: true, value: "pickup" },
    { id: 1, title: "Delivery", defaultChecked: false, value: "delivery" },
  ];

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredData = [...rows];

    if (hasSearchFilter) {
      filteredData = filteredData.filter((data) =>
        columns.some((column) => {
          const cellValue = data[column.uid];

          if (typeof cellValue === "string") {
            return cellValue.toLowerCase().includes(filterValue.toLowerCase());
          }

          if (typeof cellValue === "number") {
            return cellValue.toString().includes(filterValue);
          }

          return false;
        })
      );
    }

    return filteredData;
  }, [rows, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const renderCell = useCallback((data, columnKey) => {
    const cellValue = data[columnKey];

    switch (columnKey) {
      case "radioBtnGroup":
        return (
          <fieldset className="flex items-center space-x-10 space-y-0">
            {radioButtons.map((rad) => (
              <div key={rad.id} className="flex items-center">
                <input
                  name={`group-${data.id}`}
                  type="radio"
                  className="h-4 w-4"
                  defaultChecked={rad.defaultChecked}
                  value={rad.value}
                  onChange={(e) => {
                    data[columnKey] = e.target.value;
                    onUpdateRowValues(data);
                  }}
                />
                <label
                  htmlFor={rad.id}
                  className="ml-2 block text-sm leading-6"
                >
                  {rad.title}
                </label>
              </div>
            ))}
          </fieldset>
        );

      default:
        return cellValue;
    }
  }, []);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "h-max",
            }}
            placeholder="Search by..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3 w-full sm:w-auto">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="w-full sm:w-auto"
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              className="w-full sm:w-auto"
              color="primary"
              endContent={<PlusIcon />}
            >
              Add New
            </Button>
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    rows.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <label className="flex items-center text-default-400 text-small">
          Rows per page:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={onRowsPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>

        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <Table
      aria-label="nextui-dynamic-table"
      isHeaderSticky
      bottomContent={loadingState === "idle" && bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[382px]",
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No data found"} items={items}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
