import "@/styles/globals.css";
import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Dogão do Pastor",
  description: "Sistema de gestão - Dogão do Pastor, projeto ta Igreja Viva em Células, sistema esenvolvido por JS Soluções e Serviços",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt_br" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
