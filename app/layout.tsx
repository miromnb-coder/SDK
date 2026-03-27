import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Halo SDK Platform",
  description: "A premium Halo-style SDK simulator and demo platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi">
      <body>{children}</body>
    </html>
  );
}
