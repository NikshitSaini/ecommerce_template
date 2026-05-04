import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const admin = require('firebase-admin');

// ── Load service account ──────────────────────────────────────────────────
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
} catch {
  console.error('\n❌ ERROR: Service account key not found at scripts/serviceAccountKey.json');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ── Define files to upload ─────────────────────────────────────────────────
const FILES_TO_SEED = [
  { key: 'Header.jsx', path: '../src/ui/components/Header.jsx' },
  { key: 'Footer.jsx', path: '../src/ui/components/Footer.jsx' },
  { key: 'Home.jsx', path: '../src/ui/pages/Home.jsx' },
  { key: 'AboutPage.jsx', path: '../src/ui/pages/AboutPage.jsx' },
  { key: 'ContactPage.jsx', path: '../src/ui/pages/ContactPage.jsx' },
  { key: 'ProductListingPage.jsx', path: '../src/ui/pages/ProductListingPage.jsx' },
  { key: 'ProductDetailPage.jsx', path: '../src/ui/pages/ProductDetailPage.jsx' },
  { key: 'CartPage.jsx', path: '../src/ui/pages/CartPage.jsx' },
  { key: 'CheckoutPage.jsx', path: '../src/ui/pages/CheckoutPage.jsx' },
  { key: 'ProfilePage.jsx', path: '../src/ui/pages/ProfilePage.jsx' },
];

async function seedSkins() {
  console.log('═══════════════════════════════════════════');
  console.log('  SaaS Platform — Skin Seeder');
  console.log('═══════════════════════════════════════════\n');

  try {
    // 1. Read all local files
    console.log('📖 Reading local UI components...');
    const activeSkinPayload = {};
    for (const file of FILES_TO_SEED) {
      const fullPath = path.join(__dirname, file.path);
      try {
        const content = readFileSync(fullPath, 'utf8');
        activeSkinPayload[file.key] = content;
        console.log(`   ✅ Read ${file.key} (${content.length} bytes)`);
      } catch (err) {
        console.error(`   ❌ Failed to read ${file.path}:`, err.message);
      }
    }

    if (Object.keys(activeSkinPayload).length === 0) {
      console.log('\n❌ No files were read successfully. Exiting.');
      process.exit(1);
    }

    // 2. Parse CLI args for --store <storeId>
    const args = process.argv.slice(2);
    const storeArgIndex = args.indexOf('--store');
    const targetStoreId = storeArgIndex !== -1 ? args[storeArgIndex + 1] : null;

    // 3. Fetch stores from database
    console.log('\n🏪 Fetching stores from database...');
    let storesSnapshot;
    if (targetStoreId) {
      console.log(`   Targeting specific store: ${targetStoreId}`);
      const storeDoc = await db.collection('stores').doc(targetStoreId).get();
      storesSnapshot = storeDoc.exists ? [storeDoc] : { empty: true, size: 0, forEach: () => {} };
    } else {
      storesSnapshot = await db.collection('stores').get();
    }
    
    if (storesSnapshot.empty || (Array.isArray(storesSnapshot) && storesSnapshot.length === 0)) {
      console.log('   ⚠️ No stores found matching criteria.');
      process.exit(0);
    }

    // 4. Update each store's activeSkin
    const size = Array.isArray(storesSnapshot) ? storesSnapshot.length : storesSnapshot.size;
    console.log(`   Found ${size} store(s). Uploading skins...`);
    const batch = db.batch();

    const processStore = (storeDoc) => {
      batch.update(storeDoc.ref, { activeSkin: activeSkinPayload });
      console.log(`   ✅ Scheduled update for store: ${storeDoc.id}`);
    };

    if (Array.isArray(storesSnapshot)) {
      storesSnapshot.forEach(processStore);
    } else {
      storesSnapshot.forEach(processStore);
    }

    await batch.commit();
    console.log('\n🎉 Successfully uploaded base skins to all stores!');

  } catch (error) {
    console.error('\n❌ Fatal Error:', error);
  } finally {
    process.exit(0);
  }
}

seedSkins();
