import type { Metadata } from "next";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agenda & Directorio",
  description: "Agenda de citas y directorio telefónico para consultorios y negocios de servicio",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gradient-to-br from-teal-50 via-white to-teal-100 text-slate-900 overflow-x-hidden">
        <div className="fixed bottom-0 right-0 -z-10 pointer-events-none select-none" aria-hidden>
          <Image
            src="/logo-icon.png"
            alt=""
            width={520}
            height={683}
            className="w-[280px] sm:w-[380px] md:w-[480px] h-auto mix-blend-multiply opacity-20"
          />
        </div>
        <Nav />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
