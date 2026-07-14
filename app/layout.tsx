import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoltCraft — DIY Energy Builds",
  description:
    "Turn TikTok and YouTube DIY energy videos into step-by-step builds with parts lists, safety checks, and claim verification.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <Link href="/" className="nav-logo">
            ⚡ Volt<span>Craft</span>
          </Link>
          <div className="nav-links">
            <Link href="/">Browse</Link>
            <Link href="/submit">Submit a Build</Link>
            <Link href="/saved">Saved &amp; Shopping List</Link>
          </div>
        </nav>
        <main className="container">{children}</main>
        <footer className="footer">
          VoltCraft catalogs community DIY energy projects. Builds involving
          electricity can be dangerous — always verify voltages, fuse your
          circuits, and never work on mains power without a qualified
          electrician. Claims of &ldquo;over-unity&rdquo; or perpetual motion
          violate the laws of thermodynamics and are flagged as myths.
        </footer>
      </body>
    </html>
  );
}
