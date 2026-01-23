import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '@/lib/config'; // Initialize API client

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Electrik Store - Admin",
  description: "Admin Panel",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={geist.className}>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
