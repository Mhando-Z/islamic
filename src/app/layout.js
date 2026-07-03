import "./globals.css";
import { Amiri, Work_Sans, JetBrains_Mono } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import { DataProvider } from "@/context/DataContext";
import BottomNav from "@/components/BottomNav";
import RegisterSW from "@/components/RegisterSW";

const amiri = Amiri({
  subsets: ["latin", "arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-worksans",
  display: "swap",
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jbmono",
  display: "swap",
});

export const metadata = {
  title: "Islamic, Majina 99 ya Mwenyezi Mungu",
  description:
    "Recite, track, and study the 99 Names of Allah — bilingual English/Swahili.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0F2E30",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${amiri.variable} ${workSans.variable} ${jbMono.variable}`}
    >
      <body className="font-body text-parchment min-h-screen">
        <DataProvider>
          <AppProvider>
            <div className="mx-auto max-w-md min-h-screen flex flex-col relative">
              <RegisterSW />
              <main className="flex-1 pb-24">{children}</main>
              <BottomNav />
            </div>
          </AppProvider>
        </DataProvider>
      </body>
    </html>
  );
}
