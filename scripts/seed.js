/**
 * Multi-Tenant SaaS Seed Script (firebase-admin version)
 * ─────────────────────────────────────────────────────────────────────────────
 * Uses the Firebase Admin SDK — runs with full privileges, bypasses all
 * security rules. Safe for server-side seeding only.
 *
 * ── Prerequisites ────────────────────────────────────────────────────────────
 * 1. Go to Firebase Console → Project Settings → Service Accounts
 * 2. Click "Generate new private key" → download the JSON
 * 3. Save it as: scripts/serviceAccountKey.json
 *    (already in .gitignore — NEVER commit this file)
 *
 * ── Usage ─────────────────────────────────────────────────────────────────────
 * node scripts/seed.js
 */

import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// ── Load firebase-admin ───────────────────────────────────────────────────────
const admin = require('firebase-admin');

// Load the service account key
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
} catch {
  console.error('\n❌ ERROR: Service account key not found!');
  console.error('   Expected at: scripts/serviceAccountKey.json');
  console.error('\n   Steps to get it:');
  console.error('   1. Go to https://console.firebase.google.com');
  console.error('   2. Your Project → Project Settings → Service Accounts');
  console.error('   3. Click "Generate new private key" → Save the JSON file');
  console.error('   4. Rename it to: scripts/serviceAccountKey.json\n');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const adminAuth = admin.auth();

// ─── Default Skin Templates ────────────────────────────────────────────────
const DEFAULT_HOME_SKIN = `
function Home({ storeData }) {
  const { products = [], config = {} } = storeData;
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', padding: '4rem 0', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '1rem', color: 'white', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: 0 }}>{config.name || 'Welcome to Our Store'}</h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.9, marginTop: '1rem' }}>Discover our amazing products</p>
        <a href="/products" style={{ display: 'inline-block', marginTop: '1.5rem', padding: '0.75rem 2rem', background: 'white', color: '#764ba2', borderRadius: '2rem', textDecoration: 'none', fontWeight: '700' }}>
          Shop Now
        </a>
      </div>
      <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1.5rem' }}>Featured Products</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {products.slice(0, 6).map(p => (
          <a key={p.id} href={'/product/' + p.id} style={{ textDecoration: 'none', color: 'inherit', border: '1px solid #e5e7eb', borderRadius: '0.75rem', overflow: 'hidden', display: 'block' }}>
            <img src={p.images?.[0] || 'https://placehold.co/400x300'} alt={p.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: '600' }}>{p.title}</h3>
              <p style={{ margin: 0, fontWeight: '700', color: '#764ba2' }}>{config.currency || '₹'}{p.price}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
`.trim();

const DEFAULT_LISTING_SKIN = `
function ProductListing({ storeData }) {
  const { products = [], config = {} } = storeData;
  const [search, setSearch] = React.useState('');
  const filtered = products.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem' }}>All Products</h1>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search products..."
        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', fontSize: '1rem', marginBottom: '2rem', boxSizing: 'border-box' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {filtered.map(p => (
          <a key={p.id} href={'/product/' + p.id} style={{ textDecoration: 'none', color: 'inherit', border: '1px solid #e5e7eb', borderRadius: '0.75rem', overflow: 'hidden', display: 'block' }}>
            <img src={p.images?.[0] || 'https://placehold.co/400x300'} alt={p.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            <div style={{ padding: '1rem' }}>
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem', fontWeight: '600' }}>{p.title}</h3>
              <p style={{ margin: 0, fontWeight: '700', color: '#764ba2' }}>{config.currency || '₹'}{p.price}</p>
            </div>
          </a>
        ))}
      </div>
      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: '4rem' }}>No products found.</p>
      )}
    </div>
  );
}
`.trim();

// ─── Helper: create or recover user in Firebase Auth ──────────────────────
async function createUser(email, password, displayName) {
  try {
    const user = await adminAuth.createUser({ email, password, displayName });
    console.log(`  ✅ Auth user created: ${email} (uid: ${user.uid})`);
    return user.uid;
  } catch (err) {
    if (err.code === 'auth/email-already-exists') {
      console.log(`  ℹ️  User already exists: ${email} — fetching uid...`);
      const existing = await adminAuth.getUserByEmail(email);
      return existing.uid;
    }
    throw err;
  }
}

// ─── Helper: write a doc (merges if exists) ───────────────────────────────
async function writeDoc(collectionPath, docId, data) {
  await db.collection(collectionPath).doc(docId).set(data, { merge: true });
}

// ─── Seed: Super Admin ─────────────────────────────────────────────────────
async function seedSuperAdmin() {
  console.log('\n📌 Creating Super Admin...');
  const email = 'superadmin@saasplatform.com';
  const password = 'SuperAdmin123!';
  const uid = await createUser(email, password, 'Platform Owner');

  await writeDoc('users', uid, {
    name: 'Platform Owner',
    email,
    role: 'super_admin',
    createdAt: new Date().toISOString(),
    avatar: `https://i.pravatar.cc/100?u=${uid}`,
  });
  console.log(`  ✅ Super admin Firestore doc written (users/${uid})`);
  return uid;
}

// ─── Seed: Store Owner + Store Document + Products ────────────────────────
async function seedStore({ ownerEmail, ownerPassword, ownerName, storeId, storeName, domain, currency, products }) {
  console.log(`\n🏪 Creating store: "${storeName}" (${storeId})...`);

  // 1. Create Auth user
  const ownerUid = await createUser(ownerEmail, ownerPassword, ownerName);

  // 2. Set the global users document for the owner
  // Note: Since we are moving store admins to stores/{storeId}/users,
  // we do NOT create them in the global `users` collection anymore.
  // Instead, they are created in the specific store's `users` collection.
  const batch = db.batch();
  const ownerStoreUserRef = db.collection('stores').doc(storeId).collection('users').doc(ownerUid);
  batch.set(ownerStoreUserRef, {
    name: ownerName,
    email: ownerEmail,
    role: 'admin',
    createdAt: new Date().toISOString()
  });

  console.log(`  ✅ Owner user doc written (stores/${storeId}/users/${ownerUid})`);

  // 3. Store document
  const storeRef = db.collection('stores').doc(storeId);
  const storeSnap = await storeRef.get();
  const existingData = storeSnap.exists ? storeSnap.data() : {};

  batch.set(storeRef, {
    domain,
    ownerUid,
    config: {
      name: storeName,
      currency,
      logo: existingData.config?.logo || '',
      primaryColor: existingData.config?.primaryColor || '#764ba2',
      isActive: existingData.config?.isActive !== undefined ? existingData.config.isActive : true,
    },
    activeSkin: existingData.activeSkin || {
      'Home.jsx': DEFAULT_HOME_SKIN,
      'ProductListing.jsx': DEFAULT_LISTING_SKIN,
    },
    createdAt: existingData.createdAt || new Date().toISOString(),
  });
  console.log(`  ✅ Store doc written (stores/${storeId})`);

  // 4. Seed products subcollection
  for (const product of products) {
    const productSlug = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const ref = db.collection('stores').doc(storeId).collection('products').doc(productSlug);
    batch.set(ref, {
      ...product,
      createdAt: new Date().toISOString(),
    });
  }
  await batch.commit();
  console.log(`  ✅ ${products.length} products seeded in stores/${storeId}/products`);

  return ownerUid;
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function runSeed() {
  console.log('═══════════════════════════════════════════');
  console.log('  SaaS Platform — Database Seeder');
  console.log('  Project:', serviceAccount.project_id);
  console.log('═══════════════════════════════════════════');

  try {
    await seedSuperAdmin();

    await seedStore({
      ownerEmail: 'owner@deshicoast.com',
      ownerPassword: 'StoreOwner123!',
      ownerName: 'John (Deshi Coast)',
      storeId: 'store_deshi_coast',
      storeName: 'Deshi Coast',
      domain: 'deshicoast.com',
      currency: '₹',
      products: [
        {
          title: 'Silk Kurta',
          price: 45,
          category: 'Clothing',
          images: ['https://placehold.co/400x300/667eea/ffffff?text=Silk+Kurta'],
          attributes: { sizes: ['S', 'M', 'L', 'XL'] },
          stock: 50,
          description: 'Handwoven silk kurta with intricate embroidery.',
        },
        {
          title: 'Cotton Sari',
          price: 89,
          category: 'Clothing',
          images: ['https://placehold.co/400x300/764ba2/ffffff?text=Cotton+Sari'],
          attributes: { colors: ['Red', 'Blue', 'Green'] },
          stock: 30,
          description: 'Pure cotton sari, perfect for daily wear.',
        },
        {
          title: 'Embroidered Dupatta',
          price: 22,
          category: 'Accessories',
          images: ['https://placehold.co/400x300/f093fb/ffffff?text=Dupatta'],
          attributes: { material: 'Chiffon' },
          stock: 100,
          description: 'Delicately embroidered dupatta with floral pattern.',
        },
      ],
    });

    await seedStore({
      ownerEmail: 'owner@medtech.com',
      ownerPassword: 'StoreOwner123!',
      ownerName: 'Dr. Priya (MedTech)',
      storeId: 'store_med_tech',
      storeName: 'MedTech Supplies',
      domain: 'medtech.com',
      currency: '₹',
      products: [
        {
          title: 'Digital Stethoscope',
          price: 299,
          category: 'Diagnostics',
          images: ['https://placehold.co/400x300/2d3748/ffffff?text=Stethoscope'],
          attributes: { fdaApproved: true, wireless: false },
          stock: 20,
          description: 'High-sensitivity digital stethoscope for professionals.',
        },
        {
          title: 'Blood Pressure Monitor',
          price: 149,
          category: 'Monitoring',
          images: ['https://placehold.co/400x300/1a202c/ffffff?text=BP+Monitor'],
          attributes: { wireless: true, displayType: 'LCD' },
          stock: 35,
          description: 'Automatic upper arm BP monitor with memory function.',
        },
        {
          title: 'Pulse Oximeter',
          price: 49,
          category: 'Monitoring',
          images: ['https://placehold.co/400x300/2b6cb0/ffffff?text=Oximeter'],
          attributes: { accuracy: '±2%', displayType: 'OLED' },
          stock: 80,
          description: 'Fingertip pulse oximeter with SpO2 and heart rate display.',
        },
      ],
    });

    let seededWatchStore = false;
    const devOverride = process.env.VITE_DEV_STORE_OVERRIDE;
    if (devOverride === 'store_watch_prem') {
      await seedStore({
        ownerEmail: 'owner@watchprem.com',
        ownerPassword: 'StoreOwner123!',
        ownerName: 'Alex (Watch Premium)',
        storeId: 'store_watch_prem',
        storeName: 'Watch Premium',
        domain: 'watchprem.com',
        currency: '$',
        products: [
          {
            title: 'Classic Chronograph',
            price: 250,
            category: 'Watches',
            images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&auto=format&fit=crop&q=60'],
            attributes: { brand: 'ChronoCo', movement: 'Mechanical', strap: 'Leather' },
            stock: 15,
            description: 'An elegant mechanical chronograph watch with a genuine leather strap, white dial, and scratch-resistant sapphire crystal.',
          },
          {
            title: 'Ocean Diver Pro',
            price: 450,
            category: 'Watches',
            images: ['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&auto=format&fit=crop&q=60'],
            attributes: { brand: 'HydroSpec', movement: 'Automatic', waterResistance: '200m' },
            stock: 10,
            description: 'Professional diving watch featuring an automatic movement, black rotating bezel, and luminous hands. Water-resistant up to 200 meters.',
          },
          {
            title: 'Minimalist Slate',
            price: 180,
            category: 'Watches',
            images: ['https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&auto=format&fit=crop&q=60'],
            attributes: { brand: 'Nordic', movement: 'Quartz', batteryLife: '2 years' },
            stock: 30,
            description: 'Ultra-thin minimalist watch with a dark slate grey dial, polished silver markers, and a sleek matte black stainless steel mesh band.',
          },
          {
            title: 'Gold Heritage',
            price: 850,
            category: 'Watches',
            images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=60'],
            attributes: { brand: 'Aurelia', movement: 'Automatic', caseMaterial: '18k Gold Plated' },
            stock: 5,
            description: 'A luxurious heirloom-quality watch featuring an 18k gold-plated case, open-heart dial revealing the automatic movement, and a premium leather strap.',
          }
        ],
      });
      seededWatchStore = true;
    }

    console.log('\n\n✅ ════════════════ SEEDING COMPLETE ════════════════');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑  SUPER ADMIN:');
    console.log('    Email:    superadmin@saasplatform.com');
    console.log('    Password: SuperAdmin123!');
    console.log('    URL:      /super-admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👕  DESHI COAST OWNER:');
    console.log('    Email:    owner@deshicoast.com');
    console.log('    Password: StoreOwner123!');
    console.log('    StoreId:  store_deshi_coast');
    console.log('    Dev URL:  localhost:5173 (set VITE_DEV_STORE_OVERRIDE=store_deshi_coast)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🏥  MEDTECH OWNER:');
    console.log('    Email:    owner@medtech.com');
    console.log('    Password: StoreOwner123!');
    console.log('    StoreId:  store_med_tech');
    console.log('    Dev URL:  localhost:5173 (set VITE_DEV_STORE_OVERRIDE=store_med_tech)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (seededWatchStore) {
      console.log('⌚  WATCH PREMIUM OWNER:');
      console.log('    Email:    owner@watchprem.com');
      console.log('    Password: StoreOwner123!');
      console.log('    StoreId:  store_watch_prem');
      console.log('    Dev URL:  localhost:5173 (set VITE_DEV_STORE_OVERRIDE=store_watch_prem)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
    console.log('\n📋 Next steps:');
    console.log('   1. Deploy security rules: firebase deploy --only firestore:rules');
    console.log('   2. Start dev server:      npm run dev');
    console.log('   3. Open browser:          http://localhost:5173\n');

  } catch (err) {
    console.error('\n❌ Seeding failed:', err.message);
    if (err.code) console.error('   Error code:', err.code);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

runSeed();
