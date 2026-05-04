import { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { User, MapPin, Package, Heart, Settings, LogOut, ChevronRight, Edit3, Plus, Trash2, Shield, Loader2, LayoutDashboard } from 'lucide-react';
import { toast } from 'react-toastify';

import { useAuth } from '../../context/AuthContext';
import { getOrders } from '../../services/orderService';

const StatusBadge = ({ status }) => {
  const config = {
    'Placed': { color: 'bg-[#FDF8F3] text-[#B58D67]', dot: 'bg-[#B58D67]' },
    'Processing': { color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-400' },
    'Shipped': { color: 'bg-purple-50 text-purple-600', dot: 'bg-purple-400' },
    'Delivered': { color: 'bg-green-50 text-green-600', dot: 'bg-green-400' },
    'Cancelled': { color: 'bg-red-50 text-red-600', dot: 'bg-red-400' },
  };
  const style = config[status] || config['Placed'];
  return (
    <div className={`px-2.5 py-1 rounded-full ${style.color} text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </div>
  );
};

const tabs = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'addresses', label: 'Delivery Hub', icon: MapPin },
  { id: 'orders', label: 'Order History', icon: Package },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Furnear Palette
  const colors = {
    accent: '#B58D67',
    bg: '#F9F8F6',
    border: '#EBE9E4',
    white: '#ffffff',
    textMain: '#2D2D2D',
    textMuted: '#757575'
  };

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: '', street: '', city: '', state: '', zip: '', phone: ''
  });

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders' && user?.uid) {
      setOrdersLoading(true);
      getOrders(user.uid)
        .then(setOrders)
        .catch((err) => console.error('Error fetching orders:', err))
        .finally(() => setOrdersLoading(false));
    }
  }, [activeTab, user]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    try {
      const newAddress = {
        id: Date.now().toString(),
        ...addressForm,
        isDefault: (user.addresses || []).length === 0
      };
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { addresses: arrayUnion(newAddress) });
      toast.success("Address added to your profile!");
      setIsAddingAddress(false);
      setAddressForm({ label: '', street: '', city: '', state: '', zip: '', phone: '' });
    } catch (error) {
      toast.error("Failed to add address");
    }
  };

  const handleRemoveAddress = async (address) => {
    if (!user?.uid || !window.confirm("Remove this delivery address?")) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { addresses: arrayRemove(address) });
      toast.success("Address removed");
    } catch (error) {
      toast.error("Error removing address");
    }
  };

  if (!user) {
    navigate('/signin');
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const initials = (user?.name?.trim())
    ? user.name.trim().split(' ').map(n => n[0]).join('').toUpperCase()
    : (user?.email ? user.email[0].toUpperCase() : 'F');

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh' }} className="py-12">
      <div className="container-main animate-fade-in">
        <h1 style={{ color: colors.textMain, fontFamily: 'serif' }} className="text-3xl font-800 mb-10">Account Settings</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div style={{ backgroundColor: colors.white, border: `1px solid ${colors.border}` }} className="rounded-2xl p-6 shadow-sm h-fit">
            <div style={{ borderBottom: `1px solid ${colors.border}` }} className="flex items-center gap-4 mb-6 pb-6">
              <div style={{ backgroundColor: '#F3EDE7', color: colors.accent, border: `2px solid ${colors.white}` }} className="w-14 h-14 rounded-full flex items-center justify-center font-800 text-xl shadow-inner">
                {initials}
              </div>
              <div className="min-w-0">
                <p style={{ color: colors.textMain }} className="font-800 text-sm truncate uppercase tracking-tight">{user.name || 'Member'}</p>
                <p style={{ color: colors.textMuted }} className="text-[11px] truncate mt-0.5">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  style={{ backgroundColor: colors.accent, color: colors.white }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-800 uppercase tracking-widest shadow-md transition-transform hover:scale-[1.02] mb-4"
                >
                  <LayoutDashboard size={14} />
                  Admin Console
                </Link>
              )}
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    backgroundColor: activeTab === tab.id ? '#FDF8F3' : 'transparent',
                    color: activeTab === tab.id ? colors.accent : colors.textMuted
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-700 transition-all ${activeTab === tab.id ? '' : 'hover:bg-gray-50'}`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-700 text-red-400 hover:bg-red-50 transition-colors mt-6"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div style={{ backgroundColor: colors.white, border: `1px solid ${colors.border}` }} className="rounded-2xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 style={{ color: colors.textMain, fontFamily: 'serif' }} className="text-xl font-800">Identity Details</h2>
                  <button style={{ border: `1px solid ${colors.border}`, color: colors.textMain }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-700 text-xs hover:bg-gray-50 transition-colors">
                    <Edit3 size={14} /> Update Info
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-y-8 gap-x-12">
                  <div>
                    <label style={{ color: colors.accent }} className="text-[10px] font-800 uppercase tracking-widest">Legal Name</label>
                    <p style={{ color: colors.textMain }} className="text-sm font-600 mt-1">{user.name}</p>
                  </div>
                  <div>
                    <label style={{ color: colors.accent }} className="text-[10px] font-800 uppercase tracking-widest">Email Access</label>
                    <p style={{ color: colors.textMain }} className="text-sm font-600 mt-1">{user.email}</p>
                  </div>
                  <div>
                    <label style={{ color: colors.accent }} className="text-[10px] font-800 uppercase tracking-widest">Primary Phone</label>
                    <p style={{ color: colors.textMain }} className="text-sm font-600 mt-1">{user.phone || 'Not linked'}</p>
                  </div>
                  <div>
                    <label style={{ color: colors.accent }} className="text-[10px] font-800 uppercase tracking-widest">Client Since</label>
                    <p style={{ color: colors.textMain }} className="text-sm font-600 mt-1">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}</p>
                  </div>
                </div>
                <div style={{ borderTop: `1px solid ${colors.border}` }} className="mt-10 pt-6">
                  <div style={{ color: colors.textMuted }} className="flex items-center gap-2 text-xs">
                    <Shield size={14} className="text-green-500" />
                    <span>Your artisan account is encrypted and protected.</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 style={{ color: colors.textMain, fontFamily: 'serif' }} className="text-xl font-800">Shipping Destinations</h2>
                  {!isAddingAddress && (
                    <button
                      onClick={() => setIsAddingAddress(true)}
                      style={{ backgroundColor: colors.accent, color: colors.white }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-700 text-xs shadow-md"
                    >
                      <Plus size={14} /> New Address
                    </button>
                  )}
                </div>

                {isAddingAddress ? (
                  <form onSubmit={handleAddAddress} style={{ backgroundColor: colors.white, border: `1px solid ${colors.border}` }} className="rounded-2xl p-8 space-y-6 animate-fade-in shadow-lg">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="col-span-full">
                        <label style={{ color: colors.textMuted }} className="block text-[10px] font-800 uppercase tracking-widest mb-2">Destination Label</label>
                        <input
                          type="text" required
                          style={{ backgroundColor: colors.bg, border: 'none' }}
                          className="w-full px-5 py-3 rounded-xl text-sm outline-none ring-accent/10 focus:ring-2"
                          placeholder="Home Studio / Office"
                          value={addressForm.label}
                          onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                        />
                      </div>
                      <div className="col-span-full">
                        <label style={{ color: colors.textMuted }} className="block text-[10px] font-800 uppercase tracking-widest mb-2">Street & Unit</label>
                        <input
                          type="text" required
                          style={{ backgroundColor: colors.bg, border: 'none' }}
                          className="w-full px-5 py-3 rounded-xl text-sm outline-none ring-accent/10 focus:ring-2"
                          placeholder="123 Oak St, Suite 400"
                          value={addressForm.street}
                          onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        />
                      </div>
                      <div>
                        <label style={{ color: colors.textMuted }} className="block text-[10px] font-800 uppercase tracking-widest mb-2">City</label>
                        <input
                          type="text" required
                          style={{ backgroundColor: colors.bg, border: 'none' }}
                          className="w-full px-5 py-3 rounded-xl text-sm"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <label style={{ color: colors.textMuted }} className="block text-[10px] font-800 uppercase tracking-widest mb-2">ZIP Code</label>
                        <input
                          type="text" required
                          style={{ backgroundColor: colors.bg, border: 'none' }}
                          className="w-full px-5 py-3 rounded-xl text-sm"
                          value={addressForm.zip}
                          onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button type="submit" style={{ backgroundColor: colors.accent, color: colors.white }} className="flex-1 py-3.5 rounded-xl font-800 text-sm shadow-lg">Confirm Address</button>
                      <button type="button" onClick={() => setIsAddingAddress(false)} className="px-8 py-3.5 bg-gray-100 text-gray-500 rounded-xl font-700 text-sm">Dismiss</button>
                    </div>
                  </form>
                ) : (
                  <div className="grid gap-4">
                    {(user.addresses || []).length === 0 ? (
                      <div style={{ backgroundColor: colors.white, border: `1px solid ${colors.border}` }} className="text-center py-16 rounded-2xl">
                        <MapPin size={48} style={{ color: colors.border }} className="mx-auto mb-4" />
                        <p style={{ color: colors.textMuted }} className="text-sm font-500">No delivery hubs saved yet.</p>
                      </div>
                    ) : (
                      (user.addresses || []).map((addr) => (
                        <div key={addr.id} style={{ backgroundColor: colors.white, border: `1px solid ${colors.border}` }} className="p-6 rounded-2xl flex items-start justify-between group hover:shadow-md transition-shadow">
                          <div className="flex gap-4">
                            <div style={{ backgroundColor: colors.bg, color: colors.accent }} className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                              <MapPin size={22} />
                            </div>
                            <div>
                              <div className="flex items-center gap-3">
                                <p style={{ color: colors.textMain }} className="font-800 text-sm tracking-tight">{addr.label}</p>
                                {addr.isDefault && <span style={{ backgroundColor: '#FDF8F3', color: colors.accent }} className="text-[9px] px-2 py-0.5 rounded-md font-900 tracking-tighter">PRIMARY</span>}
                              </div>
                              <p style={{ color: colors.textMuted }} className="text-sm mt-1">{addr.street}</p>
                              <p style={{ color: colors.textMuted }} className="text-xs">{addr.city}, {addr.zip}</p>
                            </div>
                          </div>
                          <button onClick={() => handleRemoveAddress(addr)} className="p-2 text-gray-200 hover:text-red-400 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 style={{ color: colors.textMain, fontFamily: 'serif' }} className="text-xl font-800">Order History</h2>
                {ordersLoading ? (
                  <div className="flex justify-center py-16">
                    <Loader2 size={24} style={{ color: colors.accent }} className="animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div style={{ backgroundColor: colors.white, border: `1px solid ${colors.border}` }} className="text-center py-16 rounded-2xl">
                    <Package size={48} style={{ color: colors.border }} className="mx-auto mb-4" />
                    <p style={{ color: colors.textMuted }} className="text-sm">No piece acquisitions recorded.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        style={{ backgroundColor: colors.white, border: `1px solid ${colors.border}` }}
                        className="p-6 rounded-2xl hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p style={{ color: colors.textMain }} className="text-sm font-800 tracking-tight">Ref: {order.id.slice(-8).toUpperCase()}</p>
                            <p style={{ color: colors.textMuted }} className="text-[11px] font-500">{order.date} • {order.items?.length || 0} Crafts</p>
                          </div>
                          <div className="flex items-center gap-6">
                            <p style={{ color: colors.accent }} className="text-sm font-800">${(order.total || 0).toFixed(2)}</p>
                            <StatusBadge status={order.status} />
                            <ChevronRight size={18} style={{ color: colors.border }} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}