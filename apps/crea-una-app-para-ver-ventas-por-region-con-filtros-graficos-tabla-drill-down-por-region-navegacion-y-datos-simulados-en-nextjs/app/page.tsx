import DashboardShell from '../components/dashboard-shell'
import SalesDashboard from '../components/sales-dashboard'

export default function Page() {
  return (
    <DashboardShell>
      <SalesDashboard />
    </DashboardShell>
  )
}
