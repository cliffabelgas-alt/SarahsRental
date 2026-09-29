import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import { StoreProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: "Sarah's Gown Rental",
  description: 'Gowns for weddings, debuts and proms. Reserve a fitting today.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Nav />
          <main>{children}</main>
          <footer className="foot">Sarah&rsquo;s Gown Rental &middot; Fittings by appointment</footer>
        </StoreProvider>
      </body>
    </html>
  );
}
