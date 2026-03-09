import React from 'react';
import DashboardShell from '../components/dashboard-shell';

export const metadata = {
  title: 'Sales Dashboard',
  description: 'Ver ventas por región',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
