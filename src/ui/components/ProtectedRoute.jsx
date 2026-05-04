import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute
 * ─────────────────────────────────────────────────────────────────────────────
 * Wraps a route and enforces authentication + optional role requirements.
 *
 * Props:
 *   children    — the protected page component
 *   role        — optional required role: "store_owner" | "super_admin" | "shopper"
 *   redirectTo  — where to redirect if access denied (default: "/signin")
 */
export default function ProtectedRoute({ children, role, redirectTo = '/signin' }) {
  const { user, loading, isStoreOwner, isSuperAdmin } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f0f0f',
      }}>
        <div style={{
          width: '40px', height: '40px',
          border: '3px solid #333',
          borderTop: '3px solid #764ba2',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Not authenticated at all
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Role-based checks
  if (role === 'super_admin' && !isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  if (role === 'store_owner' && !isStoreOwner && !isSuperAdmin) {
    // Super admins can access any store's admin panel
    return <Navigate to="/" replace />;
  }

  return children;
}
