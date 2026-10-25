import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { ThemeStyle } from "@/components/layout/theme-style";
import { getSettings } from "@/lib/api/server";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
const display = Space_Grotesk({ variable: "--font-display", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono-code", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSettings();
  return {
    title: { default: `${site.name} — ${site.tagline}`, template: `%s | ${site.name}` },
    description: site.description,
    keywords: site.keywords,
    icons: site.favicon_url ? { icon: site.favicon_url } : undefined,
    openGraph: { title: site.name, description: site.description, siteName: site.name, type: "website" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0b14" },
    { media: "(prefers-color-scheme: light)", color: "#fafaff" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { theme } = await getSettings();
  return (
    <html lang="id" suppressHydrationWarning className={`${jakarta.variable} ${display.variable} ${mono.variable} antialiased`}>
      <head>
        <ThemeStyle theme={theme} />
      </head>
      <body className="min-h-dvh">
        <AppProviders defaultTheme={theme.mode}>{children}</AppProviders>
      </body>
    </html>
  );
}
