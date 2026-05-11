"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Trash2 } from "lucide-react";
import { useState,useEffect } from "react";

const StatusBadge = ({ value = false, trueLabel = "Y", falseLabel = "N" }) => (
  <Badge
    variant={value ? "default" : "secondary"}
    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm font-semibold border-0 mx-auto ${
      value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
    }`}
  >
    {value ? trueLabel : falseLabel}
  </Badge>
);

const EditableSelectCell = ({
  value = "",
  onChange = () => {},
  options = [],
  className = "",
  readOnly = false,
}) => {
  const hasValue = value && value !== "None" && value !== "";

  if (readOnly) {
    return (
      <div className="flex justify-center">
        <div
          className={`h-7 sm:h-8 flex items-center justify-center text-center ${className}`}
        >
          <span className="text-sm">{hasValue ? value : "—"}</span>
        </div>
      </div>
    );
  }

  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-center">
      <Select value={value} onValueChange={onChange} onOpenChange={setOpen}>
        <SelectTrigger
          className={`h-7 sm:h-8 bg-transparent hover:bg-gray-50 focus:bg-white border-0 shadow-none text-center ${className} ${
            hasValue ? "px-2" : ""
          }`}
        >
          {hasValue ? (
            <span className="text-xs sm:text-sm">{value}</span>
          ) : (
            <div className="flex items-center justify-between w-full">
              <SelectValue>
                <span className="text-xs sm:text-sm">—</span>
              </SelectValue>
              {open ? (
                <ChevronUp className="h-3 w-3 opacity-50 ml-1" />
              ) : (
                <ChevronDown className="h-3 w-3 opacity-50 ml-1" />
              )}
            </div>
          )}
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const TableContainer = ({ children }) => (
  <div className="w-full">
    <div className="relative">
      <div className="inline-block min-w-full align-middle">
        <div className="max-w-full">{children}</div>
      </div>
    </div>
  </div>
);

const TableHeaderCell = ({
  children,
  sticky = false,
  className = "",
  width = "auto",
}) => (
  <TableHead
    className={`px-1 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap text-center border-b border-gray-200 bg-[#F9FAFC] ${
      sticky ? "sticky left-0 z-10" : ""
    } ${className}`}
    style={{ width, minWidth: width }}
  >
    {children}
  </TableHead>
);

const TableCellWithSticky = ({
  children,
  sticky = false,
  className = "",
  width = "auto",
}) => (
  <TableCell
    className={`px-1 py-2 whitespace-nowrap text-center text-xs ${
      sticky ? "sticky left-0 bg-white group-hover:bg-gray-50 transition-colors duration-150 z-10" : ""
    } ${className}`}
    style={{ width, minWidth: width }}
  >
    {children}
  </TableCell>
);


export const CustomTable = ({
  data = [],
  columns = [],
  onEditRow = () => {},
  onDeleteRow = () => {},
  onViewRow = () => {},
  isLoading = false,
  stickyColumn = null,
  actionButtons = ["edit"],
  emptyMessage = "No data found",
  rowKey = "id",
}) => {
  const [visibleColumns, setVisibleColumns] = useState({});
  const [mobileHiddenColumns, setMobileHiddenColumns] = useState([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 768;
      const initialVisibility = {};
      columns.forEach((col, index) => {
        if (isMobile && (col.hideOnMobile || index > 1)) {
          initialVisibility[col.key] = false;
        } else {
          initialVisibility[col.key] = true;
        }
      });
      setVisibleColumns(initialVisibility);
    }
  }, [columns]);
  const renderCellValue = (row, column) => {
    let value = row[column.key];
    if (column.nested && column.nested.length) {
      value = column.nested.reduce((obj, key) => obj?.[key], row);
    }
    if (column.type === "date" && value) {
      return new Date(value).toLocaleDateString();
    }
    if (column.type === "currency" && value !== undefined) {
      return `$${Number(value).toLocaleString()}`;
    }
    if (column.type === "number" && value !== undefined) {
      return Number(value).toLocaleString();
    }
    if (column.type === "boolean") {
      return (
        <StatusBadge 
          value={value} 
          trueLabel={column.trueLabel || "Y"} 
          falseLabel={column.falseLabel || "N"} 
        />
      );
    }
    
    if (column.type === "select" && column.editable !== false) {
      return (
        <EditableSelectCell
          value={value || "None"}
          onChange={(newValue) => column.onChange?.(row, newValue)}
          options={column.selectOptions || []}
          className={column.cellClassName}
          readOnly={column.readOnly}
        />
      );
    }
    
    if (column.type === "badge") {
      return (
        <Badge
          variant="outline"
          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm font-semibold border-0 mx-auto ${column.badgeClassName?.(value) || ""}`}
        >
          {column.badgeFormatter ? column.badgeFormatter(value) : value}
        </Badge>
      );
    }
    
    return (
      <span className="text-sm">
        {value !== undefined && value !== null ? String(value) : "—"}
      </span>
    );
  };

  const toggleColumnVisibility = (columnKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  const totalColumns = columns.filter(col => visibleColumns[col.key] !== false).length + 1;

  const visibleColumnsList = columns.filter(col => visibleColumns[col.key] !== false);

  return (
    <>
      {mobileHiddenColumns.length > 0 && (
        <div className="flex justify-end mb-2 md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const allHidden = visibleColumnsList.length === 0;
              const newVisibility = {};
              columns.forEach(col => {
                newVisibility[col.key] = allHidden ? !col.hideOnMobile : false;
              });
              setVisibleColumns(newVisibility);
            }}
            className="text-xs"
          >
            <Filter className="h-3 w-3 mr-1" />
            {visibleColumnsList.length === 0 ? "Show All Columns" : "Hide Details"}
          </Button>
        </div>
      )}

      <TableContainer>
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-[#F9FAFC]">
              {columns.map((column) => {
                if (visibleColumns[column.key] === false) return null;
                
                return (
                  <TableHeaderCell
                    key={column.key}
                    sticky={stickyColumn === column.key}
                    width={column.width}
                  >
                    <span className="text-sm">{column.label}</span>
                  </TableHeaderCell>
                );
              })}

              {actionButtons.length > 0 && (
                <TableHeaderCell width="100px">
                  <span className="text-sm">ACTIONS</span>
                </TableHeaderCell>
              )}
            </TableRow>
          </TableHeader>

          <TableBody className="bg-white">
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={totalColumns + (actionButtons.length > 0 ? 1 : 0)}
                  className="px-6 py-4 text-center"
                >
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={totalColumns + (actionButtons.length > 0 ? 1 : 0)}
                  className="px-6 py-4 text-center"
                >
                  <div className="text-gray-500 py-8">{emptyMessage}</div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow
                  key={row[rowKey] || index}
                  className="group hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100"
                >
                  {columns.map((column) => {
                    if (visibleColumns[column.key] === false) return null;
                    
                    return (
                      <TableCellWithSticky
                        key={column.key}
                        sticky={stickyColumn === column.key}
                        width={column.width}
                        className={column.cellClassName}
                      >
                        {renderCellValue(row, column)}
                      </TableCellWithSticky>
                    );
                  })}

                  {actionButtons.length > 0 && (
                    <TableCellWithSticky width="100px">
                      <div className="flex justify-center items-center gap-1">
                        {actionButtons.includes("view") && onViewRow && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-100"
                            onClick={() => onViewRow(row)}
                            title="View"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                          </Button>
                        )}
                        
                        {actionButtons.includes("edit") && onEditRow && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-100"
                            onClick={() => onEditRow(row)}
                            title="Edit"
                          >
                            <Pencil className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                          </Button>
                        )}
                        
                        {actionButtons.includes("delete") && onDeleteRow && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-red-50"
                            onClick={() => onDeleteRow(row)}
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCellWithSticky>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};