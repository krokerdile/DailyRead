import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "DailyRead",
  description: "Email-first developer reading feed"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ fontFamily: "sans-serif", margin: 0, padding: "2rem" }}>
        {children}
      </body>
    </html>
  );
}
