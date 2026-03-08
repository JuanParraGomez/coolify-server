import DashboardShell from '../components/dashboard-shell'

export default function Page() {
  return (
    <main className="page-shell">
      <DashboardShell />
      <style jsx>{`
        .page-shell {
          width: 100%;
          display: flex;
          justify-content: center;
        }
      `}</style>
    </main>
  )
}
