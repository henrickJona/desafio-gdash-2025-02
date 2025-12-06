import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Column<T> {
  header: string;
  accessor: keyof T;
}

interface DataTableProps<T> {
  items: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  disableEdit?: (item: T) => boolean;
  disableDelete?: (item: T) => boolean;
  loading?: boolean;
  loadingDeleteItemId?: string | null;
}

export function DataTable<T>({
  items,
  columns,
  onEdit,
  onDelete,
  disableEdit,
  disableDelete,
  loading,
  loadingDeleteItemId,
}: DataTableProps<T>) {
  if (loading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
      </div>
    );

  return (
    // Adicionado border-collapse para aparência de tabela moderna e sombra para destacá-la
    <div className="rounded-lg border overflow-x-auto shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              // Ajustado o padding e alinhamento do header
              <th
                key={String(col.accessor)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              // Ajustado o padding e alinhamento para o header de Ações
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.isArray(items) && items.length > 0 ? (
            items.map((item: T, i) => (
              // Adicionado hover para melhor usabilidade
              <tr key={i} className="hover:bg-gray-50">
                {columns.map((col) => (
                  // Ajustado o padding e o estilo do conteúdo
                  <td
                    key={String(col.accessor)}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {String(item[col.accessor])}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  // Ajustado o padding, alinhamento e espaçamento dos botões
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="space-x-2 flex justify-end items-center">
                      {onEdit && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onEdit(item)}
                          disabled={disableEdit?.(item)}
                        >
                          Editar
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(item)}
                          disabled={disableDelete?.(item)}
                        >
                          {loadingDeleteItemId === (item as any)._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Excluir"
                          )}
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-6 py-4 text-center text-gray-500 text-sm italic"
              >
                Nenhum item encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
