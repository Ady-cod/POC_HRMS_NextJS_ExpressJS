import React, { useMemo } from 'react';
import { TableColumn } from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBackwardStep,
  faForwardStep,
  faAngleLeft,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';
import { Trash2, Pencil } from 'lucide-react';
import { EmployeeListItem } from '@/types/types';
import { formatDate } from '@/utils/dateUtils';

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
}: UseEmployeeTableColumnsProps) => {
  
  const firstColumns: TableColumn<EmployeeListItem>[] = useMemo(() => [
    {
      name: "SNo.",
      cell: (row: EmployeeListItem, index: number) => {
        const previousPages = currentPage - 1;
        // Calculate the correct row number by adding to the current position the previous pages rows if any
        return previousPages * rowsPerPage + index + 1;
      },
      width: "80px",
    },
    {
      name: "Full Name",
      selector: (employee) => employee.fullName || "N/A",
      sortable: true,
    },
  ], [currentPage, rowsPerPage]);

  const lastColumn: TableColumn<EmployeeListItem> = useMemo(() => ({
    name: "Action",
    cell: (employee) => (
      <div className="flex items-center gap-2 whitespace-nowrap">
        {/* Edit Button */}
        <button
          onClick={() => handleEdit(employee)}
          className="flex items-center gap-1 text-sm text-gray-700 hover:text-black transition"
        >
          <Pencil size={18} />
          <span>Edit</span>
        </button>

        {/* Delete Button */}
        <button
          onClick={() => handleDeleteClick(employee)}
          className="flex items-center gap-1 text-sm text-gray-700 hover:text-black transition"
        >
          <Trash2 size={18} />
          <span>Delete</span>
        </button>
      </div>
    ),
  }), [handleEdit, handleDeleteClick]);

  const columnSections: TableColumn<EmployeeListItem>[][] = useMemo(() => [
    [
      {
        name: "Email",
        selector: (employee) => employee.email || "N/A",
        sortable: true,
      },
      {
        name: "Phone",
        selector: (employee) => employee.phoneNumber || "N/A",
        sortable: true,
      },
      {
        name: "Department",
        selector: (employee) => employee.department?.name || "N/A",
        sortable: true,
      },
    ],
    [
      {
        name: "Role",
        selector: (employee) => employee.role || "N/A",
        sortable: true,
      },
      {
        name: "Joining Date",
        selector: (employee) => formatDate(employee.dateOfJoining),
        sortable: true,
      },
      {
        name: "Status",
        selector: (employee) => employee.status || "N/A",
        sortable: true,
      },
    ],
    [
      {
        name: "Country",
        selector: (employee) => employee.country || "N/A",
        sortable: true,
      },
      {
        name: "City",
        selector: (employee) => employee.city || "N/A",
        sortable: true,
      },
      {
        name: "Address",
        selector: (employee) => employee.streetAddress || "N/A",
        sortable: true,
      },
    ],
    [
      {
        name: "Birthday",
        selector: (employee) => formatDate(employee.birthDate),
        sortable: true,
      },
      {
        name: "Gender",
        selector: (employee) => employee.gender || "N/A",
        sortable: true,
      },
      {
        name: "Full Onboarding",
        selector: (employee) => (employee.inductionCompleted ? "Yes" : "No"),
        sortable: true,
      },
    ],
  ], []);

  const columnSectionsExpanded = useMemo(
    () => columnSections.flat(),
    [columnSections]
  );

  const toggleColumn: TableColumn<EmployeeListItem> = useMemo(() => ({
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
  }), [
    isSmallScreen,
    activeColumnIndex,
    activeSectionIndex,
    columnSectionsExpanded.length,
    columnSections.length,
    setActiveColumnIndex,
    setActiveSectionIndex,
  ]);

  const columns = useMemo(() => {
    return isSmallScreen
      ? [
          ...firstColumns,
          columnSectionsExpanded[activeColumnIndex],
          toggleColumn,
          lastColumn,
        ]
      : [
          ...firstColumns,
          ...columnSections[activeSectionIndex],
          toggleColumn,
          lastColumn,
        ];
  }, [
    isSmallScreen,
    firstColumns,
    columnSectionsExpanded,
    activeColumnIndex,
    columnSections,
    activeSectionIndex,
    toggleColumn,
    lastColumn,
  ]);

  return {
    columns,
    columnSections,
    columnSectionsExpanded,
  };
}; 