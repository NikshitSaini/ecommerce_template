import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, ShieldCheck, Headphones, Palette } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  // Furnear Branding Palette
  const colors = {
    accent: '#B58D67', // Warm Oak
    accentLight: '#F3EDE7',
    bg: '#F9F8F6',     // Linen White
    white: '#ffffff',
    textMain: '#2D2D2D', // Charcoal
    textMuted: '#757575',
    border: '#EBE9E4',
    success: '#4F7942'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: colors.bg }}>

      {/* HERO — Refined Furniture Support */}
      <section style={{ position: 'relative', overflow: 'hidden', backgroundColor: colors.accentLight }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: `radial-gradient(circle at top right, rgba(181, 141, 103, 0.12), transparent 70%)` 
        }} />

        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '5rem 2rem', position: 'relative', textAlign: 'center' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.4rem 1rem', borderRadius: '100px',
            backgroundColor: colors.white, fontSize: '0.75rem',
            fontWeight: '700', marginBottom: '1.5rem', color: colors.accent,
            boxShadow: '0 4px 10px rgba(0,0,0,0.03)', border: `1px solid ${colors.border}`
          }}>
            <Palette size={14} />
            Interior Design Consultants Available
          </span>

          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '800', 
            color: colors.textMain, marginBottom: '1rem', fontFamily: 'serif' 
          }}>
            Let's Talk About <span style={{ color: colors.accent }}>Your Home</span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: colors.textMuted, lineHeight: '1.7' }}>
            Whether you need help choosing the right fabric, tracking an artisan-crafted 
            delivery, or assembly support — our team is here to assist.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', mt: '2rem', fontSize: '0.75rem', color: colors.textMuted }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={14} style={{ color: colors.accent }} />
              White-Glove Guarantee
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={14} style={{ color: colors.accent }} />
              24hr Design Response
            </span>
          </div>
        </div>
      </section>

      {/* MAIN SECTION */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>

          {/* CONTACT INFO CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { icon: Phone, title: 'Call Our Studio', detail: '+91 98182 67167', sub: 'Mon–Fri, 9am–6pm IST' },
              { icon: Mail, title: 'Email Design Support', detail: 'hello@furnear.com', sub: 'Artisan response in 24 hours' },
              { icon: MapPin, title: 'Visit our Showroom', detail: '123 Oak Lane, Pimpri-Chinchwad', sub: 'Maharashtra 411044' },
              { icon: Clock, title: 'Operating Hours', detail: 'Mon–Sat: 9am – 8pm IST', sub: 'Sunday: Closed for Crafting' },
            ].map((card, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '1.25rem',
                  backgroundColor: colors.white, borderRadius: '16px',
                  border: `1px solid ${colors.border}`, padding: '1.5rem',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  backgroundColor: colors.accentLight, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <card.icon size={20} style={{ color: colors.accent }} />
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: '700', color: colors.accent, textTransform: 'uppercase' }}>{card.title}</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: '700', color: colors.textMain }}>{card.detail}</p>
                  <p style={{ fontSize: '0.75rem', color: colors.textMuted, marginTop: '0.2rem' }}>{card.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CONTACT FORM */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{
              position: 'relative', backgroundColor: colors.white,
              borderRadius: '24px', border: `1px solid ${colors.border}`,
              padding: '3rem', boxShadow: '0 10px 40px rgba(0,0,0,0.02)'
            }}>

              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: colors.textMain, marginBottom: '2rem', fontFamily: 'serif' }}>
                Start a Conversation
              </h2>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <div style={{
                    width: '80px', height: '80px', backgroundColor: `${colors.success}15`,
                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', margin: '0 auto 1.5rem'
                  }}>
                    <Send size={32} style={{ color: colors.success }} />
                  </div>
                  <p style={{ fontSize: '1.5rem', fontWeight: '800', color: colors.textMain, marginBottom: '0.5rem' }}>
                    Sent Successfully!
                  </p>
                  <p style={{ fontSize: '0.95rem', color: colors.textMuted }}>
                    A design consultant will be in touch with you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: colors.textMain, marginBottom: '0.5rem' }}>
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nikshit"
                        style={{
                          width: '100%', padding: '0.8rem 1rem', fontSize: '0.9rem',
                          border: `1px solid ${colors.border}`, borderRadius: '10px',
                          outline: 'none', backgroundColor: colors.bg
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: colors.textMain, marginBottom: '0.5rem' }}>
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Saini"
                        style={{
                          width: '100%', padding: '0.8rem 1rem', fontSize: '0.9rem',
                          border: `1px solid ${colors.border}`, borderRadius: '10px',
                          outline: 'none', backgroundColor: colors.bg
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: colors.textMain, marginBottom: '0.5rem' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nikshit@example.com"
                      style={{
                        width: '100%', padding: '0.8rem 1rem', fontSize: '0.9rem',
                        border: `1px solid ${colors.border}`, borderRadius: '10px',
                        outline: 'none', backgroundColor: colors.bg
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: colors.textMain, marginBottom: '0.5rem' }}>
                      Reason for Inquiry
                    </label>
                    <select style={{
                      width: '100%', padding: '0.8rem 1rem', fontSize: '0.9rem',
                      border: `1px solid ${colors.border}`, borderRadius: '10px',
                      outline: 'none', backgroundColor: colors.bg
                    }}>
                      <option>Product Question</option>
                      <option>Delivery Tracking</option>
                      <option>Interior Design Consultation</option>
                      <option>Assembly Support</option>
                      <option>Bulk Project Orders</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: colors.textMain, marginBottom: '0.5rem' }}>
                      Your Message
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Tell us about your space..."
                      style={{
                        width: '100%', padding: '0.8rem 1rem', fontSize: '0.9rem',
                        border: `1px solid ${colors.border}`, borderRadius: '10px',
                        outline: 'none', backgroundColor: colors.bg, resize: 'none'
                      }}
                    />
                  </div>

                  <button 
                    type="submit" 
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '0.75rem', padding: '1rem', backgroundColor: colors.accent,
                      color: colors.white, fontWeight: '800', borderRadius: '12px',
                      border: 'none', cursor: 'pointer', boxShadow: '0 10px 20px rgba(181, 141, 103, 0.2)'
                    }}
                  >
                    <Send size={18} />
                    Send Message
                  </button>

                  <p style={{ fontSize: '0.7rem', color: colors.textMuted, textAlign: 'center', marginTop: '1rem' }}>
                    Your design inspiration is safe with us. We never share your personal information.
                  </p>

                </form>
              )}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}