import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Code Snippet Platform",
  description: "Share and discover code snippets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
