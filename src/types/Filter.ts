export interface TDateFilter {
  title: string;
  keyFilters: TKeyFilter[];
}
[];

export interface TKeyFilter {
  label: string;
  color?: string;
  title?: string;
  disabled?: boolean;
}

export interface TChipFilter {
  title: string;
  keyFilters: TKeyFilter[];
}
