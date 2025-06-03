import { Paper } from "@mui/material";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import KanbanTaskDetails from "./KanbanTaskDetails";

// ----------------------------------------------------------------------

export type KanbanTaskCardType = {
  card: unknown & { id: string };
  onDeleteTask: (id: string) => void;
  index: number;
  renderCardContent: (card: any) => React.ReactNode | JSX.Element;
};

export default function KanbanTaskCard({
  card,
  onDeleteTask,
  index,
  renderCardContent,
}: KanbanTaskCardType) {
  const [openDetails, setOpenDetails] = useState(false);

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          <Paper
            sx={{
              px: 2,
              width: 1,
              position: "relative",
              boxShadow: (theme) => theme.customShadows.z1,
              "&:hover": {
                boxShadow: (theme) => theme.customShadows.z16,
              },
            }}
          >
            {renderCardContent(card)}
          </Paper>

          <KanbanTaskDetails
            card={card}
            isOpen={openDetails}
            onClose={handleCloseDetails}
            onDeleteTask={() => onDeleteTask(card.id)}
          />
        </div>
      )}
    </Draggable>
  );
}
