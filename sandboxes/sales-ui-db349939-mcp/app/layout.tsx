export const metadata = {
  title: 'Sales Dashboard',
  description: 'Dashboard para ver ventas por región',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head />
      <body style={{ margin: 0, fontFamily: 'Inter, Arial, sans-serif', background: '#f6f8fa' }}>
        {children}
      </body>
    </html>
  );
}
