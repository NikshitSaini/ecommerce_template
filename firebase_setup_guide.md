# Firebase Setup Guide for E-Commerce Template

This guide walks you through setting up a new Firebase project and configuring it for this application.

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project**.
3. Enter a project name (e.g., `my-ecommerce-store`).
4. Choose whether to enable Google Analytics (optional, you can turn it off for now).
5. Click **Create project**.

## 2. Register Your Web App

1. On the Project Overview page, click the **Web** icon (`</>`).
2. Enter an app nickname (e.g., `Storefront`).
3. (Optional) Check "Also set up Firebase Hosting" if you plan to host the app on Firebase.
4. Click **Register app**.
5. You will see a `firebaseConfig` object. Keep this page open; you will need these values in Step 4.

## 3. Enable Required Services

### Authentication

1. In the left sidebar, go to **Build > Authentication**.
2. Click **Get Started**.
3. Go to the **Sign-in method** tab.
4. Click **Email/Password** and enable it.
5. Click **Save**.

### Firestore Database

1. In the left sidebar, go to **Build > Firestore Database**.
2. Click **Create database**.
3. Choose a location close to your users and click **Next**.
4. Choose **Start in production mode** (we will configure secure rules in Step 5).
5. Click **Create**.

## 4. Configure Environment Variables

1. In your project's root directory, locate the `.env` file (or create one based on `.env.example`).
2. Copy the values from the `firebaseConfig` object you got in Step 2.
3. Replace the placeholder values in the `.env` file:

```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project-id.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
```

## 5. Set Firestore Security Rules

To ensure your data is secure but accessible to the app, you need to set up Firestore Security Rules.

1. In the Firebase Console, go to **Firestore Database** > **Rules** tab.
2. Replace the existing rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if the user is an admin
    function isAdmin() {
      return request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin';
    }

    // Public read access for catalogs, admin write access
    match /products/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /categories/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /brands/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Users can read/write their own profile; admins can read/write all
    match /users/{userId} {
      allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
    }

    // Authenticated users can read their own orders; admins can read/write all
    match /orders/{orderId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null && (resource.data.userId == request.auth.uid || isAdmin());
    }

    // Config settings only admins can modify
    match /settings/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Everything else closed by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **Publish**.

## 6. Seed the Database

Now that Firebase is set up, you need to create the initial Admin user to access the Admin Panel.

1. Ensure your `.env` variables are correct.
2. Open your terminal in the project root.
3. Run the seeding script:
   ```bash
   node scripts/seed.js
   ```
4. This script will create an admin account with the email `admin@bluecare.com` and password `AdminPassword123!` (you can change these in the `seed.js` script before running it).
5. Start your dev server (`npm run dev`) and navigate to the admin sign-in page to log in.
