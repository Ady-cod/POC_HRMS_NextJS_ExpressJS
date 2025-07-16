import React, { useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBackwardStep,
  faForwardStep,
  faAngleLeft,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';
import { EmployeeListItem } from '@/types/types';
import { ColumnConfig, DEFAULT_COLUMN_CONFIG } from '@/types/columnConfig';
import { ColumnBuilder, getDefaultColumnSections, getWeekWiseColumns, getDepartmentViewColumns } from '@/utils/columnBuilders';

interface UseEmployeeTableColumnsProps {
  currentPage: number;
  rowsPerPage: number;
  handleEdit: (employee: EmployeeListItem) => void;
  handleDeleteClick: (employee: EmployeeListItem) => void;
  isSmallScreen: boolean;
  activeSectionIndex: number;
  activeColumnIndex: number;
  setActiveSectionIndex: React.Dispatch<React.SetStateAction<number>>;
  setActiveColumnIndex: React.Dispatch<React.SetStateAction<number>>;
  columnConfig?: ColumnConfig;
}

export const useEmployeeTableColumns = ({
  currentPage,
  rowsPerPage,
  handleEdit,
  handleDeleteClick,
  isSmallScreen,
  activeSectionIndex,
  activeColumnIndex,
  setActiveSectionIndex,
  setActiveColumnIndex,
  columnConfig = DEFAULT_COLUMN_CONFIG,
}: UseEmployeeTableColumnsProps) => {
  
  const columnBuilder = useMemo(() => new ColumnBuilder({
    currentPage,
    rowsPerPage,
    handleEdit,
    handleDeleteClick,
  }), [currentPage, rowsPerPage, handleEdit, handleDeleteClick]);

  const { firstColumns, lastColumn, columnSections } = useMemo(() => {
    const first: TableColumn<EmployeeListItem>[] = [];
    let sections: TableColumn<EmployeeListItem>[][] = [];
    const last: TableColumn<EmployeeListItem>[] = [];

    // Add serial number if configured
    if (columnConfig.showSerialNumber) {
      first.push(columnBuilder.buildSerialNumberColumn());
    }

    // Add full name for default view
    if (columnConfig.type === 'default') {
      first.push(columnBuilder.buildFullNameColumn());
      sections = getDefaultColumnSections(columnBuilder);
    } else if (columnConfig.type === 'week-wise') {
      // For week-wise view, no first columns, use custom layout
      sections = [getWeekWiseColumns(columnBuilder)];
    } else if (columnConfig.type === 'department-view') {
      sections = [getDepartmentViewColumns(columnBuilder)];
    } else if (columnConfig.customColumns) {
      // Custom configuration
      sections = [columnConfig.customColumns];
    }

    // Add action column if configured
    if (columnConfig.showActions) {
      last.push(columnBuilder.buildActionColumn());
    }

    return {
      firstColumns: first,
      lastColumn: last[0],
      columnSections: sections,
    };
  }, [columnBuilder, columnConfig]);

  const columnSectionsExpanded = useMemo(
    () => columnSections.flat(),
    [columnSections]
  );

  const toggleColumn: TableColumn<EmployeeListItem> | null = useMemo(() => {
    // Only show toggle column for default view with multiple sections
    if (!columnConfig.showMoreColumnsNavigation || columnSections.length <= 1) {
      return null;
    }

    return {
      name: "More columns ...",
      cell: () => (
        <div className="flex justify-center items-center gap-4 my-1 text-gray-500">
          <button
            onClick={() =>
              isSmallScreen ? setActiveColumnIndex(0) : setActiveSectionIndex(0)
            }
            disabled={
              isSmallScreen ? activeColumnIndex === 0 : activeSectionIndex === 0
            }
            className="disabled:opacity-50"
            aria-label="First"
          >
            <FontAwesomeIcon icon={faBackwardStep} size="lg" />
          </button>
          <button
            onClick={() =>
              isSmallScreen
                ? setActiveColumnIndex((prev) => Math.max(prev - 1, 0))
                : setActiveSectionIndex((prev) => Math.max(prev - 1, 0))
            }
            disabled={
              isSmallScreen ? activeColumnIndex === 0 : activeSectionIndex === 0
            }
            className="disabled:opacity-50"
            aria-label="Previous"
          >
            <FontAwesomeIcon icon={faAngleLeft} size="lg" />
          </button>
          <button
            onClick={() =>
              isSmallScreen
                ? setActiveColumnIndex((prev) =>
                    Math.min(prev + 1, columnSectionsExpanded.length - 1)
                  )
                : setActiveSectionIndex((prev) =>
                    Math.min(prev + 1, columnSections.length - 1)
                  )
            }
            disabled={
              isSmallScreen
                ? activeColumnIndex === columnSectionsExpanded.length - 1
                : activeSectionIndex === columnSections.length - 1
            }
            className="disabled:opacity-50"
            aria-label="Next"
          >
            <FontAwesomeIcon icon={faAngleRight} size="lg" />
          </button>
          <button
            onClick={() =>
              isSmallScreen
                ? setActiveColumnIndex(columnSectionsExpanded.length - 1)
                : setActiveSectionIndex(columnSections.length - 1)
            }
            disabled={
              isSmallScreen
                ? activeColumnIndex === columnSectionsExpanded.length - 1
                : activeSectionIndex === columnSections.length - 1
            }
            className="disabled:opacity-50"
            aria-label="Last"
          >
            <FontAwesomeIcon icon={faForwardStep} size="lg" />
          </button>
        </div>
      ),
    };
  }, [
    columnConfig.showMoreColumnsNavigation,
    columnSections.length,
    isSmallScreen,
    activeColumnIndex,
    activeSectionIndex,
    columnSectionsExpanded.length,
    setActiveColumnIndex,
    setActiveSectionIndex,
  ]);

  const columns = useMemo(() => {
    const cols: TableColumn<EmployeeListItem>[] = [];

    // Add first columns
    cols.push(...firstColumns);

    // Add section columns based on view type
    if (columnConfig.showMoreColumnsNavigation && columnSections.length > 1) {
      // Default responsive behavior
      if (isSmallScreen) {
        if (columnSectionsExpanded[activeColumnIndex]) {
          cols.push(columnSectionsExpanded[activeColumnIndex]);
        }
      } else {
        if (columnSections[activeSectionIndex]) {
          cols.push(...columnSections[activeSectionIndex]);
        }
      }
    } else if (columnSections.length > 0) {
      // Show all columns from first section for non-responsive views
      cols.push(...columnSections[0]);
    }

    // Add toggle column if needed
    if (toggleColumn) {
      cols.push(toggleColumn);
    }

    // Add last column (action)
    if (lastColumn) {
      cols.push(lastColumn);
    }

    return cols;
  }, [
    firstColumns,
    columnConfig.showMoreColumnsNavigation,
    columnSections,
    isSmallScreen,
    activeColumnIndex,
    activeSectionIndex,
    columnSectionsExpanded,
    toggleColumn,
    lastColumn,
  ]);

  return {
    columns,
    columnSections,
    columnSectionsExpanded,
  };
}; 