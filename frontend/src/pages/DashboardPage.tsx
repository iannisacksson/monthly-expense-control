import { useEffect } from "react";
import { useUsers } from "../hooks";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import Card from "../components/ui/Card/Card";
import Button from "../components/ui/Button/Button";

export default function DashboardPage() {
  const { data: users, isLoading: loadingUsers } = useUsers();
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
    </div>
  );
}
