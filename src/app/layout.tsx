import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Item Researcher - Appliance & Electronics Lookup",
  description:
    "Research appliances and electronics. Get specifications, estimated age, original pricing, and current replacement costs from major retailers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
