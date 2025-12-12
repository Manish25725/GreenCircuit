import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getCurrentUser } from '../services/api';

interface InventoryItem {
  _id: string;
  itemName: string;
  category: string;
  quantity: number;
  weight: number;
  status: 'in-use' | 'in-storage' | 'ready-for-pickup' | 'scheduled' | 'recycled';
  condition: 'working' | 'non-working' | 'damaged' | 'unknown';
  location: string;
  assetId: string;
  description?: string;
  createdAt: string;
}

interface Agency {
  _id: string;
  name: string;
  logo?: string;
  rating: number;
  address: { city: string; state: string };
}

const API_BASE = 'http://localhost:3001/api';

const BusinessInventory = () => {
  const user = getCurrentUser();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  
  // Pickup booking states
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loadingAgencies, setLoadingAgencies] = useState(false);
  const [bookingPickup, setBookingPickup] = useState(false);
  const [pickupData, setPickupData] = useState({
    agencyId: '',
    scheduledDate: '',
    scheduledTime: '09:00',
    notes: ''
  });
  
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'IT Equipment',
    quantity: 1,
    weight: 0,
    condition: 'unknown',
    location: 'Main Storage',
    description: ''
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.hash = '#/login';
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/business/inventory`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setInventory(data.data.items || []);
      } else {
        console.error('Failed to fetch inventory:', data.message);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgencies = async () => {
    try {
      setLoadingAgencies(true);
      const res = await fetch(`${API_BASE}/agencies?verified=true`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setAgencies(data.data.agencies || data.data || []);
      }
    } catch (error) {
      console.error('Error fetching agencies:', error);
    } finally {
      setLoadingAgencies(false);
    }
  };

  // Selection handlers
  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const eligibleItems = filteredInventory.filter(i => 
      i.status !== 'scheduled' && i.status !== 'recycled'
    );
    if (selectedItems.length === eligibleItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(eligibleItems.map(i => i._id));
    }
  };

  const getSelectedItemsData = () => {
    return inventory.filter(i => selectedItems.includes(i._id));
  };

  const getSelectedTotalWeight = () => {
    return getSelectedItemsData().reduce((sum, item) => sum + (item.weight * item.quantity), 0);
  };

  // Open pickup modal
  const openPickupModal = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item to schedule pickup');
      return;
    }
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setPickupData({
      agencyId: '',
      scheduledDate: tomorrow.toISOString().split('T')[0],
      scheduledTime: '09:00',
      notes: ''
    });
    
    fetchAgencies();
    setShowPickupModal(true);
  };

  // Book pickup
  const handleBookPickup = async () => {
    if (!pickupData.agencyId || !pickupData.scheduledDate) {
      alert('Please select an agency and date');
      return;
    }

    try {
      setBookingPickup(true);
      
      const selectedItemsData = getSelectedItemsData();
      const items = selectedItemsData.map(item => ({
        type: item.category,
        name: item.itemName,
        category: item.category,
        quantity: item.quantity,
        weight: item.weight,
        description: item.description || item.itemName
      }));

      const res = await fetch(`${API_BASE}/business/bookings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          agencyId: pickupData.agencyId,
          items,
          inventoryItemIds: selectedItems,
          scheduledDate: pickupData.scheduledDate,
          scheduledTime: pickupData.scheduledTime,
          notes: pickupData.notes
        })
      });

      const data = await res.json();

      if (data.success) {
        // Update local inventory status
        setInventory(inventory.map(item => 
          selectedItems.includes(item._id) 
            ? { ...item, status: 'scheduled' as const }
            : item
        ));
        setSelectedItems([]);
        setShowPickupModal(false);
        alert('Pickup scheduled successfully!');
      } else {
        alert('Failed to schedule pickup: ' + (data.message || data.error));
      }
    } catch (error) {
      console.error('Error booking pickup:', error);
      alert('Failed to schedule pickup. Please try again.');
    } finally {
      setBookingPickup(false);
    }
  };

  // Mark items ready for pickup
  const handleMarkReadyForPickup = async () => {
    if (selectedItems.length === 0) return;

    try {
      setSaving(true);
      const res = await fetch(`${API_BASE}/business/inventory/mark-pickup`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ itemIds: selectedItems })
      });

      const data = await res.json();
      if (data.success) {
        setInventory(inventory.map(item => 
          selectedItems.includes(item._id) 
            ? { ...item, status: 'ready-for-pickup' as const }
            : item
        ));
        setSelectedItems([]);
      } else {
        alert('Failed to update items: ' + data.message);
      }
    } catch (error) {
      console.error('Error marking items:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || newItem.weight <= 0) return;
    
    try {
      setSaving(true);
      const res = await fetch(`${API_BASE}/business/inventory`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newItem)
      });
      const data = await res.json();
      
      if (data.success) {
        setInventory([data.data, ...inventory]);
        setShowAddModal(false);
        setNewItem({
          name: '',
          category: 'IT Equipment',
          quantity: 1,
          weight: 0,
          condition: 'unknown',
          location: 'Main Storage',
          description: ''
        });
      } else {
        alert('Failed to add item: ' + data.message);
      }
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;
    
    try {
      setSaving(true);
      const res = await fetch(`${API_BASE}/business/inventory/${editingItem._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          itemName: editingItem.itemName,
          category: editingItem.category,
          quantity: editingItem.quantity,
          weight: editingItem.weight,
          status: editingItem.status,
          condition: editingItem.condition,
          location: editingItem.location,
          description: editingItem.description
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setInventory(inventory.map(item => 
          item._id === editingItem._id ? data.data : item
        ));
        setShowEditModal(false);
        setEditingItem(null);
      } else {
        alert('Failed to update item: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      setDeleting(id);
      const res = await fetch(`${API_BASE}/business/inventory/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      
      if (data.success) {
        setInventory(inventory.filter(item => item._id !== id));
      } else {
        alert('Failed to delete item: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const categories = ['IT Equipment', 'Cables & Wiring', 'Batteries', 'Monitors', 'Appliances', 'Mobile Devices', 'Other'];
  const conditions = ['working', 'non-working', 'damaged', 'unknown'];
  const statuses = ['in-use', 'in-storage', 'ready-for-pickup', 'scheduled', 'recycled'];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.assetId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    totalItems: inventory.reduce((acc, item) => acc + (item.quantity || 0), 0),
    totalWeight: inventory.reduce((acc, item) => acc + ((item.weight || 0) * (item.quantity || 1)), 0),
    pendingPickup: inventory.filter(i => i.status === 'ready-for-pickup' || i.status === 'scheduled').length
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'in-use': return 'bg-blue-500/10 text-blue-400';
      case 'in-storage': return 'bg-[#06b6d4]/10 text-[#06b6d4]';
      case 'ready-for-pickup': return 'bg-amber-500/10 text-amber-400';
      case 'scheduled': return 'bg-[#8b5cf6]/10 text-[#8b5cf6]';
      case 'recycled': return 'bg-[#10b981]/10 text-[#10b981]';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getConditionStyle = (condition: string) => {
    switch(condition) {
      case 'working': return 'bg-[#10b981]/10 text-[#10b981]';
      case 'non-working': return 'bg-red-500/10 text-red-400';
      case 'damaged': return 'bg-amber-500/10 text-amber-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <Layout title="" role="Business" fullWidth hideSidebar>
      <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#06b6d4] selection:text-white min-h-screen">
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
          <div className="fixed top-0 left-0 w-full h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
          <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#06b6d4]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>
          
          <div className="layout-container flex h-full grow flex-col relative z-10">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
              <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/'}>
                <div className="p-2 bg-[#06b6d4]/10 rounded-lg">
                  <svg className="h-6 w-6 text-[#06b6d4]" fill="currentColor" viewBox="0 0 48 48">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">EcoCycle <span className="text-[#06b6d4]">Business</span></h2>
              </div>
              <nav className="hidden md:flex flex-1 justify-center gap-1">
              </nav>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => window.location.hash = '#/profile'}
                  className="hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <div className="size-8 rounded-full bg-[#06b6d4] flex items-center justify-center ring-2 ring-white/10 group-hover:ring-[#06b6d4]/50 transition-all text-white font-bold text-sm">
                    {user?.name?.charAt(0) || 'B'}
                  </div>
                  <span className="text-sm font-medium text-gray-200">{user?.name || 'Business'}</span>
                </button>
                <button onClick={handleLogout} className="p-2.5 rounded-full bg-[#151F26] border border-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Logout">
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </button>
              </div>
            </header>

            <main className="flex flex-1 justify-center py-5 mt-24">
              <div className="layout-content-container flex flex-col w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 py-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <button onClick={() => window.location.hash = '#/business'} className="text-[#94a3b8] hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                      </button>
                      <p className="text-[#8b5cf6] text-sm font-bold uppercase tracking-widest">Asset Management</p>
                    </div>
                    <h1 className="text-white text-3xl sm:text-4xl font-black leading-tight tracking-tighter mb-2">E-Waste Inventory</h1>
                    <p className="text-[#94a3b8] text-base">Track and manage your electronic waste before disposal.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {selectedItems.length > 0 && (
                      <>
                        <button 
                          onClick={handleMarkReadyForPickup}
                          disabled={saving}
                          className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-500/30 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-lg">pending_actions</span>
                          Mark Ready ({selectedItems.length})
                        </button>
                        <button 
                          onClick={openPickupModal}
                          className="bg-[#8b5cf6] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#7c3aed] transition-colors flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-lg">local_shipping</span>
                          Schedule Pickup ({selectedItems.length})
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => setShowAddModal(true)}
                      className="bg-[#06b6d4] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0891b2] transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                      Add Item
                    </button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-[#151F26] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-[#06b6d4]/20 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#06b6d4]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="p-3 bg-[#06b6d4]/10 rounded-xl text-[#06b6d4]">
                        <span className="material-symbols-outlined">inventory_2</span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-white relative z-10">{stats.totalItems}</h3>
                    <p className="text-sm text-[#94a3b8] relative z-10">Items Tracked</p>
                  </div>
                  
                  <div className="bg-[#151F26] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-[#8b5cf6]/20 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b5cf6]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="p-3 bg-[#8b5cf6]/10 rounded-xl text-[#8b5cf6]">
                        <span className="material-symbols-outlined">scale</span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-white relative z-10">{stats.totalWeight.toFixed(1)} <span className="text-lg font-medium text-gray-500">kg</span></h3>
                    <p className="text-sm text-[#94a3b8] relative z-10">Total Weight</p>
                  </div>
                  
                  <div className="bg-[#151F26] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-amber-500/20 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                        <span className="material-symbols-outlined">local_shipping</span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-white relative z-10">{stats.pendingPickup}</h3>
                    <p className="text-sm text-[#94a3b8] relative z-10">Ready for Pickup</p>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <div className="flex-1 relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">search</span>
                    <input
                      type="text"
                      placeholder="Search by name or asset ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#151F26] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none transition-all"
                    />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-[#151F26] border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-[#151F26] border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="in-use">In Use</option>
                    <option value="in-storage">In Storage</option>
                    <option value="ready-for-pickup">Ready for Pickup</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="recycled">Recycled</option>
                  </select>
                </div>

                {/* Inventory Table */}
                <div className="bg-[#151F26] rounded-2xl border border-white/5 overflow-hidden">
                  {loading ? (
                    <div className="p-12 text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-[#06b6d4] border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading inventory...</p>
                    </div>
                  ) : (
                    <>
                      {/* Table Header */}
                      <div className="hidden lg:grid grid-cols-8 gap-4 p-4 border-b border-white/5 text-sm font-medium text-gray-500">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedItems.length > 0 && selectedItems.length === filteredInventory.filter(i => i.status !== 'scheduled' && i.status !== 'recycled').length}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded border-gray-600 bg-white/5 text-[#06b6d4] focus:ring-[#06b6d4] focus:ring-offset-0 cursor-pointer"
                          />
                        </div>
                        <div>Item Name</div>
                        <div>Category</div>
                        <div>Qty / Weight</div>
                        <div>Condition</div>
                        <div>Status</div>
                        <div>Location</div>
                        <div className="text-center">Actions</div>
                      </div>
                      
                      {/* Inventory Items */}
                      {filteredInventory.length === 0 ? (
                        <div className="p-12 text-center">
                          <span className="material-symbols-outlined text-5xl text-gray-600 mb-4">inventory_2</span>
                          <p className="text-gray-400 text-lg">No items found</p>
                          <p className="text-gray-600 text-sm mt-1">
                            {inventory.length === 0 ? 'Add your first item to get started' : 'Try adjusting your search or filters'}
                          </p>
                          {inventory.length === 0 && (
                            <button 
                              onClick={() => setShowAddModal(true)}
                              className="mt-4 bg-[#06b6d4] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0891b2] transition-colors"
                            >
                              Add First Item
                            </button>
                          )}
                        </div>
                      ) : (
                        filteredInventory.map((item) => (
                          <div key={item._id} className={`grid grid-cols-1 lg:grid-cols-8 gap-4 p-4 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors items-center ${selectedItems.includes(item._id) ? 'bg-[#06b6d4]/5' : ''}`}>
                            <div className="flex items-center">
                              {item.status !== 'scheduled' && item.status !== 'recycled' ? (
                                <input
                                  type="checkbox"
                                  checked={selectedItems.includes(item._id)}
                                  onChange={() => toggleItemSelection(item._id)}
                                  className="w-4 h-4 rounded border-gray-600 bg-white/5 text-[#06b6d4] focus:ring-[#06b6d4] focus:ring-offset-0 cursor-pointer"
                                />
                              ) : (
                                <div className="w-4 h-4"></div>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-[#06b6d4]/10 text-[#06b6d4]">
                                <span className="material-symbols-outlined text-lg">devices</span>
                              </div>
                              <div>
                                <p className="text-white font-semibold">{item.itemName}</p>
                                <p className="text-gray-500 text-xs">{item.assetId}</p>
                              </div>
                            </div>
                            <div className="text-gray-400">
                              <span className="lg:hidden text-gray-600 text-sm mr-2">Category:</span>
                              {item.category}
                            </div>
                            <div className="text-white">
                              <span className="lg:hidden text-gray-600 text-sm mr-2">Qty/Weight:</span>
                              {item.quantity} × {item.weight}kg
                            </div>
                            <div>
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getConditionStyle(item.condition)}`}>
                                {item.condition}
                              </span>
                            </div>
                            <div>
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(item.status)}`}>
                                {item.status?.replace(/-/g, ' ')}
                              </span>
                            </div>
                            <div className="text-gray-400 text-sm">
                              <span className="lg:hidden text-gray-600 text-sm mr-2">Location:</span>
                              {item.location}
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleEditItem(item)}
                                className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-[#06b6d4] hover:bg-[#06b6d4]/10 transition-colors" 
                                title="Edit"
                              >
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>
                              <button 
                                onClick={() => handleDeleteItem(item._id)}
                                disabled={deleting === item._id}
                                className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50" 
                                title="Delete"
                              >
                                {deleting === item._id ? (
                                  <div className="animate-spin w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full"></div>
                                ) : (
                                  <span className="material-symbols-outlined text-lg">delete</span>
                                )}
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Add Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => !saving && setShowAddModal(false)}>
            <div className="bg-[#151F26] rounded-3xl w-full max-w-lg border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#151F26]">
                <h3 className="text-white font-bold text-lg">Add Inventory Item</h3>
                <button onClick={() => !saving && setShowAddModal(false)} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Item Name *</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none"
                    placeholder="e.g., Dell PowerEdge Servers"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none resize-none"
                    placeholder="Additional details about the item..."
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Category *</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none cursor-pointer"
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Condition</label>
                    <select
                      value={newItem.condition}
                      onChange={(e) => setNewItem({...newItem, condition: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none cursor-pointer"
                    >
                      {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Quantity *</label>
                    <input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Weight per unit (kg) *</label>
                    <input
                      type="number"
                      value={newItem.weight}
                      onChange={(e) => setNewItem({...newItem, weight: parseFloat(e.target.value) || 0})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                  <input
                    type="text"
                    value={newItem.location}
                    onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none"
                    placeholder="e.g., Warehouse A, Office Floor 2"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 p-6 pt-0">
                <button
                  onClick={() => !saving && setShowAddModal(false)}
                  disabled={saving}
                  className="flex-1 bg-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  disabled={!newItem.name || newItem.weight <= 0 || saving}
                  className="flex-1 bg-[#06b6d4] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0891b2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Adding...
                    </>
                  ) : (
                    'Add Item'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Item Modal */}
        {showEditModal && editingItem && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => !saving && setShowEditModal(false)}>
            <div className="bg-[#151F26] rounded-3xl w-full max-w-lg border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#151F26]">
                <h3 className="text-white font-bold text-lg">Edit Inventory Item</h3>
                <button onClick={() => !saving && setShowEditModal(false)} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-500">tag</span>
                  <span className="text-gray-400 text-sm">Asset ID: <span className="text-white font-mono">{editingItem.assetId}</span></span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Item Name *</label>
                  <input
                    type="text"
                    value={editingItem.itemName}
                    onChange={(e) => setEditingItem({...editingItem, itemName: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none resize-none"
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                    <select
                      value={editingItem.category}
                      onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none cursor-pointer"
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Condition</label>
                    <select
                      value={editingItem.condition}
                      onChange={(e) => setEditingItem({...editingItem, condition: e.target.value as any})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none cursor-pointer"
                    >
                      {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Quantity</label>
                    <input
                      type="number"
                      value={editingItem.quantity}
                      onChange={(e) => setEditingItem({...editingItem, quantity: parseInt(e.target.value) || 1})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Weight per unit (kg)</label>
                    <input
                      type="number"
                      value={editingItem.weight}
                      onChange={(e) => setEditingItem({...editingItem, weight: parseFloat(e.target.value) || 0})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                    <select
                      value={editingItem.status}
                      onChange={(e) => setEditingItem({...editingItem, status: e.target.value as any})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none cursor-pointer"
                    >
                      {statuses.map(s => <option key={s} value={s}>{s.replace(/-/g, ' ')}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                    <input
                      type="text"
                      value={editingItem.location}
                      onChange={(e) => setEditingItem({...editingItem, location: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 p-6 pt-0">
                <button
                  onClick={() => !saving && setShowEditModal(false)}
                  disabled={saving}
                  className="flex-1 bg-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateItem}
                  disabled={!editingItem.itemName || saving}
                  className="flex-1 bg-[#06b6d4] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0891b2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Pickup Modal */}
        {showPickupModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => !bookingPickup && setShowPickupModal(false)}>
            <div className="bg-[#151F26] rounded-3xl w-full max-w-2xl border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#151F26]">
                <div>
                  <h3 className="text-white font-bold text-lg">Schedule Pickup</h3>
                  <p className="text-gray-500 text-sm">{selectedItems.length} items selected • {getSelectedTotalWeight().toFixed(1)} kg total</p>
                </div>
                <button onClick={() => !bookingPickup && setShowPickupModal(false)} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Selected Items Summary */}
                <div className="bg-white/5 rounded-xl p-4 max-h-40 overflow-y-auto">
                  <p className="text-sm font-medium text-gray-400 mb-3">Items to pickup:</p>
                  <div className="space-y-2">
                    {getSelectedItemsData().map(item => (
                      <div key={item._id} className="flex justify-between items-center text-sm">
                        <span className="text-white">{item.itemName}</span>
                        <span className="text-gray-500">{item.quantity} × {item.weight}kg</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Select Agency */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Select Recycling Agency *</label>
                  {loadingAgencies ? (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                      <div className="animate-spin w-6 h-6 border-2 border-[#06b6d4] border-t-transparent rounded-full mx-auto"></div>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {agencies.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-4">No verified agencies available</p>
                      ) : (
                        agencies.map(agency => (
                          <label
                            key={agency._id}
                            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                              pickupData.agencyId === agency._id 
                                ? 'border-[#06b6d4] bg-[#06b6d4]/10' 
                                : 'border-white/10 bg-white/5 hover:border-white/20'
                            }`}
                          >
                            <input
                              type="radio"
                              name="agency"
                              value={agency._id}
                              checked={pickupData.agencyId === agency._id}
                              onChange={(e) => setPickupData({...pickupData, agencyId: e.target.value})}
                              className="hidden"
                            />
                            <div className="w-10 h-10 rounded-lg bg-[#8b5cf6]/20 flex items-center justify-center text-[#8b5cf6] font-bold">
                              {agency.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium">{agency.name}</p>
                              <p className="text-gray-500 text-sm">{agency.address?.city}, {agency.address?.state}</p>
                            </div>
                            <div className="flex items-center gap-1 text-amber-400">
                              <span className="material-symbols-outlined text-sm">star</span>
                              <span className="text-sm font-medium">{agency.rating?.toFixed(1) || '4.5'}</span>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Schedule Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Pickup Date *</label>
                    <input
                      type="date"
                      value={pickupData.scheduledDate}
                      onChange={(e) => setPickupData({...pickupData, scheduledDate: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Preferred Time</label>
                    <select
                      value={pickupData.scheduledTime}
                      onChange={(e) => setPickupData({...pickupData, scheduledTime: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none cursor-pointer"
                    >
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Special Instructions (Optional)</label>
                  <textarea
                    value={pickupData.notes}
                    onChange={(e) => setPickupData({...pickupData, notes: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none resize-none"
                    placeholder="Any special handling instructions, access codes, etc..."
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex gap-4 p-6 pt-0">
                <button
                  onClick={() => !bookingPickup && setShowPickupModal(false)}
                  disabled={bookingPickup}
                  className="flex-1 bg-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookPickup}
                  disabled={!pickupData.agencyId || !pickupData.scheduledDate || bookingPickup}
                  className="flex-1 bg-[#8b5cf6] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#7c3aed] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {bookingPickup ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">local_shipping</span>
                      Schedule Pickup
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BusinessInventory;
