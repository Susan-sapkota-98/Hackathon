import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Smart Hospital Electrical Dashboard",
  description: "Real-time monitoring of 3-phase power system",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
