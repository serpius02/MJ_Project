"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// 이 부분의 경로는 실제 프로젝트 구조에 맞게 확인해주세요.
import { CDSData } from "./columns";

interface UniversityTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function UniversityTable({
  columns,
  data,
}: UniversityTableProps<CDSData, unknown>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full min-w-0 overflow-x-auto bg-card border border-border rounded-lg shadow-lg">
      <Table className="w-auto min-w-full">
        <TableHeader className="bg-muted/30 border-b border-border">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="h-14 px-6 font-semibold text-[16px] text-base-primary overflow-hidden whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="[&_tr]:border-0">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={`
                  transition-all duration-200 ease-in-out
                  group
                  !border-0
                  hover:bg-muted/20
                  ${
                    index !== table.getRowModel().rows.length - 1
                      ? "svg-dotted-border"
                      : ""
                  }
                `}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="px-6 py-5 group-hover:bg-transparent overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="border-0 hover:bg-transparent">
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-base-secondary"
              >
                대학교 데이터가 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
