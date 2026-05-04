import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { SkinErrorBoundary } from './SkinErrorBoundary';
import { skinRegistry } from './skinRegistry';

/**
 * DynamicSkinRenderer
 * ─────────────────────────────────────────────────────────────────────────────
 * Takes a skin key (e.g. "Home.jsx"), compiles the JSX string from Firestore
 * using @babel/standalone in the browser, and renders the resulting component.
 *
 * Props:
 *   skinKey     — which skin to render: "Home.jsx" | "ProductListing.jsx" | etc.
 *   storeData   — data object passed into the skin as props
 *   FallbackComponent — static component to render if no skin exists for this key
 */
export default function DynamicSkinRenderer({ skinKey, storeData, FallbackComponent }) {
  const { activeSkin, storeId } = useStore();
  const { isStoreOwner } = useAuth();
  const [DynamicComponent, setDynamicComponent] = useState(null);
  const [compileError, setCompileError] = useState(null);
  const babelRef = useRef(null);

  const compileSkin = useCallback(async (jsxString) => {
    try {
      // Lazy-load @babel/standalone only when needed
      if (!babelRef.current) {
        const Babel = await import(/* @vite-ignore */ 'https://unpkg.com/@babel/standalone/babel.min.js');
        // unpkg adds Babel to window.Babel
        babelRef.current = window.Babel;
      }

      const Babel = babelRef.current;

      // Strip all import statements from the code before transpilation
      let codeToTranspile = jsxString.replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, '');
      
      // Strip export statements so they don't cause syntax errors in Babel / new Function
      codeToTranspile = codeToTranspile.replace(/export\s+default\s+/g, '');
      codeToTranspile = codeToTranspile.replace(/export\s+/g, '');

      // Transpile JSX → plain JS
      const result = Babel.transform(codeToTranspile, {
        presets: ['react'],
        filename: skinKey,
      });

      const transpiledCode = result.code;

      // Build the component factory
      // We dynamically inject all dependencies from our skinRegistry
      const registryKeys = Object.keys(skinRegistry);
      const registryValues = Object.values(skinRegistry);

      // eslint-disable-next-line no-new-func
      const factory = new Function(
        ...registryKeys,
        `
        ${transpiledCode}
        // The skin file must declare a function with one of these names:
        const __component__ = (
          typeof Home === 'function' ? Home :
          typeof ProductListingPage === 'function' ? ProductListingPage :
          typeof ProductListing === 'function' ? ProductListing :
          typeof ProductDetailPage === 'function' ? ProductDetailPage :
          typeof ProductDetails === 'function' ? ProductDetails :
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

      if (typeof Component !== 'function') {
        throw new Error(
          `Skin "${skinKey}" must export a function component named Home, ProductListing, Header, Footer, or Skin.`
        );
      }

      setCompileError(null);
      setDynamicComponent(() => Component);

    } catch (err) {
      console.error(`[DynamicSkinRenderer] Compile error in "${skinKey}":`, err);
      setCompileError(err.message);
      setDynamicComponent(null);
    }
  }, [skinKey]);

  useEffect(() => {
    const jsxString = activeSkin?.[skinKey];
    if (!jsxString) {
      setDynamicComponent(null);
      return;
    }
    compileSkin(jsxString);
  }, [skinKey, activeSkin, compileSkin]);

  // ── No skin defined → render fallback ─────────────────────────────────────
  if (!activeSkin?.[skinKey]) {
    if (FallbackComponent) return <FallbackComponent />;
    return null;
  }

  // ── Compile error ──────────────────────────────────────────────────────────
  if (compileError) {
    return (
      <div style={{
        padding: '2rem',
        background: '#111827',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, monospace',
        color: '#f9fafb',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem' }}>🔧</div>
        <h2 style={{ color: '#ef4444' }}>Skin Compile Error — {skinKey}</h2>
        <pre style={{
          background: '#1f2937',
          padding: '1rem',
          borderRadius: '0.5rem',
          fontSize: '0.75rem',
          color: '#f87171',
          maxWidth: '700px',
          overflow: 'auto',
          textAlign: 'left',
        }}>
          {compileError}
        </pre>
        {isStoreOwner && (
          <a href="/playground" style={{
            marginTop: '1.5rem',
            padding: '0.75rem 2rem',
            background: '#7c3aed',
            color: 'white',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600',
          }}>
            Fix in Playground →
          </a>
        )}
      </div>
    );
  }

  // ── Compiling… ─────────────────────────────────────────────────────────────
  if (!DynamicComponent) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        background: '#0f0f0f',
        color: '#888',
        fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{
          width: '40px', height: '40px',
          border: '3px solid #333',
          borderTop: '3px solid #764ba2',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ fontSize: '0.875rem' }}>Compiling skin…</span>
      </div>
    );
  }

  // ── Render the compiled component ─────────────────────────────────────────
  return (
    <SkinErrorBoundary isOwner={isStoreOwner}>
      <DynamicComponent storeData={storeData || {}} />
    </SkinErrorBoundary>
  );
}
