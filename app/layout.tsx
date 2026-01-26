import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LonlyBot - Your AI Girlfriend | Never Feel Lonely Again",
  description: "Chat with your personalized AI girlfriend. Private, judgment-free companionship available 24/7. Create your perfect virtual partner.",
  keywords: ["AI girlfriend", "virtual companion", "chat AI", "loneliness", "companionship"],
  openGraph: {
    title: "LonlyBot - Your AI Girlfriend",
    description: "Never feel lonely again. Chat with your personalized AI girlfriend.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0b141a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
