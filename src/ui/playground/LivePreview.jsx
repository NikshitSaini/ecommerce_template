import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SkinErrorBoundary } from '../../engine/SkinErrorBoundary';
import { skinRegistry } from '../../engine/skinRegistry';

/**
 * LivePreview
 * ─────────────────────────────────────────────────────────────────────────────
 * Compiles the JSX string and renders the result in real-time.
 * Debounces compilation to 600ms to avoid thrashing on every keystroke.
 */
export default function LivePreview({ jsxString, skinKey, storeData }) {
  const [DynamicComponent, setDynamicComponent] = useState(null);
  const [compileError, setCompileError] = useState(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const babelRef = useRef(null);
  const debounceRef = useRef(null);

  const compile = useCallback(async (code) => {
    if (!code?.trim()) {
      setDynamicComponent(null);
      setCompileError(null);
      return;
    }

    setIsCompiling(true);
    try {
      // Lazy-load Babel once
      if (!babelRef.current) {
        await new Promise((resolve, reject) => {
          if (window.Babel) { babelRef.current = window.Babel; resolve(); return; }
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/@babel/standalone/babel.min.js';
          script.onload = () => { babelRef.current = window.Babel; resolve(); };
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      const Babel = babelRef.current;

      // Strip all import statements from the code before transpilation
      let codeWithoutImports = code.replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, '');
      
      // Strip export declarations (new Function doesn't allow ES exports)
      codeWithoutImports = codeWithoutImports.replace(/export\s+default\s+/g, '');
      codeWithoutImports = codeWithoutImports.replace(/export\s+/g, '');

      // Transpile JSX → plain JS
      const result = Babel.transform(codeWithoutImports, {
        presets: ['react'],
        filename: 'preview.jsx',
      });

      // We dynamically inject all dependencies from our skinRegistry
      const registryKeys = Object.keys(skinRegistry);
      const registryValues = Object.values(skinRegistry);

      // eslint-disable-next-line no-new-func
      const factory = new Function(
        ...registryKeys,
        `
        ${result.code}
        const __component__ = (
          typeof Home === 'function' ? Home :
          typeof ProductListingPage === 'function' ? ProductListingPage :
          typeof ProductListing === 'function' ? ProductListing :
          typeof ProductDetailPage === 'function' ? ProductDetailPage :
          typeof AboutPage === 'function' ? AboutPage :
          typeof ContactPage === 'function' ? ContactPage :
          typeof CartPage === 'function' ? CartPage :
          typeof CheckoutPage === 'function' ? CheckoutPage :
          typeof ProfilePage === 'function' ? ProfilePage :
          typeof PublicHeader === 'function' ? PublicHeader :
          typeof Header === 'function' ? Header :
          typeof Footer === 'function' ? Footer :
          typeof Skin === 'function' ? Skin :
          null
        );
        return __component__;
        `
      );

      const Component = factory(...registryValues);
      if (typeof Component !== 'function') throw new Error('No valid component found. Name it Home, ProductListing, Header, Footer, or Skin.');

      setDynamicComponent(() => Component);
      setCompileError(null);
    } catch (err) {
      setCompileError(err.message);
      setDynamicComponent(null);
    } finally {
      setIsCompiling(false);
    }
  }, [skinKey]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => compile(jsxString), 600);
    return () => clearTimeout(debounceRef.current);
  }, [jsxString, compile]);

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      position: 'relative',
    }}>
      {/* Preview toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 1rem',
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
          📱 Live Preview
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isCompiling && (
            <span style={{ fontSize: '0.7rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{
                display: 'inline-block',
                width: '8px', height: '8px',
                borderRadius: '50%',
                border: '2px solid #f59e0b',
                borderTop: '2px solid transparent',
                animation: 'spin 0.6s linear infinite',
              }} />
              Compiling…
            </span>
          )}
          {!isCompiling && !compileError && DynamicComponent && (
            <span style={{ fontSize: '0.7rem', color: '#10b981' }}>✓ Ready</span>
          )}
          {compileError && (
            <span style={{ fontSize: '0.7rem', color: '#ef4444' }}>✗ Error</span>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Preview content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {compileError ? (
          <div style={{
            padding: '2rem',
            background: '#fff1f2',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
          }}>
            <div style={{ fontSize: '2rem' }}>❌</div>
            <h3 style={{ color: '#dc2626', margin: 0, textAlign: 'center' }}>Compile Error</h3>
            <pre style={{
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              color: '#b91c1c',
              maxWidth: '500px',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
            }}>
              {compileError}
            </pre>
          </div>
        ) : !jsxString?.trim() ? (
          <div style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '1rem',
            color: '#94a3b8',
          }}>
            <div style={{ fontSize: '3rem' }}>✏️</div>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Start typing JSX to see the preview</p>
          </div>
        ) : DynamicComponent ? (
          <SkinErrorBoundary>
            <DynamicComponent storeData={storeData || {}} />
          </SkinErrorBoundary>
        ) : null}
      </div>
    </div>
  );
}
