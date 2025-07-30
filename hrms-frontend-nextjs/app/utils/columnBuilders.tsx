import React from "react";
import { TableColumn } from "react-data-table-component";
import { Trash2, Pencil } from "lucide-react";
import { EmployeeListItem } from "@/types/types";
import { formatDate } from "@/utils/dateUtils";

interface ColumnBuilderProps {
  currentPage?: number;
  rowsPerPage?: number;
  handleEdit?: (employee: EmployeeListItem) => void;
  handleDeleteClick?: (employee: EmployeeListItem) => void;
}

export class ColumnBuilder {
  private props: ColumnBuilderProps;

  constructor(props: ColumnBuilderProps) {
    this.props = props;
  }

  // Serial number column
  buildSerialNumberColumn(): TableColumn<EmployeeListItem> {
    const { currentPage = 1, rowsPerPage = 10 } = this.props;
    return {
      name: "SNo.",
      cell: (row: EmployeeListItem, index: number) => {
        const previousPages = currentPage - 1;
        return previousPages * rowsPerPage + index + 1;
      },
      width: "80px",
    };
  }

  // Basic employee info columns
  buildFullNameColumn(): TableColumn<EmployeeListItem> {
    return {
      name: "Full Name",
      selector: (employee) => employee.fullName || "N/A",
      sortable: true,
    };
  }

  buildEmailColumn(): TableColumn<EmployeeListItem> {
    return {
      name: "Email",
      selector: (employee) => employee.email || "N/A",
      sortable: true,
    };
  }

  buildPhoneColumn(): TableColumn<EmployeeListItem> {
    return {
      name: "Phone",
      selector: (employee) => employee.phoneNumber || "N/A",
      sortable: true,
    };
  }

  buildDepartmentColumn(): TableColumn<EmployeeListItem> {
    return {
      name: "Department",
      selector: (employee) => employee.department?.name || "N/A",
      sortable: true,
    };
  }

  buildRoleColumn(): TableColumn<EmployeeListItem> {
    return {
      name: "Role",
      selector: (employee) => employee.role || "N/A",
      sortable: true,
    };
  }

  buildStatusColumn(): TableColumn<EmployeeListItem> {
    return {
      name: "Status",
      selector: (employee) => employee.status || "N/A",
      sortable: true,
    };
  }

  buildJoiningDateColumn(): TableColumn<EmployeeListItem> {
    return {
      name: "Joining Date",
      selector: (employee) => formatDate(employee.dateOfJoining),
      sortable: true,
    };
  }

  buildBirthdayColumn(): TableColumn<EmployeeListItem> {
    return {
      name: "Birthday",
      selector: (employee) => formatDate(employee.birthDate),
      sortable: true,
    };
  }

  buildGenderColumn(): TableColumn<EmployeeListItem> {
    return {
      name: "Gender",
      selector: (employee) => employee.gender || "N/A",
      sortable: true,
    };
  }

  // Location columns
  buildCountryColumn(): TableColumn<EmployeeListItem> {
    return {
      name: "Country",
      selector: (employee) => employee.country || "N/A",
      sortable: true,
    };
  }

  buildCityColumn(): TableColumn<EmployeeListItem> {
    return {
      name: "City",
      selector: (employee) => employee.city || "N/A",
      sortable: true,
    };
  }

  buildAddressColumn(): TableColumn<EmployeeListItem> {
    return {
      name: "Address",
      selector: (employee) => employee.streetAddress || "N/A",
      sortable: true,
    };
  }

  // Special columns for week-wise view
  buildDaysSinceJoiningColumn(): TableColumn<EmployeeListItem> {
    return {
      name: "Days Since Joining",
      cell: (employee: EmployeeListItem) => {
        if (!employee.dateOfJoining) return "N/A";
        try {
          const joiningDate = new Date(employee.dateOfJoining);
          const today = new Date();
          const diffTime = Math.abs(today.getTime() - joiningDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays.toString();
        } catch {
          return "N/A";
        }
      },
      sortable: true,
    };
  }

  buildOnboardingStatusColumn(): TableColumn<EmployeeListItem> {
    return {
      name: "Full Onboarding",
      selector: (employee) => (employee.inductionCompleted ? "Yes" : "No"),
      sortable: true,
    };
  }

  // Action column
  buildActionColumn(): TableColumn<EmployeeListItem> {
    const { handleEdit, handleDeleteClick } = this.props;

    if (!handleEdit || !handleDeleteClick) {
      return {
        name: "Action",
        cell: () => <span>No actions available</span>,
      };
    }

    return {
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
    };
  }
}

// Predefined column sets
export const getDefaultColumnSections = (builder: ColumnBuilder) => [
  [
    builder.buildEmailColumn(),
    builder.buildPhoneColumn(),
    builder.buildDepartmentColumn(),
  ],
  [
    builder.buildRoleColumn(),
    builder.buildJoiningDateColumn(),
    builder.buildStatusColumn(),
  ],
  [
    builder.buildCountryColumn(),
    builder.buildCityColumn(),
    builder.buildAddressColumn(),
  ],
  [
    builder.buildBirthdayColumn(),
    builder.buildGenderColumn(),
    builder.buildOnboardingStatusColumn(),
  ],
];

export const getWeekWiseColumns = (builder: ColumnBuilder) => [
  builder.buildSerialNumberColumn(),
  builder.buildFullNameColumn(),
  builder.buildDepartmentColumn(),
  builder.buildJoiningDateColumn(),
  builder.buildDaysSinceJoiningColumn(),
];

export const getDepartmentViewColumns = (builder: ColumnBuilder) => [
  builder.buildFullNameColumn(),
  builder.buildRoleColumn(),
  builder.buildJoiningDateColumn(),
  builder.buildStatusColumn(),
];
