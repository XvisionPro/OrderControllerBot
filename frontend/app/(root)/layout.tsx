import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Topbar from "@/components/shared/Topbar";
import Leftsidebar from "@/components/shared/Leftsidebar";
import Rightsidebar from "@/components/shared/Rightsidebar";
import Bottombar from "@/components/shared/Bottombar";
import { SITE_NAME } from "@/constants/seo.constants";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
 title: {
  default: SITE_NAME,
  template: `%s | ${SITE_NAME}`,
 },
 description: 'Description of the website',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Topbar />
        <main>
          <Leftsidebar />

          <section className="main-conatiner">
            <div className="w-full max-w-4x1">
              {children}
            </div>
          </section>

          <Rightsidebar />
        </main>
        <Bottombar />
      </body>
    </html>
  );
}
