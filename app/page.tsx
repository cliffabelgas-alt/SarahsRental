import Link from 'next/link';

const featured = ['Ivory Lace Ball Gown', 'Midnight Satin Mermaid', 'Blush Tulle A-line'];
const steps = ['Send an inquiry', 'Book a fitting', 'Reserve and pay', 'Alterations', 'Pick up', 'Wear it', 'Return'];
const occasions = ['Weddings', 'Debuts', 'Proms', 'Pageants', 'Formal events'];

export default function Home() {
  return (
    <>
      <section className="wrap hero">
        <div>
          <h1>Find the gown for your big day.</h1>
          <p>Elegant gowns for weddings, debuts and proms, fitted to you and ready when you are. Browse the collection, then book a fitting.</p>
          <div className="actions">
            <Link className="btn" href="/inquiry">Ask about a gown</Link>
            <Link className="btn alt" href="/inventory">View collection</Link>
          </div>
        </div>
        <div className="ph" role="img" aria-label="Hero photo placeholder">Hero photo: model in signature gown</div>
      </section>

      <section className="wrap">
        <h2>Featured gowns</h2>
        <div className="grid3">
          {featured.map((n) => (
            <article className="card" key={n}>
              <div className="ph">Gown photo</div>
              <h3>{n}</h3>
              <Link href="/inquiry">Check availability</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <h2>How renting works</h2>
          <ol className="steps">{steps.map((s) => <li key={s}>{s}</li>)}</ol>
        </div>
      </section>

      <section className="wrap">
        <h2>Shop by occasion</h2>
        <div className="grid3">
          {occasions.map((o) => <div className="ph" style={{ aspectRatio: '2/1' }} key={o}>{o}</div>)}
        </div>
      </section>

      <section className="band">
        <div className="wrap hero">
          <div>
            <h2>Visit the shop</h2>
            <p className="muted">Purok-5, JP Luarel Sorsogon, opening hours 8:00 AM to 8:00 PM and contact details go here. Walk-ins welcome; fittings by appointment.</p>
          </div>
          <div className="actions"><Link className="btn" href="/inquiry">Book a fitting</Link></div>
        </div>
      </section>
    </>
  );
}
