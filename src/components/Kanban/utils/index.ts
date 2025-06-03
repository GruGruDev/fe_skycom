import { createSlice } from "@reduxjs/toolkit";
import omit from "lodash/omit";
import { ActionMap } from "types/Auth";
import { KanbanState, TKanbanColumn } from "types/Kanban";

// TYPE PAYLOAD ----------------------------------------------------------------------
enum Types {
  GetColumn = "GET_COLUMN",
  GetCard = "GET_CARD",
}

type KanbanPayload = {
  [Types.GetColumn]: {
    columns: { [key: string]: TKanbanColumn[] };
  };
  [Types.GetCard]: {
    cards: { [key: string]: unknown[] };
  };
};

export type KanbanActions = ActionMap<KanbanPayload>[keyof ActionMap<KanbanPayload>];

// ----------------------------------------------------------------------

const initialState: KanbanState = {
  isLoading: false,
  error: null,
  board: {
    columns: {},
  },
};

export const KanbanReducer = (state: KanbanState, action: KanbanActions) => {
  switch (action.type) {
    case "GET_COLUMN":
      return {
        ...state,
        columns: action.payload.columns,
      };
    case "GET_CARD":
      return {
        ...state,
        cards: action.payload.cards,
      };
    default:
      return state;
  }
};

const slice = createSlice({
  name: "kanban",
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET BOARD
    getBoardSuccess(state, action) {
      state.isLoading = false;
      const { columns } = action.payload;
      state.board = {
        columns,
      };
    },

    getColumnSuccess(state, action) {
      state.isLoading = false;
      const { columns } = action.payload;
      state.board = {
        columns,
      };
    },

    // CREATE NEW COLUMN
    createColumnSuccess(state, action) {
      const newColumn = action.payload;
      state.isLoading = false;
      state.board.columns = {
        ...state.board.columns,
        [newColumn.id]: newColumn,
      };
    },

    persistCard(state, action) {
      const columns = action.payload;
      state.board.columns = columns;
    },

    addTask(state, action) {
      const { card, columnId } = action.payload;

      state.board.columns![columnId].cards.push(card);
    },

    deleteTask(state, action) {
      const { card, columnId } = action.payload;

      state.board.columns![columnId].cards = state.board.columns![columnId].cards.filter(
        (id) => id !== card.id,
      );
    },

    // UPDATE COLUMN
    updateColumnSuccess(state, action) {
      const column = action.payload;

      state.isLoading = false;
      state.board.columns![column.id] = column;
    },

    // DELETE COLUMN
    deleteColumnSuccess(state, action) {
      const { columnId } = action.payload;

      state.isLoading = false;
      state.board.columns = omit(state.board.columns, [columnId]);
    },
  },
});

// Reducer
export default slice.reducer;

export const { actions } = slice;

export function createColumn({}: { name: string }) {}

export function updateColumn(_columnId: string, _updateColumn: TKanbanColumn) {}

export function deleteColumn(_columnId: string) {}

export function persistCard(_columns: Record<string, TKanbanColumn>) {}

export function addTask({}: { card: unknown; columnId: string }) {}

export function deleteTask({}: { card: any; columnId: string }) {}
