import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leave & License Agreement Builder",
  description: "Create, preview, share, and download a Leave & License Agreement."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
