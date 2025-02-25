declare module "react-window" {
    import * as React from "react";
  
    export interface FixedSizeListProps {
      height: number;
      width: number | string;
      itemCount: number;
      itemSize: number;
      children: React.ComponentType<{
        index: number;
        style: React.CSSProperties;
      }>;
      style?: React.CSSProperties;
    }
  
    export class FixedSizeList extends React.Component<FixedSizeListProps> {}
  }
  