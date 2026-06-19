import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "DealIQ | M&A Deal Intelligence",
  description: "Model M&A financing, EPS accretion/dilution, sensitivities, and deal memos.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

