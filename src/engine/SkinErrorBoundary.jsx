import React from 'react';

/**
 * SkinErrorBoundary
 * ─────────────────────────────────────────────────────────────────────────────
 * Wraps dynamically compiled skin components. If a skin has a bug and throws
 * during render, this catches it and shows a user-friendly error instead of
 * crashing the entire app.
 */
export class SkinErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[SkinErrorBoundary] Skin render failed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'Inter, monospace',
          textAlign: 'center',
          background: '#111827',
          color: '#f9fafb',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ color: '#ef4444', margin: '0 0 0.5rem' }}>Skin Render Error</h2>
          <p style={{ color: '#9ca3af', maxWidth: '500px', marginBottom: '1.5rem' }}>
            The active skin for this page has a bug. Please fix it in the Playground.
          </p>
          <pre style={{
            background: '#1f2937',
            padding: '1rem',
            borderRadius: '0.5rem',
            fontSize: '0.75rem',
            color: '#f87171',
            maxWidth: '600px',
            overflow: 'auto',
            textAlign: 'left',
          }}>
            {this.state.error?.message}
          </pre>
          {this.props.isOwner && (
            <a
              href="/playground"
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem 2rem',
                background: '#7c3aed',
                color: 'white',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600',
              }}
            >
              Open Playground to Fix →
            </a>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
