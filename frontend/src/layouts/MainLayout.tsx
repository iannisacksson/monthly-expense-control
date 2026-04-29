import { useMemo, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useMonths } from "../hooks";
import { useAuthStore } from "../store";

const MONTH_NAMES = [
  "", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [monthsMenuOpen, setMonthsMenuOpen] = useState(true);
  const { currentUserId } = useAuthStore();
  const activeUserId = currentUserId ?? undefined;
  const monthsLink = activeUserId ? `/users/${activeUserId}/months` : "/";
  const { data: months = [] } = useMonths({ userId: activeUserId });
  const openMonths = useMemo(
    () => months.filter((month) => month.status === "open"),
    [months]
  );

  const navItems = [
    { to: "/", label: "Dashboard", hint: "Visão geral" },
    { to: monthsLink, label: "Meus meses", hint: currentUserId ? "Fluxo principal" : "Escolha um usuário" },
    { to: "/families", label: "Famílias", hint: "Compatibilidade legada" },
  ];

  return (
    <div className="app-shell">
      <div className={["app-backdrop", menuOpen ? "is-visible" : ""].filter(Boolean).join(" ")} onClick={() => setMenuOpen(false)} />
      <aside className={["app-sidebar", menuOpen ? "is-open" : ""].filter(Boolean).join(" ")}>
        <div className="app-sidebar__header">
          <div className="app-brand">
            <div className="app-brand__mark">FC</div>
            <div className="app-brand__eyebrow">Controle pessoal</div>
            <div className="app-brand__title">Finanças da Casa</div>
            <div className="app-brand__subtitle">Planejamento mensal com mais clareza, ritmo e visão consolidada.</div>
          </div>
          <button type="button" className="app-sidebar__close" onClick={() => setMenuOpen(false)}>
            Fechar
          </button>
        </div>

        <div className="app-sidebar__meta">
          <div className="app-brand__eyebrow">Foco do ciclo</div>
          <strong>{currentUserId ? "Fluxo por usuário ativo" : "Escolha um usuário no dashboard"}</strong>
          <p>O shell prioriza navegação rápida, contexto do mês e densidade visual mais limpa.</p>
        </div>

        <nav className="app-nav">
          {navItems.map((item) => {
            if (item.label !== "Meus meses") {
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) => ["app-nav__link", isActive ? "active" : ""].filter(Boolean).join(" ")}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{item.label}</span>
                  <span className="app-nav__hint">{item.hint}</span>
                </NavLink>
              );
            }

            return (
              <div key={item.label} className="app-nav__group">
                <div className="app-nav__group-header">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => ["app-nav__link", "app-nav__link--group", isActive ? "active" : ""].filter(Boolean).join(" ")}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                    <span className="app-nav__hint">{item.hint}</span>
                  </NavLink>
                  {activeUserId && (
                    <button
                      type="button"
                      className="app-nav__toggle"
                      onClick={() => setMonthsMenuOpen((current) => !current)}
                      aria-expanded={monthsMenuOpen}
                      aria-label="Alternar meses em aberto"
                    >
                      {monthsMenuOpen ? "−" : "+"}
                    </button>
                  )}
                </div>

                {activeUserId && monthsMenuOpen && (
                  <div className="app-nav__submenu">
                    {openMonths.length === 0 ? (
                      <div className="app-nav__empty">Nenhum mês em aberto</div>
                    ) : (
                      openMonths.map((month) => (
                        <NavLink
                          key={month.id}
                          to={`/users/${activeUserId}/months/${month.id}`}
                          className={({ isActive }) => ["app-nav__sublink", isActive ? "active" : ""].filter(Boolean).join(" ")}
                          onClick={() => setMenuOpen(false)}
                        >
                          <span>{MONTH_NAMES[month.month]} {month.year}</span>
                          <span className="app-nav__hint">Aberto</span>
                        </NavLink>
                      )).sort((a, b) => {
                        const monthA = openMonths.find((m) => m.id === a.key);
                        const monthB = openMonths.find((m) => m.id === b.key);
                        if (!monthA || !monthB) return 0;
                        const dateA = new Date(monthA.year, monthA.month - 1);
                        const dateB = new Date(monthB.year, monthB.month - 1);
                        return dateA.getTime() - dateB.getTime();
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <div>
            <button type="button" className="app-topbar__menu" onClick={() => setMenuOpen(true)}>
              Menu
            </button>
            <div className="app-topbar__title">Painel financeiro</div>
            <div className="app-topbar__subtitle">Uma interface mais focada em leitura rápida, prioridade e contexto.</div>
          </div>
          <div className="app-topbar__badge">Planejamento mensal</div>
        </header>

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
