export type SheetProps = {
  children?: React.ReactNode;
  width?: number; //in percentage
  shouldCloseOnBackdrop: boolean;
  height?: number;
};

export type SheetRefProps = {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};
