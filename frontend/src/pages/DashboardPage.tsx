import { useEffect } from "react";
import { useFamilies, useUsers } from "../hooks";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import Card from "../components/ui/Card/Card";
import Button from "../components/ui/Button/Button";

export default function DashboardPage() {
  const { data: users, isLoading: loadingUsers } = useUsers();
  const { data: families, isLoading } = useFamilies();
  const { currentUserId, setCurrentUserId } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUserId && users && users.length > 0) {
      setCurrentUserId(users[0].id);
    }
  }, [currentUserId, setCurrentUserId, users]);

  return (
    <div className="page">
      <section className="page-hero">
        <div className="page-hero__content">
          <div className="page-hero__eyebrow">Visão inicial</div>
          <h1 className="page-title">Dashboard financeiro</h1>
          <p className="page-subtitle">
            Entre pelo usuário ativo e trate as famílias legadas como contexto de transição, não como fluxo principal.
          </p>
        </div>
        <div className="page-hero__actions">
          <div className="status-pill status-pill--success">Experiência centrada no mês</div>
          <div className="page-hero__links">
            <span className="muted-text">Selecione um usuário para continuar.</span>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="page-section__header">
          <div>
            <div className="section-label">Entrada principal</div>
            <h2 className="page-section__title">Usuários</h2>
            <p className="page-section__subtitle">Cada cartão leva direto para a visão mensal do usuário.</p>
          </div>
        </div>
        {loadingUsers && <p>Carregando...</p>}
        {!loadingUsers && users && users.length > 0 && (
          <div className="grid-cards">
            {users.map((user) => (
              <Card key={user.id} className="dashboard-card">
                <div>
                  <div className="section-label">Usuário ativo</div>
                  <div className="dashboard-card__title">{user.name}</div>
                  <p className="dashboard-card__meta">{user.email}</p>
                </div>
                <div className="action-row">
                  <Button onClick={() => {
                    setCurrentUserId(user.id);
                    navigate(`/users/${user.id}/months`);
                  }}>
                    Meses
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="page-section">
        <div className="page-section__header">
          <div>
            <div className="section-label">Compatibilidade</div>
            <h2 className="page-section__title">Famílias legadas</h2>
            <p className="page-section__subtitle">Mantidas para transição, mas já separadas visualmente do fluxo principal.</p>
          </div>
        </div>
        {isLoading && <p>Carregando...</p>}
        {!isLoading && (!families || families.length === 0) && (
          <div className="surface-card">
            <p className="muted-text">Nenhuma família cadastrada.</p>
            <Button onClick={() => navigate("/families")}>Criar Família</Button>
          </div>
        )}
        {families && families.length > 0 && (
          <div className="grid-cards">
            {families.map((f) => (
              <Card key={f.id} className="dashboard-card">
                <div>
                  <div className="section-label">Modo legado</div>
                  <div className="dashboard-card__title">{f.name}</div>
                  <p className="dashboard-card__meta">
                  Criada em {new Date(f.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="action-row">
                  <Button variant="secondary" onClick={() => navigate(`/families/${f.id}/members`)}>Membros</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
