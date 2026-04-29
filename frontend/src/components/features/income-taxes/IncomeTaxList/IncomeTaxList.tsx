import Table from "../../../ui/Table/Table";
import Button from "../../../ui/Button/Button";
import type { TableColumn } from "../../../ui/Table/Table.types";
import type { IncomeTax } from "../../../../types";

interface IncomeTaxListProps {
  taxes: IncomeTax[];
  onEdit: (tax: IncomeTax) => void;
  onDelete: (tax: IncomeTax) => void;
}

export default function IncomeTaxList({ taxes, onEdit, onDelete }: IncomeTaxListProps) {
  const totalTaxes = taxes.reduce((sum, tax) => sum + Number(tax.value), 0);

  const columns: TableColumn<IncomeTax>[] = [
    { key: "tax_type", header: "Tipo", render: (tax) => tax.tax_type },
    { key: "value", header: "Valor", render: (tax) => `R$ ${Number(tax.value).toFixed(2)}` },
    { key: "is_auto", header: "Origem", render: (tax) => (tax.is_auto ? "Automático" : "Manual") },
    {
      key: "actions",
      header: "Ações",
      render: (tax) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" onClick={() => onEdit(tax)} disabled={tax.is_auto}>Editar</Button>
          <Button variant="danger" onClick={() => onDelete(tax)} disabled={tax.is_auto}>Excluir</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table columns={columns} data={taxes} rowKey={(tax) => tax.id} emptyMessage="Nenhum imposto cadastrado." />
      {taxes.length > 0 && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12, fontWeight: 700, color: "#dc2626" }}>
          Total de impostos: R$ {totalTaxes.toFixed(2)}
        </div>
      )}
    </div>
  );
}