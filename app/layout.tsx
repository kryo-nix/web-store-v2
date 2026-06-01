import type { Metadata } from "next";
import "./globals.css";
import { getSiteSettings } from "@/lib/settings";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Chatbot from "@/components/public/Chatbot";
import FloatingContacts from "@/components/public/FloatingContacts";

export const metadata: Metadata = {
  title: "Digital Store",
  description: "Premium Digital Products",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className="dark">
      <body 
        className={`min-h-screen ${settings.wallpaperType === 'image' ? 'bg-dynamic-wallpaper' : ''}`}
        style={{ 
          backgroundImage: settings.wallpaperType === 'image' ? `url(${settings.wallpaper})` : 
                           settings.wallpaperType === 'gradient' ? settings.wallpaper : 'none',
          backgroundColor: settings.wallpaperType === 'color' ? settings.wallpaper : 'transparent',
        }}
      >
        <Navbar settings={settings} />
        <main className="flex-grow">{children}</main>
        <Footer settings={settings} />
        <Chatbot isActive={settings.chatbotActive} />
        <FloatingContacts settings={settings} />
      </body>
    </html>
  );
}
