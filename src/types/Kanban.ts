// ----------------------------------------------------------------------

export type KanbanState = {
  isLoading: boolean;
  error: Error | string | null;
  board: Partial<{
    columns: Record<string, TKanbanColumn>;
  }>;
};

export type CardComment = {
  id: string;
  avatar: string;
  name: string;
  createdAt: Date | string | number;
  messageType: "image" | "text";
  message: string;
};

export type Assignee = {
  id: string;
  avatar: string;
  name: string;
};

export type TKanbanColumn<T = any> = {
  id: string;
  name: string;
  cards: T[];
};
