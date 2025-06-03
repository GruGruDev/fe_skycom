import AddIcon from "@mui/icons-material/Add";
import { Button, Paper, Stack } from "@mui/material";
import { RESPONSE_MESSAGES } from "constants/messages/response.message";
import { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { TKanbanColumn } from "types/Kanban";
import { showSuccess } from "utils/toast";
import { addTask, deleteTask } from "../utils";
import KanbanColumnToolBar from "./KanbanColumnToolBar";
import KanbanAddTask from "./KanbanTaskAdd";
import KanbanTaskCard, { KanbanTaskCardType } from "./KanbanTaskCard";
import { TStyles } from "types/Styles";

// ----------------------------------------------------------------------

export interface KanbanColumnType extends Omit<KanbanTaskCardType, "card" | "onDeleteTask"> {
  column: TKanbanColumn<unknown>;
  index: number;
}

export default function KanbanColumn({ column, index, renderCardContent }: KanbanColumnType) {
  const [open, setOpen] = useState(false);

  const { name, id, cards } = column;

  const handleOpenAddTask = () => {
    setOpen((prev) => !prev);
  };

  const handleCloseAddTask = () => {
    setOpen(false);
  };

  const handleDeleteTask = (card: any) => {
    deleteTask({ card, columnId: id });
    showSuccess(RESPONSE_MESSAGES.DELETE_SUCCESS);
  };

  // const handleUpdateColumn = async (newName: string) => {
  //   try {
  //     if (newName !== name) {
  //       updateColumn(id, { ...column, name: newName });
  //       showSuccess(RESPONSE_MESSAGES.UPDATE_SUCCESS);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const handleDeleteColumn = async () => {
  //   try {
  //     deleteColumn(id);
  //     showSuccess(RESPONSE_MESSAGES.DELETE_SUCCESS);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleAddTask = (task: unknown) => {
    addTask({ card: task, columnId: id });
    handleCloseAddTask();
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <Paper
          {...provided.draggableProps}
          ref={provided.innerRef}
          variant="outlined"
          sx={{ px: 0.5, bgcolor: "background.neutral" }}
          style={styles.column}
        >
          <Stack spacing={3} {...provided.dragHandleProps} sx={{ position: "relative" }}>
            <KanbanColumnToolBar
              columnName={name}
              // onDelete={handleDeleteColumn}
              // onUpdate={handleUpdateColumn}
            />

            <Droppable droppableId={id} type="task">
              {(provided) => (
                <Stack ref={provided.innerRef} {...provided.droppableProps} spacing={2} width={220}>
                  {cards.map((card: any, index: number) => (
                    <KanbanTaskCard
                      key={card?.id}
                      onDeleteTask={handleDeleteTask}
                      card={card}
                      index={index}
                      renderCardContent={renderCardContent}
                    />
                  ))}
                  {provided.placeholder}
                </Stack>
              )}
            </Droppable>

            <Stack spacing={2} sx={{ pb: 1 }}>
              {open && (
                <KanbanAddTask onAddTask={handleAddTask} onCloseAddTask={handleCloseAddTask} />
              )}

              <Button
                fullWidth
                size="large"
                color="inherit"
                startIcon={<AddIcon width={20} height={20} />}
                onClick={handleOpenAddTask}
                sx={{ fontSize: 14 }}
              >
                Add Task
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}
    </Draggable>
  );
}

const styles: TStyles<"column"> = {
  column: {
    marginRight: 12,
    marginLeft: 0,
  },
};
