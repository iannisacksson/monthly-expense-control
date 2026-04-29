export default function DashboardPage() {
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
    </div>
  );
}
