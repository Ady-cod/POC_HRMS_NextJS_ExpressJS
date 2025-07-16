import { TableColumn } from 'react-data-table-component';
import { EmployeeListItem } from './types';

export type ColumnConfigType = 'default' | 'week-wise' | 'department-view' | 'custom';

export interface ColumnSection {
  id: string;
  name: string;
  columns: TableColumn<EmployeeListItem>[];
}

export interface ColumnConfig {
  type: ColumnConfigType;
  showSerialNumber?: boolean;
  showMoreColumnsNavigation?: boolean;
  showActions?: boolean;
  sections: ColumnSection[];
  customColumns?: TableColumn<EmployeeListItem>[];
}

// Default column configuration (current implementation)
export const DEFAULT_COLUMN_CONFIG: ColumnConfig = {
  type: 'default',
  showSerialNumber: true,
  showMoreColumnsNavigation: true,
  showActions: true,
  sections: [], // Will be populated by the hook
};

// Week-wise view configuration
export const WEEK_WISE_COLUMN_CONFIG: ColumnConfig = {
  type: 'week-wise',
  showSerialNumber: false,
  showMoreColumnsNavigation: false,
  showActions: true,
  sections: [
    {
      id: 'week-info',
      name: 'Week Information',
      columns: [], // Will be populated with week-specific columns
    }
  ],
};

// Department view configuration
export const DEPARTMENT_VIEW_COLUMN_CONFIG: ColumnConfig = {
  type: 'department-view',
  showSerialNumber: true,
  showMoreColumnsNavigation: false,
  showActions: true,
  sections: [
    {
      id: 'department-info',
      name: 'Department Information',
      columns: [], // Will be populated with department-specific columns
    }
  ],
}; 