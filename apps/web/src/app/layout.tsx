import type { Metadata, Viewport } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'RAKSHA — Hazard-Based Relocation Decision Support',
    template: '%s · RAKSHA',
  },
  description:
    'RAKSHA is a GIS-enabled decision-support prototype for hazard-based red zone identification, carrying-capacity assessment and relocation prioritisation. Smart India Hackathon 2026 (SIH26191).',
  applicationName: 'RAKSHA',
};

export const viewport: Viewport = {
  themeColor: '#020b14',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
