import './globals.css';
export const metadata = { title: 'ProcureLink', description: 'Direct & Indirect Procurement Portal' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
