import React from 'react';

export const metadata = {
  title: 'Sales Dashboard',
  description: 'Ver ventas por región con filtros y gráficos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head />
      <body style={{ margin: 0, fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
        {children}
      </body>
    </html>
  );
}
