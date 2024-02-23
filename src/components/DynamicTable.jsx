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
  Card,
  Checkbox,
} from "@nextui-org/react";
import { PlusIcon } from "./Icons/PlusIcon";
import { SearchIcon } from "./Icons/SearchIcon";
import { ChevronDownIcon } from "./Icons/ChevronDownIcon";
import capitalize from "../helpers/capitalize";
import RadioButtonGroup from "./RadioButtonGroup";
import { TableButtonGroup } from "./TableButtonGroup";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { useMedia } from "react-use";
import { FaExclamationCircle } from "react-icons/fa";

export default function DynamicTable({
  columns,
  rows,
  onTopButtonsClick,
  onChangePropertyValue,
  customCells,
  rowButtons = [],
  needSelectionMode = false,
  needAddButton = true,
  onSelectedKeysChange = () => {},
}) {
  const [isLoading, _setIsLoading] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const loadingState = isLoading || rows?.length === 0 ? "loading" : "idle";
  const motionProps = {
    variants: {
      enter: {
        y: 0,
        opacity: 1,
        height: "auto",
        transition: {
          height: {
            type: "spring",
            stiffness: 500,
            damping: 30,
            duration: 1,
          },
          opacity: {
            easings: "ease",
            duration: 1,
          },
        },
      },
      exit: {
        y: -10,
        opacity: 0,
        height: 0,
        transition: {
          height: {
            easings: "ease",
            duration: 0.25,
          },
          opacity: {
            easings: "ease",
            duration: 0.3,
          },
        },
      },
    },
  };

  const isMobile = useMedia("(max-width: 600px)");

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

  const renderCell = useCallback((data, columnKey, isMobile) => {
    const cellValue = data[columnKey];

    switch (columnKey) {
      // If the column is a custom cell, we render the custom cell
      case "customCell":
        // We check the type of the custom cell and render the appropriate component
        switch (customCells.type) {
          case "radioBtnGroup":
            return (
              <RadioButtonGroup
                data={data}
                radioButtons={customCells.values}
                onChangePropertyValue={onChangePropertyValue}
                propertyKey={customCells.propertyKey}
                isMobile={isMobile}
              />
            );
          default:
            return null;
        }
      case "actions":
        return (
          <TableButtonGroup
            buttons={rowButtons}
            rowData={data}
          ></TableButtonGroup>
        );
      default:
        return (
          <>
            {isMobile ? (
              <div className="flex flex-col gap-2 py-3">
                <p className="text-xs text-gray-400">{capitalize(columnKey)}</p>
                <p className="text-sm text-gray-700">{cellValue}</p>
              </div>
            ) : (
              cellValue
            )}
          </>
        );
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

            {needAddButton && (
              <Button
                className="w-full sm:w-auto"
                color="primary"
                endContent={<PlusIcon />}
                onClick={() => onTopButtonsClick("add")}
              >
                Add New
              </Button>
            )}
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
    <>
      {isMobile ? (
        <>
          <div className="flex flex-col gap-4">
            <div
              className={`
            ${needAddButton ? "top-table-flex" : "top-table-flex-no-wrap mb-0"}
            flex justify-between gap-3 items-end`}
            >
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
              <div className="table-action-buttons flex gap-3">
                {needAddButton && (
                  <Button
                    className="w-full sm:w-auto"
                    color="primary"
                    endContent={<PlusIcon />}
                    onClick={() => onTopButtonsClick("add")}
                  >
                    Add New
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div>
            {items.length === 0 ? (
              <div
                className="mt-5 py-5 border-1.5 rounded-lg 
                flex flex-col items-center justify-center h-full w-full gap-2 text-default-400 text-center"
              >
                <FaExclamationCircle size={50} />
                <p>No items found</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-4 pr-3">
                {items.map((item) => (
                  <section key={item.id}>
                    <Accordion
                      motionProps={motionProps}
                      selectedKeys={selectedKeys}
                      onSelectionChange={setSelectedKeys}
                      selectionMode="multiple"
                      isCompact
                      variant="splitted"
                      className="px-0"
                    >
                      <AccordionItem
                        key={item.id}
                        textValue="accordion-item"
                        startContent={
                          <>
                            {/* Accordion header */}
                            <Checkbox
                              className="outline-none"
                              onChange={() => {
                                console.log("check clicked", item);
                              }}
                            />
                            {item.name}
                          </>
                        }
                      >
                        {/* Accordion body */}
                        <div className="flex gap-5 flex-wrap items-center">
                          {columns.map((column) => (
                            <div key={column.uid}>
                              {renderCell(item, column.uid, true)}
                            </div>
                          ))}
                        </div>
                      </AccordionItem>
                    </Accordion>
                  </section>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <Table
          aria-label="nextui-dynamic-table"
          isHeaderSticky
          bottomContent={loadingState === "idle" && bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            wrapper: "max-h-[382px]",
          }}
          topContent={topContent}
          topContentPlacement="outside"
          onRowAction={() => {}} //Prevents user from to only select rows with checkboxes
          selectionMode={needSelectionMode ? "multiple" : "none"} // Applies selection mode checkbox to the table
          selectedKeys={selectedKeys}
          onSelectionChange={(key) => {
            setSelectedKeys(key);
            onSelectedKeysChange(key);
          }}
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
                  <TableCell>{renderCell(item, columnKey, false)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </>
  );
}
