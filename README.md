# Professional E-Commerce Template (React + Firebase)

A high-performance, modular e-commerce template designed for rapid deployment and easy customization. Built with a modern tech stack, this template features a full storefront, secure checkout, and a robust admin dashboard for complete catalog management.

## 🚀 Technologies Used

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Backend**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **Styling**: [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) (Modular & Performance-focused)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🎨 Key Features

- **Dynamic Storefront**: Fully responsive homepage with featured categories and products.
- **Advanced Product Catalog**: Robust filtering system based on room, brand, and price.
- **Secure Authentication**: User sign-up, login, and profile management via Firebase Auth.
- **Admin Dashboard**: A comprehensive management suite for:
  - Inventory tracking and stock management.
  - Category and brand hierarchy organization.
  - Order processing and customer oversight.
- **Interactive Cart & Checkout**: Seamless shopping experience with real-time subtotal calculations.
- **SEO Optimized**: Built with semantic HTML and modern performance practices.

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A Firebase Project (see [Setup Guide](firebase_setup_guide.md))

### Installation & Setup

1. **Clone and Install**:
   ```bash
   git clone <repository-url>
   cd e-commerce-template
   npm install
   ```

2. **Configure Firebase**:
   Create a `.env` file in the root directory and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY="..."
   VITE_FIREBASE_AUTH_DOMAIN="..."
   VITE_FIREBASE_PROJECT_ID="..."
   VITE_FIREBASE_STORAGE_BUCKET="..."
   VITE_FIREBASE_MESSAGING_SENDER_ID="..."
   VITE_FIREBASE_APP_ID="..."
   ```

3. **Initialize Admin**:
   Run the seeding script to create your initial system administrator account:
   ```bash
   node scripts/seed.js
   ```

4. **Launch**:
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

- `/src/ui` - Contains all visual components and pages (Storefront & Admin).
- `/src/context` - State management for Auth, Cart, and Global settings.
- `/src/services` - Firebase communication logic (Product, Order, and User services).
- `/scripts` - Utility scripts for database maintenance and seeding.
- `/public` - Static assets and global resources.

## 🛠️ Customization

This template is designed to be "plug-and-play." To change the branding:
1. Update colors in `index.css` or component-level styling constants.
2. Modify the logo and brand name in `src/ui/components/Navbar.jsx` and `src/ui/pages/Home.jsx`.
3. Populate your specific product catalog via the **Admin Panel** after signing in.

## 📄 Documentation

For detailed Firebase configuration and security rules, refer to the **[Firebase Setup Guide](firebase_setup_guide.md)**.
