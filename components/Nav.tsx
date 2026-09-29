import Link from 'next/link';

export default function Nav() {
  return (
    <header className="nav">
      <Link href="/" className="brand">Sarah&rsquo;s Gown Rental</Link>
      <nav>
        <Link href="/inventory">Inventory</Link>
        <Link href="/inquiry">Inquiry</Link>
        <Link href="/rentals">Rentals</Link>
      </nav>
    </header>
  );
}
