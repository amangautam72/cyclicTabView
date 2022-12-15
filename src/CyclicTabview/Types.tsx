export type TabProp = {
  name: string;
  backDrop?: string;
};
export interface TabViewProps {
  scenes: Array<Object>;
  length: number;
  current: number;
  onTabChange: Function;
  cyclic: boolean;
  animated: boolean;
}

export interface TabListProps {
  tabs: TabProp[];
  onPress: Function;
  current: number;
}
