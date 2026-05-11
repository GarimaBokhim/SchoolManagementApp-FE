// components/ReusableTable/ReusableTable.tsx
"use client";
import React, { ReactNode } from "react";
import { EditButton } from "@/components/Buttons/EditButton";
import DeleteButton from "@/components/Buttons/DeleteButton";
import { Trash } from "lucide-react";

export interface Column<T = any> {
  key: string;
  header: string;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  width?: string;
}

export interface TableAction<T = any> {
  icon?: ReactNode;
  label?: string;
  onClick: (item: T) => void;
  condition?: (item: T) => boolean;
  className?: string;
  isEdit?: boolean;
  isDelete?: boolean;
}

interface ReusableTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  actions?: TableAction<T>[];
  isLoading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  onSerialNumber?: boolean;
  serialNumberStart?: number;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => Promise<void> | void;
  canEdit?: boolean;
  canDelete?: boolean;
  rowClassName?: string | ((item: T, index: number) => string);
  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

export function ReusableTable<T extends { id?: string; Id?: string }>({
  data,
  columns,
  actions = [],
  isLoading = false,
  loadingMessage = "Loading...",
  emptyMessage = "No data found.",
  onSerialNumber = true,
  serialNumberStart = 0,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
  rowClassName = "hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700",
  tableClassName = "w-full border-collapse text-xs sm:text-sm",
  headerClassName = "bg-gray-50 dark:text-white text-gray-700 dark:bg-[#80878c] uppercase text-sm font-semibold border-b border-gray-200",
  bodyClassName = "",
}: ReusableTableProps<T>) {
  
  const getSerialNumber = (index: number) => {
    return serialNumberStart + index + 1;
  };

  const getItemId = (item: T): string => {
    return (item.id || item.Id || "").toString();
  };

  const renderActions = (item: T, index: number) => {
    const hasActions = actions.length > 0 || onEdit || onDelete;
    if (!hasActions) return null;

    return (
      <div className="flex justify-center items-center gap-2">
        {actions.map((action, idx) => {
          if (action.condition && !action.condition(item)) return null;
          
          if (action.isEdit && onEdit) {
            return (
              <EditButton
                key={idx}
                button={
                  <button
                    onClick={() => onEdit(item)}
                    className={`p-2 rounded-md transition-all duration-200 ${action.className || "!bg-teal-500 hover:bg-teal-600"}`}
                  >
                    {action.icon || "Edit"}
                  </button>
                }
              />
            );
          }
          
          if (action.isDelete && onDelete) {
            return (
              <DeleteButton
                key={idx}
                // FIXED: Pass JSX.Element instead of string
                headerText={action.icon ? <>{action.icon}</> : <Trash size={16} />}
                content="Are you sure you want to delete this item?"
                onConfirm={() => onDelete(item)}
              />
            );
          }
          
          return (
            <button
              key={idx}
              onClick={() => action.onClick(item)}
              className={`p-2 rounded-md transition-all duration-200 ${action.className}`}
            >
              {action.icon || action.label}
            </button>
          );
        })}
        
        {onEdit && !actions.some(a => a.isEdit) && canEdit && (
          <EditButton
            button={
              <button
                onClick={() => onEdit(item)}
                className="p-2 rounded-md transition-all duration-200 !bg-teal-500 hover:bg-teal-600"
              >
                Edit
              </button>
            }
          />
        )}
        
        {onDelete && !actions.some(a => a.isDelete) && canDelete && (
          <DeleteButton
            // FIXED: Pass JSX.Element instead of string
            headerText={<Trash size={16} />}
            content="Are you sure you want to delete this item?"
            onConfirm={() => onDelete(item)}
          />
        )}
      </div>
    );
  };

  const getAlignmentClass = (align?: string) => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        {loadingMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={tableClassName}>
        <thead>
          <tr className={headerClassName}>
            {onSerialNumber && (
              <th className="px-4 py-3 align-middle w-[60px]">S.N</th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 align-middle ${getAlignmentClass(column.align)} ${column.className || ""}`}
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
            {(actions.length > 0 || onEdit || onDelete) && (
              <th className="px-4 py-3 text-center align-middle w-[180px]">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className={bodyClassName}>
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={getItemId(item) || index}
                className={typeof rowClassName === "function" 
                  ? rowClassName(item, index) 
                  : rowClassName}
              >
                {onSerialNumber && (
                  <td className="py-3 px-4 align-middle">
                    {getSerialNumber(index)}
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={`${getItemId(item)}-${column.key}`}
                    className={`py-3 px-4 align-middle ${getAlignmentClass(column.align)}`}
                  >
                    {column.render 
                      ? column.render(item, index)
                      : (item as any)[column.key]}
                  </td>
                ))}
                {(actions.length > 0 || onEdit || onDelete) && (
                  <td className="py-3 px-4 align-middle">
                    {renderActions(item, index)}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={(onSerialNumber ? 1 : 0) + columns.length + ((actions.length > 0 || onEdit || onDelete) ? 1 : 0)}
                className="p-4 text-center text-gray-500 italic"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};