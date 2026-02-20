import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { ViewerProvider } from "@/components/ViewerProvider";

export const metadata: Metadata = {
  title: "Lawndale Park Pet Registry",
  description:
    "Seen here. Safe here. Found faster. A neighborly board for sightings, missing pets, and familiar park regulars in Houston's Lawndale Park.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <ViewerProvider>
          <Header />
          <main className="max-w-5xl mx-auto px-4 pb-16">{children}</main>
        </ViewerProvider>
      </body>
    </html>
  );
}
