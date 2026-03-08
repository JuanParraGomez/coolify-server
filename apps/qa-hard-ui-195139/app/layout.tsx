import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Analytics Comercial | Gerencia Regional",
  description:
    "Dashboard comercial por region con KPIs, filtros avanzados y comparativas trimestrales.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
