import type { ReactNode } from 'react'

import { NAV_ITEMS } from '../lib/mock-data'

const NAV_STATES: Record<string, string> = {
  overview: 'Pulso general',
  regions: '4 regiones',
  table: 'Detalle operativo',
  drilldown: 'Cuenta y subregión',
}

const COMMAND_CARDS = [
  { label: 'Modo', value: 'Operación semanal' },
  { label: 'Fuente', value: 'Dataset simulado' },
  { label: 'Cobertura', value: 'H1 2026' },
]

type DashboardShellProps = {
  children: ReactNode
}

export default function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="app-shell">
      <aside className="shell-rail">
        <div className="rail-panel brand-panel">
          <span className="brand-kicker">Pulse Regional</span>
          <div className="brand-lockup">
            <div className="brand-mark" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div>
              <strong>Centro de mando comercial</strong>
              <p>Ventas por región con foco en lectura ejecutiva y navegación por territorios.</p>
            </div>
          </div>
        </div>

        <nav className="rail-panel rail-nav" aria-label="Navegación principal">
          {NAV_ITEMS.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`rail-link ${index === 0 ? 'current' : ''}`}
              aria-current={index === 0 ? 'page' : undefined}
            >
              <span className="rail-link-copy">
                <strong>{item.label}</strong>
                <small>{NAV_STATES[item.id] ?? 'Disponible'}</small>
              </span>
              <span className="rail-link-index">0{index + 1}</span>
            </a>
          ))}
        </nav>

        <div className="rail-panel command-panel">
          <div className="panel-heading">
            <span className="panel-eyebrow">Estado de la vista</span>
            <strong>Shell listo para integrar widgets y filtros compartidos.</strong>
          </div>

          <div className="command-grid">
            {COMMAND_CARDS.map((card) => (
              <article key={card.label} className="command-card">
                <span>{card.label}</span>
                <strong>{card.value}</strong>
              </article>
            ))}
          </div>
        </div>
      </aside>

      <div className="shell-stage">
        <header className="stage-header">
          <div>
            <span className="stage-kicker">App shell</span>
            <p className="stage-copy">
              Navegación superior, marco responsivo y área principal preparada para subtareas
              de gráficas, tabla y drill-down.
            </p>
          </div>

          <div className="status-cluster" aria-label="Estado del tablero">
            <span className="status-chip emphasis">Simulado</span>
            <span className="status-chip">Next.js 14</span>
            <span className="status-chip">Layout responsivo</span>
          </div>
        </header>

        <div className="section-strip" aria-label="Accesos rápidos">
          {NAV_ITEMS.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="section-pill">
              {item.label}
            </a>
          ))}
        </div>

        <section className="content-frame">
          <div className="frame-header">
            <div>
              <span className="panel-eyebrow">Área principal</span>
              <h2>Dashboard operativo</h2>
            </div>
            <p>
              El contenido analítico vive dentro de este marco para mantener separación clara
              entre shell de aplicación y módulos de negocio.
            </p>
          </div>

          <div className="shell-content">{children}</div>
        </section>
      </div>

      <style jsx>{`
        .app-shell {
          width: min(1520px, calc(100% - 32px));
          margin: 0 auto;
          padding: 24px 0 40px;
          display: grid;
          grid-template-columns: 292px minmax(0, 1fr);
          gap: 24px;
        }

        .shell-rail {
          position: sticky;
          top: 24px;
          align-self: start;
          display: grid;
          gap: 18px;
        }

        .rail-panel,
        .stage-header,
        .content-frame,
        .section-strip {
          border: 1px solid rgba(23, 49, 63, 0.12);
          background: rgba(255, 249, 241, 0.78);
          box-shadow: 0 22px 60px rgba(23, 49, 63, 0.08);
          backdrop-filter: blur(18px);
        }

        .rail-panel,
        .content-frame {
          border-radius: 28px;
        }

        .brand-panel,
        .command-panel {
          padding: 22px;
        }

        .brand-kicker,
        .stage-kicker,
        .panel-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.74rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: rgba(23, 49, 63, 0.62);
        }

        .brand-lockup {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 14px;
          margin-top: 14px;
          align-items: start;
        }

        .brand-mark {
          width: 54px;
          aspect-ratio: 1;
          border-radius: 18px;
          background: linear-gradient(145deg, rgba(23, 49, 63, 0.98), rgba(45, 143, 133, 0.92));
          display: grid;
          place-items: end center;
          grid-template-columns: repeat(3, 1fr);
          gap: 5px;
          padding: 11px;
        }

        .brand-mark span {
          display: block;
          border-radius: 999px;
          background: rgba(247, 240, 232, 0.96);
        }

        .brand-mark span:nth-child(1) {
          height: 16px;
        }

        .brand-mark span:nth-child(2) {
          height: 24px;
        }

        .brand-mark span:nth-child(3) {
          height: 32px;
        }

        .brand-lockup strong,
        .panel-heading strong,
        .command-card strong,
        .frame-header h2 {
          display: block;
          font-family: var(--font-display);
          letter-spacing: -0.04em;
          color: #17313f;
        }

        .brand-lockup strong {
          font-size: 1.4rem;
        }

        .brand-lockup p,
        .stage-copy,
        .frame-header p,
        .panel-heading {
          margin: 0;
          color: rgba(23, 49, 63, 0.72);
          line-height: 1.6;
        }

        .rail-nav {
          padding: 10px;
          display: grid;
          gap: 8px;
        }

        .rail-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 15px 16px;
          border-radius: 20px;
          border: 1px solid transparent;
          color: #17313f;
          transition:
            transform 160ms ease,
            background 160ms ease,
            border-color 160ms ease;
        }

        .rail-link:hover,
        .rail-link:focus-visible,
        .section-pill:hover,
        .section-pill:focus-visible {
          transform: translateY(-1px);
        }

        .rail-link.current {
          background: linear-gradient(135deg, rgba(226, 122, 69, 0.15), rgba(45, 143, 133, 0.14));
          border-color: rgba(23, 49, 63, 0.08);
        }

        .rail-link-copy {
          display: grid;
          gap: 4px;
        }

        .rail-link-copy strong {
          font-size: 1rem;
        }

        .rail-link-copy small,
        .rail-link-index,
        .command-card span {
          color: rgba(23, 49, 63, 0.62);
        }

        .rail-link-index {
          font-family: var(--font-display);
          font-size: 0.95rem;
          letter-spacing: 0.1em;
        }

        .command-panel {
          display: grid;
          gap: 18px;
        }

        .panel-heading {
          display: grid;
          gap: 8px;
        }

        .command-grid {
          display: grid;
          gap: 10px;
        }

        .command-card {
          padding: 14px 16px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.58);
          border: 1px solid rgba(23, 49, 63, 0.08);
        }

        .command-card strong {
          margin-top: 6px;
          font-size: 1rem;
        }

        .shell-stage {
          display: grid;
          gap: 18px;
          min-width: 0;
        }

        .stage-header {
          border-radius: 30px;
          padding: 22px 24px;
          display: flex;
          align-items: start;
          justify-content: space-between;
          gap: 18px;
        }

        .stage-copy {
          margin-top: 8px;
          max-width: 58ch;
        }

        .status-cluster {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: flex-end;
        }

        .status-chip,
        .section-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 40px;
          padding: 0 14px;
          border-radius: 999px;
          font-size: 0.9rem;
          font-weight: 700;
          color: #17313f;
          border: 1px solid rgba(23, 49, 63, 0.1);
          background: rgba(255, 255, 255, 0.58);
        }

        .status-chip.emphasis {
          background: linear-gradient(135deg, rgba(226, 122, 69, 0.16), rgba(255, 255, 255, 0.7));
        }

        .section-strip {
          border-radius: 999px;
          padding: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .section-pill {
          flex: 0 0 auto;
          transition:
            transform 160ms ease,
            background 160ms ease;
        }

        .content-frame {
          padding: 22px;
          min-width: 0;
        }

        .frame-header {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 18px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(23, 49, 63, 0.08);
        }

        .frame-header h2 {
          margin: 8px 0 0;
          font-size: clamp(1.8rem, 2.8vw, 2.6rem);
        }

        .frame-header p {
          max-width: 44ch;
        }

        .shell-content {
          padding-top: 18px;
          min-width: 0;
        }

        @media (max-width: 1180px) {
          .app-shell {
            grid-template-columns: 1fr;
          }

          .shell-rail {
            position: static;
          }
        }

        @media (max-width: 820px) {
          .app-shell {
            width: min(100% - 20px, 1520px);
            padding: 18px 0 32px;
            gap: 18px;
          }

          .stage-header,
          .frame-header {
            flex-direction: column;
            align-items: start;
          }

          .status-cluster {
            justify-content: flex-start;
          }

          .content-frame,
          .brand-panel,
          .command-panel {
            padding: 18px;
          }
        }

        @media (max-width: 640px) {
          .brand-lockup {
            grid-template-columns: 1fr;
          }

          .rail-link {
            padding: 14px;
          }

          .section-strip {
            border-radius: 28px;
          }
        }
      `}</style>

      <style jsx global>{`
        .shell-content .dashboard-shell {
          width: 100%;
          margin: 0;
          padding: 0;
        }

        .shell-content .hero {
          margin-top: 0;
        }
      `}</style>
    </div>
  )
}
