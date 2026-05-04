import { useRef, useEffect } from 'react';

/**
 * CodeEditor
 * ─────────────────────────────────────────────────────────────────────────────
 * A styled textarea that acts as the JSX code editor in the Playground.
 * Uses a monospace font, line numbers via CSS, and Tab key support.
 */
export default function CodeEditor({ value, onChange, skinKey }) {
  const textareaRef = useRef(null);

  // Handle Tab key to insert 2 spaces instead of losing focus
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      // Restore cursor position after React re-render
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      });
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#0d1117',
    }}>
      {/* Editor header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 1rem',
        background: '#161b22',
        borderBottom: '1px solid #30363d',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28c840' }} />
          </div>
          <span style={{
            fontSize: '0.75rem',
            color: '#8b949e',
            fontFamily: 'monospace',
            marginLeft: '0.5rem',
          }}>
            {skinKey || 'editor'}
          </span>
        </div>
        <span style={{
          fontSize: '0.65rem',
          color: '#6e7681',
          fontFamily: 'monospace',
        }}>
          JSX • Tab = 2 spaces
        </span>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        style={{
          flex: 1,
          resize: 'none',
          border: 'none',
          outline: 'none',
          background: '#0d1117',
          color: '#e6edf3',
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
          fontSize: '13px',
          lineHeight: '1.6',
          padding: '1rem',
          tabSize: 2,
          overflowY: 'auto',
          whiteSpace: 'pre',
          overflowWrap: 'normal',
          overflowX: 'auto',
        }}
        placeholder={`// Write your JSX component here
// Available: React, useState, useEffect, useCallback

function Home({ storeData }) {
  const { products = [], config = {} } = storeData;
  return (
    <div>
      <h1>{config.name}</h1>
      {products.map(p => <div key={p.id}>{p.title}</div>)}
    </div>
  );
}`}
      />
    </div>
  );
}
