import { Container, Stack } from "@mui/material";
import { SkeletonKanbanColumn } from "components/Skeleton";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { TKanbanColumn } from "types/Kanban";
import { KanbanColumn, KanbanColumnAdd } from "./components";
import { KanbanColumnType } from "./components/KanbanColumn";

// ----------------------------------------------------------------------

export interface KanbanType extends Omit<KanbanColumnType, "column" | "index"> {
  columns: { [key: string]: TKanbanColumn };
  onAddColumn?: (name: string) => void;
  onDragEnd: (result: DropResult) => void;
}

export default function Kanban({ columns, onAddColumn, renderCardContent, onDragEnd }: KanbanType) {
  // const onDragEnd = (result: DropResult) => {
  //   // Reorder card
  //   const { destination, source, draggableId } = result;
  //   console.log("🚀 ~ onDragEnd ~ result:", result);

  //   if (!destination) return;

  //   if (destination.droppableId === source.droppableId && destination.index === source.index)
  //     return;

  //   const start = columns[source.droppableId];
  //   const finish = columns[destination.droppableId];

  //   if (start.id === finish.id) {
  //     const updatedCardIds = [...start.cards];
  //     updatedCardIds.splice(source.index, 1);
  //     updatedCardIds.splice(destination.index, 0, draggableId);

  //     const updatedColumn = {
  //       ...start,
  //       cards: updatedCardIds,
  //     };

  //     persistCard({
  //       ...columns,
  //       [updatedColumn.id]: updatedColumn,
  //     });
  //     return;
  //   }

  //   const startCardIds = [...start.cards];
  //   startCardIds.splice(source.index, 1);
  //   const updatedStart = {
  //     ...start,
  //     cards: startCardIds,
  //   };

  //   const finishCardIds = [...finish.cards];
  //   finishCardIds.splice(destination.index, 0, draggableId);
  //   const updatedFinish = {
  //     ...finish,
  //     cards: finishCardIds,
  //   };

  //   persistCard({
  //     ...columns,
  //     [updatedStart.id]: updatedStart,
  //     [updatedFinish.id]: updatedFinish,
  //   });
  // };

  return (
    <Container maxWidth={false} sx={{ height: 1 }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <Stack
              {...provided.droppableProps}
              ref={provided.innerRef}
              direction="row"
              alignItems="flex-start"
              spacing={3}
              sx={{
                pb: 2,
                height: "calc(100vh - 152px)",
                position: "relative",
              }}
            >
              {!Object.keys(columns)?.length ? (
                <SkeletonKanbanColumn />
              ) : (
                Object.keys(columns)?.map((columnId: string, index: number) => (
                  <KanbanColumn
                    index={index}
                    key={columnId}
                    column={columns[columnId]}
                    renderCardContent={renderCardContent}
                  />
                ))
              )}

              {provided.placeholder}
              {onAddColumn && <KanbanColumnAdd />}
            </Stack>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
}
