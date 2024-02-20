import { Tooltip } from "@nextui-org/react";

/**
 * Render a group of buttons in a table format.
 *
 * @param {object} buttons - An array of objects containing button information, e.g. [{name: "Edit", click: () => {}}]
 * @param {object} rowData - The data of the row in the table, this parameter is sent from the table
 * @return {JSX} The rendered group of buttons
 */
export const TableButtonGroup = ({ buttons, rowData }) => {
  return (
    <div className="relative flex items-center gap-2">
      {
        // each element rendered from an iterable array must contain a key value
        buttons.map((button, buttonIndex) => (
          <Tooltip key={buttonIndex} content={button.name}>
            <span
              className="text-lg text-default-400 cursor-pointer"
              onClick={() => button.click(rowData)}
            >
              {button.icon} {/* Render the icon component dynamically */}
            </span>
          </Tooltip>
        ))
      }
    </div>
  );
};
