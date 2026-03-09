import React from "react";

export const metadata = {
  title: "Ventas - Dashboard",
  description: "Dashboard de ventas por región",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head />
      <body>
        {children}
        <style jsx global>{`
          html,body,#root{height:100%;}
          body{margin:0;background:#f7f7fb;color:#0f172a;font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;}
          a{color:inherit}
        `}</style>
      </body>
    </html>
  );
}
