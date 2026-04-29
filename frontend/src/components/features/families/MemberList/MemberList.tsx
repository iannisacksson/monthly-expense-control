import Table from "../../../ui/Table/Table";
import Button from "../../../ui/Button/Button";
import type { TableColumn } from "../../../ui/Table/Table.types";
import type { FamilyMember } from "../../../../types";

interface MemberListProps {
  members: FamilyMember[];
  onRemove: (id: string) => void;
}

export default function MemberList({ members, onRemove }: MemberListProps) {
  const columns: TableColumn<FamilyMember>[] = [
    {
      key: "user_id",
      header: "Usuário",
      render: (m) => m.user_id,
    },
    {
      key: "role",
      header: "Papel",
      render: (m) => m.role,
    },
    {
      key: "created_at",
      header: "Adicionado em",
      render: (m) => new Date(m.created_at).toLocaleDateString("pt-BR"),
    },
    {
      key: "actions",
      header: "Ações",
      render: (m) => (
        <Button variant="danger" onClick={() => onRemove(m.id)}>Remover</Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={members}
      rowKey={(m) => m.id}
      emptyMessage="Nenhum membro adicionado."
    />
  );
}
