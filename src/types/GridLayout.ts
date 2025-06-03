export type TGridLayout = boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface GridWrapType {
  xs?: TGridLayout;
  sm?: TGridLayout;
  md?: TGridLayout;
  lg?: TGridLayout;
  xl?: TGridLayout;
}

export type TGridSize = false | "sm" | "xs" | "md" | "lg" | "xl";
