import { Button } from "@nextui-org/react";

const RadioButtonGroup = ({
  data,
  radioButtons,
  onChangePropertyValue,
  propertyKey,
}) => {
  return (
    <Button
      style={{
        background: "transparent",
        cursor: "default",
        border: "none",
        boxShadow: "none",
        padding: 0,
      }}
      disableAnimation
    >
      <fieldset className="flex items-center space-x-10 space-y-0">
        {radioButtons.map((rad) => (
          <div key={rad.id} className="flex items-center ">
            <input
              name={`group-${data.id}`}
              type="radio"
              className="h-4 w-4"
              defaultChecked={rad.defaultChecked}
              value={rad.value}
              onChange={({ target: { value } }) => {
                onChangePropertyValue(data.id, propertyKey, value);
              }}
            />
            <label htmlFor={rad.id} className="ml-2 block text-sm leading-6">
              {rad.title}
            </label>
          </div>
        ))}
      </fieldset>
    </Button>
  );
};

export default RadioButtonGroup;
