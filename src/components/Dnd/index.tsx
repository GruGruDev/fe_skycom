import { useEffect } from "react";
import { TColumn } from "types/DGrid";
import Stack, { StackProps } from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { NoDataPanel } from "components/NoDataPanel";
import { TStyles } from "types/Styles";

const DragDropContainer = ({
  options = [],
  setOptions,
  containerProps,
}: {
  options?: (TColumn & { width?: number })[];
  setOptions: React.Dispatch<
    React.SetStateAction<
      (TColumn & {
        width?: number | undefined;
      })[]
    >
  >;
  containerProps?: StackProps;
}) => {
  const handleDragStart = (e: any, card: TColumn & { width?: number }) => {
    // e.target.style.opacity = 0.25;
    e.dataTransfer.setData("text/plain", card.name);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();

    const taskId = e.dataTransfer.getData("text/plain");
    const targetIndex = options.findIndex((task) => task.name === taskId);

    // Get the mouse coordinates
    const mouseX = e.clientX;
    const tasksContainer = e.currentTarget.getBoundingClientRect();
    // const taskWidth = tasksContainer.width / options.length;
    // const targetIndexNew = Math.floor((mouseX - tasksContainer.left) / taskWidth);
    const positionNew = mouseX - tasksContainer.x;
    let targetNew = targetIndex;
    let widthByIndex = 0;

    let i = 0;
    do {
      widthByIndex += (options?.[i]?.width || 0) + 8;
      targetNew = i;
      i++;
    } while (
      !(
        positionNew < widthByIndex &&
        positionNew > widthByIndex - (options?.[i - 1]?.width || 0) - 8
      )
    );

    if (targetIndex !== targetNew) {
      const updatedTasks = [...options];
      const removedTask = updatedTasks.splice(targetIndex, 1)[0];
      updatedTasks.splice(targetNew, 0, removedTask);
      setOptions(updatedTasks);
    }
  };

  return (
    <Box
      style={styles.wrapper}
      sx={{ border: "1px solid", borderColor: "divider", position: "relative" }}
    >
      {options.length ? (
        <Stack
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          {...containerProps}
          style={{ ...containerProps?.style, ...styles.stack }}
        >
          {options.map((card, index) => (
            <CardItem
              item={card}
              handleDragStart={handleDragStart}
              key={index}
              index={index}
              handleSetWidth={(index, width) => {
                setOptions((prev) => {
                  prev[index] = { ...prev[index], width };
                  return prev;
                });
              }}
            />
          ))}
        </Stack>
      ) : (
        <NoDataPanel />
      )}
    </Box>
  );
};

export default DragDropContainer;

const CardItem = ({
  item,
  handleDragStart,
  handleSetWidth,
  index,
}: {
  item: TColumn & { width?: number };
  handleDragStart: (e: any, card: TColumn & { width?: number }) => void;
  handleSetWidth: (index: number, width: number) => void;
  index: number;
}) => {
  useEffect(() => {
    const cardE = document.getElementById(`${item.name}`);
    const width = cardE?.offsetWidth || item.width;
    handleSetWidth(index, width || 0);
  }, [handleSetWidth, index, item.name, item.width]);

  return (
    <Button
      key={item.name}
      draggable
      onDragStart={(e) => handleDragStart(e, item)}
      id={`${item.name}`}
      variant={"contained"}
      style={styles.button}
      className="card-item"
    >
      {item.title}
    </Button>
  );
};

const styles: TStyles<"wrapper" | "stack" | "button"> = {
  wrapper: { padding: 8, borderRadius: 8, display: "flex", overflowX: "auto", width: "100%" },
  stack: { whiteSpace: "nowrap" },
  button: { margin: "4px", height: 25, fontWeight: "400", fontSize: "0.82rem", minWidth: "unset" },
};
