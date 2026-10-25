import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Gown } from '@/lib/types';

export const dynamic = 'force-dynamic';

const steps = ['Send an inquiry', 'Book a fitting', 'Reserve and pay', 'Alterations', 'Pick up', 'Wear it', 'Return'];

export default async function Home() {
  const { data } = await supabase.from('gowns').select('*').order('featured', { ascending: false }).order('code').limit(12);
  const gowns = (data ?? []) as Gown[];

  return (
    <>
      <section className="wrap hero">
        <div>
          <h1>Find the gown for your big day.</h1>
          <p>Elegant gowns for weddings, debuts and proms, fitted to you and ready when you are. Browse the collection, then book a fitting.</p>
          <div className="actions">
            <Link className="btn" href="/inquiry">Ask about a gown</Link>
            <Link className="btn alt" href="#collection">View collection</Link>
          </div>
        </div>
        <div className="ph" role="img" aria-label="Hero photo placeholder">Hero photo: model in signature gown</div>
      </section>

      <section className="wrap" id="collection">
        <h2>Our collection</h2>
        {gowns.length === 0 && <p className="muted">New gowns are coming soon.</p>}
        <div className="grid3">
          {gowns.map((g) => (
            <article className="card" key={g.id}>
              {g.image_url
                // eslint-disable-next-line @next/next/no-img-element
                ? <img className="gimg" src={g.image_url} alt={g.name} />
                : <div className="ph" role="img" aria-label="No photo yet">Photo coming soon</div>}
              <h3>{g.name}</h3>
              <p className="muted">{g.occasion} &middot; Size {g.size} &middot; {g.color}</p>
              {g.description && <p>{g.description}</p>}
              <p><b>₱{Number(g.price).toLocaleString()}</b> <span className={`pill ${g.status}`}>{g.status}</span></p>
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

      <section className="band">
        <div className="wrap hero">
          <div>
            <h2>Visit the shop</h2>
            <p className="muted">Address, opening hours and contact details go here. Walk-ins welcome; fittings by appointment.</p>
          </div>
          <div className="actions"><Link className="btn" href="/inquiry">Book a fitting</Link></div>
        </div>
      </section>
    </>
  );
}
