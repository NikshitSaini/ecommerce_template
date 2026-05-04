import { Shield, Users, Award, Heart, Truck, Clock, CheckCircle, PenTool, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  // Furnear Branding Palette
  const colors = {
    accent: '#B58D67', // Warm Oak
    accentLight: '#F3EDE7',
    bg: '#F9F8F6',     // Linen White
    white: '#ffffff',
    textMain: '#2D2D2D', // Charcoal
    textMuted: '#757575',
    border: '#EBE9E4'
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: colors.bg }}>

      {/* HERO SECTION — Furnear Lifestyle */}
      <section style={{ position: 'relative', overflow: 'hidden', backgroundColor: colors.accentLight }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: `radial-gradient(circle at top left, rgba(181, 141, 103, 0.15), transparent 70%)` 
        }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>

            <div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.4rem 1rem', borderRadius: '100px',
                backgroundColor: colors.white, fontSize: '0.75rem',
                fontWeight: '700', marginBottom: '1.5rem', color: colors.accent,
                boxShadow: '0 4px 10px rgba(0,0,0,0.03)', border: `1px solid ${colors.border}`
              }}>
                <Award size={14} />
                Artisanal Excellence Since 2016
              </span>

              <h1 style={{ 
                fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '800', 
                color: colors.textMain, marginBottom: '1.5rem', lineHeight: '1.1',
                fontFamily: 'serif'
              }}>
                The Heart of <br /><span style={{ color: colors.accent }}>Furnear</span>
              </h1>

              <p style={{ fontSize: '1.1rem', color: colors.textMuted, lineHeight: '1.8', marginBottom: '2rem' }}>
                We believe a home is more than a place—it’s a collection of stories. 
                Our mission is to provide thoughtfully designed, high-quality furniture 
                that brings comfort and character to your daily life.
              </p>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/products" style={{ 
                  padding: '1rem 2rem', backgroundColor: colors.accent, color: colors.white, 
                  fontWeight: '700', borderRadius: '8px', textDecoration: 'none',
                  boxShadow: '0 10px 20px rgba(181, 141, 103, 0.2)'
                }}>
                  Explore Collections
                </Link>
                <Link to="/contact" style={{ 
                  padding: '1rem 2rem', backgroundColor: colors.white, color: colors.textMain, 
                  fontWeight: '700', borderRadius: '8px', textDecoration: 'none',
                  border: `1px solid ${colors.border}`
                }}>
                  Meet Our Designers
                </Link>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ 
                borderRadius: '24px', overflow: 'hidden', 
                boxShadow: '0 30px 60px rgba(0,0,0,0.08)',
                border: `8px solid ${colors.white}`
              }}>
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1024&q=80"
                  alt="Modern interior design"
                  style={{ width: '100%', height: '500px', objectFit: 'cover' }}
                />
              </div>

              <div style={{ 
                position: 'absolute', bottom: '20px', left: '-20px', 
                backgroundColor: colors.textMain, color: colors.white, 
                padding: '1.5rem', borderRadius: '12px', boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
              }}>
                <p style={{ fontSize: '1.5rem', fontWeight: '800' }}>15,000+</p>
                <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>Homes Transformed</p>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* STATS SECTION — Earthy Accents */}
      <section style={{ backgroundColor: colors.white, borderY: `1px solid ${colors.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {[
              { number: "100%", label: "Solid Wood" },
              { number: "4.9★", label: "Customer Love" },
              { number: "Fast", label: "White-Glove Delivery" },
              { number: "10 Years", label: "Quality Warranty" },
            ].map((item, i) => (
              <div key={i}>
                <p style={{ fontSize: '2rem', fontBold: '800', color: colors.accent }}>{item.number}</p>
                <p style={{ fontSize: '0.85rem', color: colors.textMuted, marginTop: '0.25rem', fontWeight: '600' }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* VALUES SECTION — Furniture Mastery */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: colors.textMain, marginBottom: '1rem', fontFamily: 'serif' }}>
            Our Design Philosophy
          </h2>
          <p style={{ color: colors.textMuted, maxWidth: '600px', margin: '0 auto' }}>
            We marry traditional woodworking techniques with modern ergonomics to create pieces that look as good as they feel.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {[
            { icon: PenTool, title: 'Bespoke Craftsmanship', desc: 'Every joint and finish is hand-inspected by master carpenters.' },
            { icon: Leaf, title: 'Sustainably Sourced', desc: 'We only use FSC-certified hardwoods and eco-friendly finishes.' },
            { icon: Truck, title: 'Safe Room Delivery', desc: 'Our team handles the heavy lifting, delivering right to your room of choice.' },
            { icon: Users, title: 'Community Focused', desc: 'Partnering with local artisans to support traditional craft communities.' },
            { icon: Shield, title: 'Built to Last', desc: 'Our furniture is designed to be passed down through generations.' },
            { icon: Heart, title: 'Custom Comfort', desc: 'Choose from hundreds of fabric and finish combinations to fit your style.' },
          ].map((item, i) => (
            <div key={i} style={{ 
              backgroundColor: colors.white, padding: '2rem', borderRadius: '16px', 
              border: `1px solid ${colors.border}`, transition: 'all 0.3s'
            }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '12px', 
                backgroundColor: colors.accentLight, display: 'flex', 
                alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' 
              }}>
                <item.icon size={22} style={{ color: colors.accent }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: colors.textMain, marginBottom: '0.75rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.9rem', color: colors.textMuted, lineHeight: '1.6' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* OUR STORY — Furnear Heritage */}
      <section style={{ backgroundColor: colors.white, padding: '6rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>

          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: colors.textMain, marginBottom: '1.5rem', fontFamily: 'serif' }}>
              From Workshop to Home
            </h2>

            <p style={{ color: colors.textMuted, lineHeight: '1.8', marginBottom: '1rem' }}>
              Furnear began in a small Pune workshop with a single goal: to stop the cycle of "disposable" furniture. We were tired of seeing beautiful spaces filled with pieces that didn't last a season.
            </p>

            <p style={{ color: colors.textMuted, lineHeight: '1.8', marginBottom: '1rem' }}>
              We spent years traveling to find the finest timber and the most skilled upholsterers. What started as a small project has grown into a community of designers and makers dedicated to quality.
            </p>

            <p style={{ color: colors.textMuted, lineHeight: '1.8', marginBottom: '2rem' }}>
              Today, Furnear stands for integrity in design. We don't just sell tables and sofas; we provide the foundation for your family dinners, late-night conversations, and quiet mornings.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: colors.accent, fontWeight: '700' }}>
              <CheckCircle size={18} />
              Ethically Manufactured
            </div>
          </div>

          <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
            <img
              src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80"
              alt="Craftsmanship workshop"
              style={{ width: '100%', height: '450px', objectFit: 'cover' }}
            />
          </div>

        </div>
      </section>


      {/* FINAL CTA SECTION — Warm Branding */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem' }}>
        <div style={{ 
          background: `linear-gradient(to right, ${colors.accent}, #8E6B4D)`, 
          borderRadius: '24px', padding: '4rem 2rem', textAlign: 'center', color: colors.white,
          position: 'relative', overflow: 'hidden'
        }}>

          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', fontFamily: 'serif' }}>
            Ready to Build Your Sanctuary?
          </h2>

          <p style={{ opacity: 0.9, maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1.1rem' }}>
            Browse our curated collections and find the pieces that resonate with your lifestyle. Quality furniture, delivered with care.
          </p>

          <Link to="/products" style={{ 
            display: 'inline-flex', padding: '1rem 3rem', backgroundColor: colors.white, 
            color: colors.accent, fontWeight: '800', borderRadius: '12px', 
            textDecoration: 'none', transition: 'transform 0.2s'
          }}>
            Shop the Collection
          </Link>

        </div>
      </section>

    </div>
  );
}