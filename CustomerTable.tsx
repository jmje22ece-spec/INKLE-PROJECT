import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { TaxRecord } from '@/services/api';
import { Pencil, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CustomerTableProps {
  data: TaxRecord[];
  isLoading: boolean;
  onEdit: (record: TaxRecord) => void;
}

const CustomerTable = ({ data, isLoading, onEdit }: CustomerTableProps) => {
  const columns: ColumnDef<TaxRecord>[] = [
    {
      accessorKey: 'name',
      header: 'Entity',
      cell: ({ row }) => (
        <span className="text-name-link font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => {
        const gender = row.original.gender;
        return (
          <Badge
            variant="secondary"
            className={
              gender === 'Male'
                ? 'bg-badge-male-bg text-gender-male border-0'
                : 'bg-badge-female-bg text-gender-female border-0'
            }
          >
            {gender}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'requestDate',
      header: 'Request date',
      cell: ({ row }) => {
        const date = new Date(row.original.requestDate);
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      },
    },
    {
      accessorKey: 'country',
      header: 'Country',
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => onEdit(row.original)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <table className="w-full">
        <thead className="bg-table-header">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-left text-sm font-medium text-foreground"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-t border-border hover:bg-table-row-hover transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 text-sm text-foreground">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {table.getRowModel().rows.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No data available
        </div>
      )}
    </div>
  );
};

export default CustomerTable;
