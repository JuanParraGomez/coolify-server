import React from "react";

export const metadata = {
  title: "Sales Dashboard",
  description: "App to view sales by region with filters and charts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, minHeight: "100vh", background: "#f3f4f6" }}>{children}</body>
    </html>
  );
}
