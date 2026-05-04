import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { useStoreProducts } from '../../hooks/useStoreProducts';
import SkinSelector from './SkinSelector';
import CodeEditor from './CodeEditor';
import LivePreview from './LivePreview';
import { defaultSkins } from './skinDefaults';

/**
 * SkinPlayground
 * ─────────────────────────────────────────────────────────────────────────────
 * The per-client UI editor. Store owners can edit any skin slot's JSX here
 * and see a live preview. Saving writes directly to Firestore.
 */
export default function SkinPlayground() {
  const { storeId, storeName, activeSkin, refreshSkin } = useStore();
  const { user } = useAuth();
  const { products } = useStoreProducts();

  const [selectedKey, setSelectedKey] = useState('Home.jsx');
  const [editorCode, setEditorCode] = useState('');
  const [isSaving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'saved' | 'error' | null
  const [isDirty, setIsDirty] = useState(false);
  const [layoutMode, setLayoutMode] = useState('split'); // 'split' | 'code' | 'preview'

  // Load the current skin into the editor when slot changes
  useEffect(() => {
    const current = activeSkin?.[selectedKey] || defaultSkins[selectedKey] || '';
    setEditorCode(current);
    setIsDirty(false);
  }, [selectedKey]); // Only trigger when selecting a new tab, not on every activeSkin change

  const handleCodeChange = (newCode) => {
    setEditorCode(newCode);
    setIsDirty(true);
    setSaveStatus(null);
  };

  const handleSave = async () => {
    if (!storeId || !isDirty) return;
    setSaving(true);
    setSaveStatus(null);
    try {
      await updateDoc(doc(db, 'stores', storeId), {
        activeSkin: {
          ...activeSkin,
          [selectedKey]: editorCode
        },
        updatedAt: new Date().toISOString(),
      });
      await refreshSkin();
      setIsDirty(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error('[Playground] Save failed:', err);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const current = activeSkin?.[selectedKey] || defaultSkins[selectedKey] || '';
    setEditorCode(current);
    setIsDirty(false);
  };

  // Keyboard shortcut: Ctrl+S / Cmd+S to save
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [editorCode, storeId, isDirty]);

  const storeDataForPreview = {
    products,
    config: { name: storeName },
  };

  const skinStatus = Object.fromEntries(
    Object.keys(activeSkin || {}).map(k => [k, true])
  );

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#0d1117',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden',
    }}>
      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        height: '56px',
        background: '#161b22',
        borderBottom: '1px solid #30363d',
        flexShrink: 0,
        gap: '1rem',
      }}>
        {/* Left: Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="/admin" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#8b949e',
            textDecoration: 'none',
            fontSize: '0.875rem',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#e6edf3'}
          onMouseLeave={e => e.currentTarget.style.color = '#8b949e'}>
            ← Admin
          </a>
          <div style={{ width: '1px', height: '20px', background: '#30363d' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1rem' }}>🎨</span>
            <span style={{ color: '#e6edf3', fontWeight: '700', fontSize: '0.9rem' }}>
              Skin Playground
            </span>
            <span style={{
              padding: '0.2rem 0.6rem',
              background: 'rgba(124, 58, 237, 0.2)',
              color: '#a78bfa',
              borderRadius: '2rem',
              fontSize: '0.7rem',
              fontWeight: '600',
            }}>
              {storeName}
            </span>
          </div>
        </div>

        {/* Center: Layout toggle */}
        <div style={{ display: 'flex', background: '#0d1117', borderRadius: '0.5rem', padding: '2px', gap: '2px' }}>
          {[
            { mode: 'code', label: '⌨️ Code' },
            { mode: 'split', label: '⬛ Split' },
            { mode: 'preview', label: '👁 Preview' },
          ].map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => setLayoutMode(mode)}
              style={{
                padding: '0.3rem 0.75rem',
                border: 'none',
                borderRadius: '0.35rem',
                background: layoutMode === mode ? '#21262d' : 'transparent',
                color: layoutMode === mode ? '#e6edf3' : '#8b949e',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isDirty && (
            <button
              onClick={handleReset}
              style={{
                padding: '0.4rem 1rem',
                border: '1px solid #30363d',
                borderRadius: '0.375rem',
                background: 'transparent',
                color: '#8b949e',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
          )}
          {saveStatus === 'saved' && (
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600' }}>
              ✓ Saved!
            </span>
          )}
          {saveStatus === 'error' && (
            <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>
              ✗ Save failed
            </span>
          )}
          {isDirty && (
            <div style={{
              width: '8px', height: '8px',
              borderRadius: '50%',
              background: '#f59e0b',
              flexShrink: 0,
            }} title="Unsaved changes" />
          )}
          <button
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            style={{
              padding: '0.4rem 1.25rem',
              border: 'none',
              borderRadius: '0.375rem',
              background: isSaving || !isDirty ? '#21262d' : 'linear-gradient(135deg, #7c3aed, #5b21b6)',
              color: isSaving || !isDirty ? '#6e7681' : 'white',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: isSaving || !isDirty ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
              minWidth: '80px',
            }}
          >
            {isSaving ? 'Saving…' : '💾 Save'}
          </button>
        </div>
      </div>

      {/* ── Main Body ────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{
          width: '220px',
          background: '#161b22',
          borderRight: '1px solid #30363d',
          overflow: 'auto',
          flexShrink: 0,
        }}>
          <SkinSelector
            selected={selectedKey}
            onChange={setSelectedKey}
            skinStatus={skinStatus}
          />

          {/* Info box */}
          <div style={{
            margin: '0.5rem 1rem',
            padding: '0.75rem',
            background: 'rgba(124, 58, 237, 0.1)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            borderRadius: '0.5rem',
          }}>
            <p style={{ margin: '0 0 0.4rem', fontSize: '0.7rem', fontWeight: '700', color: '#a78bfa' }}>
              💡 Tips
            </p>
            <ul style={{ margin: 0, paddingLeft: '1rem', color: '#8b949e', fontSize: '0.7rem', lineHeight: 1.6 }}>
              <li>Ctrl+S to save</li>
              <li>Use <code style={{ color: '#a78bfa' }}>storeData.products</code></li>
              <li>Use <code style={{ color: '#a78bfa' }}>storeData.config</code></li>
              <li>React, useState, useEffect available</li>
            </ul>
          </div>
        </div>

        {/* Code + Preview panels */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Code panel */}
          {(layoutMode === 'code' || layoutMode === 'split') && (
            <div style={{
              flex: layoutMode === 'code' ? 1 : '0 0 50%',
              display: 'flex',
              flexDirection: 'column',
              borderRight: layoutMode === 'split' ? '1px solid #30363d' : 'none',
              overflow: 'hidden',
            }}>
              <CodeEditor
                value={editorCode}
                onChange={handleCodeChange}
                skinKey={selectedKey}
              />
            </div>
          )}

          {/* Preview panel */}
          {(layoutMode === 'preview' || layoutMode === 'split') && (
            <div style={{
              flex: layoutMode === 'preview' ? 1 : '0 0 50%',
              overflow: 'hidden',
            }}>
              <LivePreview
                jsxString={editorCode}
                skinKey={selectedKey}
                storeData={storeDataForPreview}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
