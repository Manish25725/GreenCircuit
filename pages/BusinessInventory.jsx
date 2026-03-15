import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout.jsx';
import Loader from '../components/Loader.jsx';
import { getCurrentUser } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
// City coordinates for map (worldwide)
const cityCoordinates = {
    // India
    'Delhi': [28.6139, 77.2090],
    'New Delhi': [28.6139, 77.2090],
    'Mumbai': [19.0760, 72.8777],
    'Bangalore': [12.9716, 77.5946],
    'Bengaluru': [12.9716, 77.5946],
    'Chennai': [13.0827, 80.2707],
    'Hyderabad': [17.3850, 78.4867],
    'Kolkata': [22.5726, 88.3639],
    'Pune': [18.5204, 73.8567],
    'Noida': [28.5355, 77.3910],
    'Gurgaon': [28.4595, 77.0266],
    'Gurugram': [28.4595, 77.0266],
    'Ahmedabad': [23.0225, 72.5714],
    'Jaipur': [26.9124, 75.7873],
    'Lucknow': [26.8467, 80.9462],
    'Chandigarh': [30.7333, 76.7794],
    'Indore': [22.7196, 75.8577],
    // USA
    'New York': [40.7128, -74.0060],
    'Los Angeles': [34.0522, -118.2437],
    'Chicago': [41.8781, -87.6298],
    'Houston': [29.7604, -95.3698],
    'San Francisco': [37.7749, -122.4194],
    'Seattle': [47.6062, -122.3321],
    'Miami': [25.7617, -80.1918],
    'Boston': [42.3601, -71.0589],
    'Austin': [30.2672, -97.7431],
    'Denver': [39.7392, -104.9903],
    // Europe
    'London': [51.5074, -0.1278],
    'Paris': [48.8566, 2.3522],
    'Berlin': [52.5200, 13.4050],
    'Amsterdam': [52.3676, 4.9041],
    'Madrid': [40.4168, -3.7038],
    'Rome': [41.9028, 12.4964],
    'Barcelona': [41.3851, 2.1734],
    'Munich': [48.1351, 11.5820],
    'Vienna': [48.2082, 16.3738],
    'Dublin': [53.3498, -6.2603],
    'Stockholm': [59.3293, 18.0686],
    'Zurich': [47.3769, 8.5417],
    // Asia Pacific
    'Singapore': [1.3521, 103.8198],
    'Tokyo': [35.6762, 139.6503],
    'Sydney': [-33.8688, 151.2093],
    'Melbourne': [-37.8136, 144.9631],
    'Dubai': [25.2048, 55.2708],
    'Hong Kong': [22.3193, 114.1694],
    'Shanghai': [31.2304, 121.4737],
    'Beijing': [39.9042, 116.4074],
    'Seoul': [37.5665, 126.9780],
    'Bangkok': [13.7563, 100.5018],
    'Kuala Lumpur': [3.1390, 101.6869],
    'Jakarta': [-6.2088, 106.8456],
    // Others
    'Toronto': [43.6532, -79.3832],
    'Vancouver': [49.2827, -123.1207],
    'São Paulo': [-23.5505, -46.6333],
    'Rio de Janeiro': [-22.9068, -43.1729],
    'Cape Town': [-33.9249, 18.4241],
    'Johannesburg': [-26.2041, 28.0473],
    'Lagos': [6.5244, 3.3792],
    'Cairo': [30.0444, 31.2357],
    'Tel Aviv': [32.0853, 34.7818],
    'Moscow': [55.7558, 37.6173],
};
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const BusinessInventory = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);
    // Pickup booking states
    const [selectedItems, setSelectedItems] = useState([]);
    const [showPickupModal, setShowPickupModal] = useState(false);
    const [agencies, setAgencies] = useState([]);
    const [loadingAgencies, setLoadingAgencies] = useState(false);
    const [bookingPickup, setBookingPickup] = useState(false);
    const [pickupData, setPickupData] = useState({
        agencyId: '',
        scheduledDate: '',
        scheduledTime: '09:00',
        notes: ''
    });
    // Notification state
    const [notification, setNotification] = useState({
        show: false,
        type: 'success',
        message: ''
    });
    // Map ref for pickup modal
    const pickupMapRef = useRef(null);
    const pickupMapInstance = useRef(null);
    const markersRef = useRef([]);
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
        navigate('/login');
    };
    useEffect(() => {
        fetchInventory();
    }, []);
    // Initialize map when pickup modal opens
    useEffect(() => {
        if (showPickupModal && !loadingAgencies && agencies.length > 0 && pickupMapRef.current && !pickupMapInstance.current) {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                if (!pickupMapRef.current || pickupMapInstance.current)
                    return;
                // Initialize map centered on India with dark theme
                const map = L.map(pickupMapRef.current, {
                    center: [20.5937, 78.9629],
                    zoom: 5,
                    zoomControl: false,
                    attributionControl: false,
                    scrollWheelZoom: true
                });
                const tileProviders = [
                    {
                        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
                        options: { subdomains: 'abcd', maxZoom: 20, attribution: '' }
                    },
                    {
                        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                        options: { maxZoom: 19, attribution: '' }
                    },
                    {
                        url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                        options: { subdomains: 'abc', maxZoom: 20, attribution: '' }
                    }
                ];
                const attachTileLayerWithFallback = (targetMap) => {
                    let providerIndex = 0;
                    let activeLayer = null;
                    const useNextProvider = () => {
                        if (activeLayer) {
                            targetMap.removeLayer(activeLayer);
                        }
                        if (providerIndex >= tileProviders.length) {
                            return;
                        }
                        const provider = tileProviders[providerIndex++];
                        activeLayer = L.tileLayer(provider.url, provider.options).addTo(targetMap);
                        let tileErrors = 0;
                        activeLayer.on('tileerror', () => {
                            tileErrors += 1;
                            if (tileErrors >= 8) {
                                useNextProvider();
                            }
                        });
                    };
                    useNextProvider();
                };
                attachTileLayerWithFallback(map);
                // Add custom zoom control
                L.control.zoom({ position: 'bottomright' }).addTo(map);
                pickupMapInstance.current = map;
                // Add beautiful custom markers for each agency
                agencies.forEach(agency => {
                    const city = agency.address?.city || '';
                    const coords = cityCoordinates[city] || [20.5937, 78.9629];
                    const isSelected = pickupData.agencyId === agency._id;
                    // Beautiful animated marker with pulse effect (cyan/purple for Business theme)
                    const customIcon = L.divIcon({
                        className: 'pickup-marker-wrapper',
                        html: `
              <div class="pickup-marker ${isSelected ? 'selected' : ''}" data-agency="${agency._id}">
                <div class="pickup-marker-pulse"></div>
                <div class="pickup-marker-pin">
                  <div class="pickup-marker-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                </div>
              </div>
            `,
                        iconSize: [36, 44],
                        iconAnchor: [18, 44],
                        popupAnchor: [0, -44],
                    });
                    const marker = L.marker(coords, { icon: customIcon }).addTo(map);
                    // Beautiful popup matching SearchAgencies style
                    marker.bindPopup(`
            <div class="pickup-popup">
              <div class="pickup-popup-header">
                <div class="pickup-popup-icon">♻️</div>
                <div class="pickup-popup-title">
                  <h3>${agency.name}</h3>
                  <span class="pickup-popup-location">${city}, ${agency.address?.state || ''}</span>
                </div>
              </div>
              <div class="pickup-popup-stats">
                <div class="pickup-stat">
                  <span class="pickup-stat-icon">⭐</span>
                  <span class="pickup-stat-value">${agency.rating?.toFixed(1) || '4.5'}</span>
                </div>
              </div>
            </div>
          `, {
                        className: 'pickup-custom-popup',
                        closeButton: true,
                        maxWidth: 220,
                        minWidth: 180
                    });
                    marker.agencyId = agency._id;
                    marker.on('click', () => {
                        setPickupData(prev => ({ ...prev, agencyId: agency._id }));
                    });
                    markersRef.current.push(marker);
                });
                // Fit bounds to show all markers
                if (markersRef.current.length > 0) {
                    const group = L.featureGroup(markersRef.current);
                    map.fitBounds(group.getBounds().pad(0.3), { maxZoom: 8 });
                }
                // Force map to recalculate size
                setTimeout(() => {
                    if (pickupMapInstance.current) {
                        pickupMapInstance.current.invalidateSize();
                    }
                }, 200);
            }, 150);
        }
    }, [showPickupModal, loadingAgencies, agencies]);
    // Cleanup map when modal closes
    useEffect(() => {
        if (!showPickupModal && pickupMapInstance.current) {
            pickupMapInstance.current.remove();
            pickupMapInstance.current = null;
            markersRef.current = [];
        }
    }, [showPickupModal]);
    // Highlight selected agency on map
    useEffect(() => {
        if (pickupMapInstance.current && markersRef.current.length > 0 && pickupData.agencyId) {
            // Update marker styles and fly to selected
            markersRef.current.forEach(marker => {
                const markerEl = marker.getElement();
                if (markerEl) {
                    const markerDiv = markerEl.querySelector('.pickup-marker');
                    if (markerDiv) {
                        if (marker.agencyId === pickupData.agencyId) {
                            markerDiv.classList.add('selected');
                        }
                        else {
                            markerDiv.classList.remove('selected');
                        }
                    }
                }
                if (marker.agencyId === pickupData.agencyId) {
                    marker.openPopup();
                    const latLng = marker.getLatLng();
                    pickupMapInstance.current.flyTo(latLng, 10, {
                        duration: 0.8,
                        easeLinearity: 0.25
                    });
                }
            });
        }
    }, [pickupData.agencyId]);
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
            }
            else {
            }
        }
        catch (error) {
        }
        finally {
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
        }
        catch (error) {
        }
        finally {
            setLoadingAgencies(false);
        }
    };
    // Selection handlers
    const toggleItemSelection = (id) => {
        setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };
    const toggleSelectAll = () => {
        const eligibleItems = filteredInventory.filter(i => i.status !== 'scheduled' && i.status !== 'recycled');
        if (selectedItems.length === eligibleItems.length) {
            setSelectedItems([]);
        }
        else {
            setSelectedItems(eligibleItems.map(i => i._id));
        }
    };
    const toggleSelectAllReadyForPickup = () => {
        const readyItems = filteredInventory.filter(i => i.status === 'ready-for-pickup');
        const allReadySelected = readyItems.every(item => selectedItems.includes(item._id));
        if (allReadySelected) {
            // Deselect all ready-for-pickup items
            setSelectedItems(prev => prev.filter(id => !readyItems.find(item => item._id === id)));
        }
        else {
            // Select all ready-for-pickup items
            const readyIds = readyItems.map(i => i._id);
            setSelectedItems(prev => [...new Set([...prev, ...readyIds])]);
        }
    };
    const getReadyForPickupCount = () => {
        return filteredInventory.filter(i => i.status === 'ready-for-pickup').length;
    };
    const getSelectedReadyForPickupCount = () => {
        const readyItems = filteredInventory.filter(i => i.status === 'ready-for-pickup');
        return readyItems.filter(item => selectedItems.includes(item._id)).length;
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
                setInventory(inventory.map(item => selectedItems.includes(item._id)
                    ? { ...item, status: 'scheduled' }
                    : item));
                setSelectedItems([]);
                setShowPickupModal(false);
                setNotification({
                    show: true,
                    type: 'success',
                    message: 'Pickup scheduled successfully!'
                });
                setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
            }
            else {
                setNotification({
                    show: true,
                    type: 'error',
                    message: 'Failed to schedule pickup: ' + (data.message || data.error)
                });
                setTimeout(() => setNotification({ show: false, type: 'error', message: '' }), 5000);
            }
        }
        catch (error) {
            setNotification({
                show: true,
                type: 'error',
                message: 'Failed to schedule pickup. Please try again.'
            });
            setTimeout(() => setNotification({ show: false, type: 'error', message: '' }), 5000);
        }
        finally {
            setBookingPickup(false);
        }
    };
    // Mark items ready for pickup
    const handleMarkReadyForPickup = async () => {
        if (selectedItems.length === 0)
            return;
        try {
            setSaving(true);
            const res = await fetch(`${API_BASE}/business/inventory/mark-pickup`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ itemIds: selectedItems })
            });
            const data = await res.json();
            if (data.success) {
                setInventory(inventory.map(item => selectedItems.includes(item._id)
                    ? { ...item, status: 'ready-for-pickup' }
                    : item));
                setSelectedItems([]);
            }
            else {
                alert('Failed to update items: ' + data.message);
            }
        }
        catch (error) {
        }
        finally {
            setSaving(false);
        }
    };
    const handleAddItem = async () => {
        if (!newItem.name || newItem.weight <= 0)
            return;
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
            }
            else {
                alert('Failed to add item: ' + data.message);
            }
        }
        catch (error) {
            alert('Failed to add item. Please try again.');
        }
        finally {
            setSaving(false);
        }
    };
    const handleEditItem = (item) => {
        setEditingItem(item);
        setShowEditModal(true);
    };
    const handleUpdateItem = async () => {
        if (!editingItem)
            return;
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
                setInventory(inventory.map(item => item._id === editingItem._id ? data.data : item));
                setShowEditModal(false);
                setEditingItem(null);
            }
            else {
                alert('Failed to update item: ' + data.message);
            }
        }
        catch (error) {
            alert('Failed to update item. Please try again.');
        }
        finally {
            setSaving(false);
        }
    };
    const handleDeleteItem = async (id) => {
        if (!confirm('Are you sure you want to delete this item?'))
            return;
        try {
            setDeleting(id);
            const res = await fetch(`${API_BASE}/business/inventory/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            const data = await res.json();
            if (data.success) {
                setInventory(inventory.filter(item => item._id !== id));
            }
            else {
                alert('Failed to delete item: ' + data.message);
            }
        }
        catch (error) {
            alert('Failed to delete item. Please try again.');
        }
        finally {
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
    const getStatusStyle = (status) => {
        switch (status) {
            case 'in-use': return 'bg-blue-500/10 text-blue-400';
            case 'in-storage': return 'bg-[#06b6d4]/10 text-[#06b6d4]';
            case 'ready-for-pickup': return 'bg-amber-500/10 text-amber-400';
            case 'scheduled': return 'bg-[#8b5cf6]/10 text-[#8b5cf6]';
            case 'recycled': return 'bg-[#10b981]/10 text-[#10b981]';
            default: return 'bg-gray-500/10 text-slate-400';
        }
    };
    const getConditionStyle = (condition) => {
        switch (condition) {
            case 'working': return 'bg-[#10b981]/10 text-[#10b981]';
            case 'non-working': return 'bg-red-500/10 text-red-400';
            case 'damaged': return 'bg-amber-500/10 text-amber-400';
            default: return 'bg-gray-500/10 text-slate-400';
        }
    };
    return (_jsx(Layout, { title: "", role: "Business", fullWidth: true, hideSidebar: true, children: _jsxs("div", { className: "bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#06b6d4] selection:text-white min-h-screen", children: [_jsxs("div", { className: "relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" }), _jsx("div", { className: "fixed bottom-0 right-0 w-full h-[500px] bg-[#06b6d4]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" }), _jsxs("div", { className: "layout-container flex h-full grow flex-col relative z-10", children: [_jsxs("header", { className: "flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50", children: [_jsxs("div", { className: "flex items-center gap-3 text-white cursor-pointer", onClick: () => navigate('/'), children: [_jsx("div", { className: "p-2 bg-[#06b6d4]/10 rounded-lg", children: _jsx("svg", { className: "h-6 w-6 text-[#06b6d4]", fill: "currentColor", viewBox: "0 0 48 48", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" }) }) }), _jsxs("h2", { className: "text-xl font-bold tracking-tight text-white", children: ["EcoCycle ", _jsx("span", { className: "text-[#06b6d4]", children: "Business" })] })] }), _jsx("nav", { className: "hidden md:flex flex-1 justify-center gap-1" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { onClick: () => navigate('/profile'), className: "hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer", children: [_jsx("div", { className: "size-8 rounded-full bg-[#06b6d4] flex items-center justify-center ring-2 ring-white/10 group-hover:ring-[#06b6d4]/50 transition-all text-white font-bold text-sm", children: user?.name?.charAt(0) || 'B' }), _jsx("span", { className: "text-sm font-medium text-gray-200", children: user?.name || 'Business' })] }), _jsx("button", { onClick: handleLogout, className: "p-2.5 rounded-full bg-[#151F26] border border-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors", title: "Logout", children: _jsx("span", { className: "material-symbols-outlined text-[20px]", children: "logout" }) })] })] }), _jsx("main", { className: "flex flex-1 justify-center py-5 mt-24", children: _jsxs("div", { className: "layout-content-container flex flex-col w-full max-w-7xl px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-end gap-6 py-8", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("button", { onClick: () => navigate('/business'), className: "text-[#94a3b8] hover:text-white transition-colors", children: _jsx("span", { className: "material-symbols-outlined text-lg", children: "arrow_back" }) }), _jsx("p", { className: "text-[#8b5cf6] text-sm font-bold uppercase tracking-widest", children: "Asset Management" })] }), _jsx("h1", { className: "text-white text-3xl sm:text-4xl font-black leading-tight tracking-tighter mb-2", children: "E-Waste Inventory" }), _jsx("p", { className: "text-[#94a3b8] text-base", children: "Track and manage your electronic waste before disposal." })] }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [selectedItems.length > 0 && (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: handleMarkReadyForPickup, disabled: saving, className: "bg-amber-500/20 text-amber-400 border border-amber-500/30 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-500/30 transition-colors flex items-center gap-2 disabled:opacity-50", children: [_jsx("span", { className: "material-symbols-outlined text-lg", children: "pending_actions" }), "Mark Ready (", selectedItems.length, ")"] }), _jsxs("button", { onClick: openPickupModal, className: "bg-[#8b5cf6] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#7c3aed] transition-colors flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-lg", children: "local_shipping" }), "Schedule Pickup (", selectedItems.length, ")"] })] })), _jsxs("button", { onClick: () => setShowAddModal(true), className: "bg-[#06b6d4] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0891b2] transition-colors flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-lg", children: "add" }), "Add Item"] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [_jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-[#06b6d4]/20 transition-all", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-[#06b6d4]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" }), _jsx("div", { className: "flex items-center justify-between mb-4 relative z-10", children: _jsx("div", { className: "p-3 bg-[#06b6d4]/10 rounded-xl text-[#06b6d4]", children: _jsx("span", { className: "material-symbols-outlined", children: "inventory_2" }) }) }), _jsx("h3", { className: "text-3xl font-black text-white relative z-10", children: stats.totalItems }), _jsx("p", { className: "text-sm text-[#94a3b8] relative z-10", children: "Items Tracked" })] }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-[#8b5cf6]/20 transition-all", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-[#8b5cf6]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" }), _jsx("div", { className: "flex items-center justify-between mb-4 relative z-10", children: _jsx("div", { className: "p-3 bg-[#8b5cf6]/10 rounded-xl text-[#8b5cf6]", children: _jsx("span", { className: "material-symbols-outlined", children: "scale" }) }) }), _jsxs("h3", { className: "text-3xl font-black text-white relative z-10", children: [stats.totalWeight.toFixed(1), " ", _jsx("span", { className: "text-lg font-medium text-gray-500", children: "kg" })] }), _jsx("p", { className: "text-sm text-[#94a3b8] relative z-10", children: "Total Weight" })] }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-amber-500/20 transition-all", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" }), _jsx("div", { className: "flex items-center justify-between mb-4 relative z-10", children: _jsx("div", { className: "p-3 bg-amber-500/10 rounded-xl text-amber-400", children: _jsx("span", { className: "material-symbols-outlined", children: "local_shipping" }) }) }), _jsx("h3", { className: "text-3xl font-black text-white relative z-10", children: stats.pendingPickup }), _jsx("p", { className: "text-sm text-[#94a3b8] relative z-10", children: "Ready for Pickup" })] })] }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4 mb-8", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx("span", { className: "material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500", children: "search" }), _jsx("input", { type: "text", placeholder: "Search by name or asset ID...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full bg-[#151F26] border border-white/5 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none transition-all" })] }), _jsxs("select", { value: filterCategory, onChange: (e) => setFilterCategory(e.target.value), className: "bg-[#151F26] border border-white/5 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none cursor-pointer", children: [_jsx("option", { value: "all", children: "All Categories" }), categories.map(cat => _jsx("option", { value: cat, children: cat }, cat))] }), _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "bg-[#151F26] border border-white/5 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none cursor-pointer", children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "in-use", children: "In Use" }), _jsx("option", { value: "in-storage", children: "In Storage" }), _jsx("option", { value: "ready-for-pickup", children: "Ready for Pickup" }), _jsx("option", { value: "scheduled", children: "Scheduled" }), _jsx("option", { value: "recycled", children: "Recycled" })] })] }), _jsx("div", { className: "bg-[#151F26] rounded-2xl border border-white/5 overflow-hidden", children: loading ? (_jsxs("div", { className: "p-12 text-center", children: [_jsx(Loader, { size: "md", color: "#06b6d4", className: "mb-4" }), _jsx("p", { className: "text-slate-400", children: "Loading inventory..." })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "hidden lg:grid grid-cols-8 gap-4 p-4 border-b border-white/5 text-sm font-medium text-gray-500", children: [_jsx("div", { className: "flex items-center gap-2", children: getReadyForPickupCount() > 0 && (_jsxs(_Fragment, { children: [_jsx("input", { type: "checkbox", checked: getReadyForPickupCount() > 0 && getSelectedReadyForPickupCount() === getReadyForPickupCount(), onChange: toggleSelectAllReadyForPickup, className: "w-4 h-4 rounded border-amber-500/50 bg-amber-500/10 text-amber-500 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer", title: "Select all ready for pickup items" }), _jsxs("span", { className: "text-xs text-amber-400 font-medium", children: ["Ready (", getReadyForPickupCount(), ")"] })] })) }), _jsx("div", { children: "Item Name" }), _jsx("div", { children: "Category" }), _jsx("div", { children: "Qty / Weight" }), _jsx("div", { children: "Condition" }), _jsx("div", { children: "Status" }), _jsx("div", { children: "Location" }), _jsx("div", { className: "text-center", children: "Actions" })] }), filteredInventory.length === 0 ? (_jsxs("div", { className: "p-12 text-center", children: [_jsx("span", { className: "material-symbols-outlined text-5xl text-gray-600 mb-4", children: "inventory_2" }), _jsx("p", { className: "text-slate-400 text-lg", children: "No items found" }), _jsx("p", { className: "text-gray-600 text-sm mt-1", children: inventory.length === 0 ? 'Add your first item to get started' : 'Try adjusting your search or filters' }), inventory.length === 0 && (_jsx("button", { onClick: () => setShowAddModal(true), className: "mt-4 bg-[#06b6d4] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0891b2] transition-colors", children: "Add First Item" }))] })) : (filteredInventory.map((item) => (_jsxs("div", { className: `grid grid-cols-1 lg:grid-cols-8 gap-4 p-4 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors items-center ${selectedItems.includes(item._id)
                                                                ? (item.status === 'ready-for-pickup' ? 'bg-amber-500/10 border-l-2 border-amber-500/50' : 'bg-[#06b6d4]/5')
                                                                : (item.status === 'ready-for-pickup' ? 'bg-amber-500/5' : '')}`, children: [_jsx("div", { className: "flex items-center", children: item.status === 'ready-for-pickup' ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: selectedItems.includes(item._id), onChange: () => toggleItemSelection(item._id), className: "w-4 h-4 rounded border-amber-500/50 bg-amber-500/10 text-amber-500 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer" }), _jsx("span", { className: "material-symbols-outlined text-amber-400 text-sm", title: "Ready for pickup", children: "local_shipping" })] })) : (_jsx("div", { className: "w-4 h-4" })) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 rounded-lg bg-[#06b6d4]/10 text-[#06b6d4]", children: _jsx("span", { className: "material-symbols-outlined text-lg", children: "devices" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-white font-semibold", children: item.itemName }), _jsx("p", { className: "text-gray-500 text-xs", children: item.assetId })] })] }), _jsxs("div", { className: "text-slate-400", children: [_jsx("span", { className: "lg:hidden text-gray-600 text-sm mr-2", children: "Category:" }), item.category] }), _jsxs("div", { className: "text-white", children: [_jsx("span", { className: "lg:hidden text-gray-600 text-sm mr-2", children: "Qty/Weight:" }), item.quantity, " \u00D7 ", item.weight, "kg"] }), _jsx("div", { children: _jsx("span", { className: `inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getConditionStyle(item.condition)}`, children: item.condition }) }), _jsx("div", { children: _jsx("span", { className: `inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(item.status)}`, children: item.status?.replace(/-/g, ' ') }) }), _jsxs("div", { className: "text-slate-400 text-sm", children: [_jsx("span", { className: "lg:hidden text-gray-600 text-sm mr-2", children: "Location:" }), item.location] }), _jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx("button", { onClick: () => handleEditItem(item), className: "p-2 rounded-lg bg-white/5 text-slate-400 hover:text-[#06b6d4] hover:bg-[#06b6d4]/10 transition-colors", title: "Edit", children: _jsx("span", { className: "material-symbols-outlined text-lg", children: "edit" }) }), _jsx("button", { onClick: () => handleDeleteItem(item._id), disabled: deleting === item._id, className: "p-2 rounded-lg bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50", title: "Delete", children: deleting === item._id ? (_jsx(Loader, { size: "sm", color: "#ef4444" })) : (_jsx("span", { className: "material-symbols-outlined text-lg", children: "delete" })) })] })] }, item._id))))] })) })] }) })] })] }), showAddModal && (_jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4", onClick: () => !saving && setShowAddModal(false), children: _jsxs("div", { className: "bg-[#151F26] rounded-3xl w-full max-w-lg border border-white/5 overflow-hidden max-h-[90vh] overflow-y-auto", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-[#151F26]", children: [_jsx("h3", { className: "text-white font-bold text-lg", children: "Add Inventory Item" }), _jsx("button", { onClick: () => !saving && setShowAddModal(false), className: "p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white", children: _jsx("span", { className: "material-symbols-outlined", children: "close" }) })] }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-400 mb-2", children: "Item Name *" }), _jsx("input", { type: "text", value: newItem.name, onChange: (e) => setNewItem({ ...newItem, name: e.target.value }), className: "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none", placeholder: "e.g., Dell PowerEdge Servers" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-400 mb-2", children: "Description" }), _jsx("textarea", { value: newItem.description, onChange: (e) => setNewItem({ ...newItem, description: e.target.value }), className: "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none resize-none", placeholder: "Additional details about the item...", rows: 2 })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-400 mb-2", children: "Category *" }), _jsx("select", { value: newItem.category, onChange: (e) => setNewItem({ ...newItem, category: e.target.value }), className: "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none cursor-pointer", children: categories.map(cat => _jsx("option", { value: cat, children: cat }, cat)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-400 mb-2", children: "Condition" }), _jsx("select", { value: newItem.condition, onChange: (e) => setNewItem({ ...newItem, condition: e.target.value }), className: "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none cursor-pointer", children: conditions.map(c => _jsx("option", { value: c, children: c }, c)) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-400 mb-2", children: "Quantity *" }), _jsx("input", { type: "number", value: newItem.quantity, onChange: (e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 }), className: "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none", min: "1" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-400 mb-2", children: "Weight per unit (kg) *" }), _jsx("input", { type: "number", value: newItem.weight, onChange: (e) => setNewItem({ ...newItem, weight: parseFloat(e.target.value) || 0 }), className: "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none", min: "0", step: "0.1" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-400 mb-2", children: "Location" }), _jsx("input", { type: "text", value: newItem.location, onChange: (e) => setNewItem({ ...newItem, location: e.target.value }), className: "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none", placeholder: "e.g., Warehouse A, Office Floor 2" })] })] }), _jsxs("div", { className: "flex gap-4 p-6 pt-0", children: [_jsx("button", { onClick: () => !saving && setShowAddModal(false), disabled: saving, className: "flex-1 bg-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors disabled:opacity-50", children: "Cancel" }), _jsx("button", { onClick: handleAddItem, disabled: !newItem.name || newItem.weight <= 0 || saving, className: "flex-1 bg-[#06b6d4] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0891b2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2", children: saving ? (_jsxs(_Fragment, { children: [_jsx(Loader, { size: "sm", color: "white" }), "Adding..."] })) : ('Add Item') })] })] }) })), showEditModal && editingItem && (_jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4", onClick: () => !saving && setShowEditModal(false), children: _jsxs("div", { className: "bg-[#151F26] rounded-3xl w-full max-w-lg border border-white/5 overflow-hidden max-h-[90vh] overflow-y-auto", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-[#151F26]", children: [_jsx("h3", { className: "text-white font-bold text-lg", children: "Edit Inventory Item" }), _jsx("button", { onClick: () => !saving && setShowEditModal(false), className: "p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white", children: _jsx("span", { className: "material-symbols-outlined", children: "close" }) })] }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsxs("div", { className: "bg-white/5 rounded-xl p-3 flex items-center gap-3", children: [_jsx("span", { className: "material-symbols-outlined text-gray-500", children: "tag" }), _jsxs("span", { className: "text-slate-400 text-sm", children: ["Asset ID: ", _jsx("span", { className: "text-white font-mono", children: editingItem.assetId })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-400 mb-2", children: "Item Name *" }), _jsx("input", { type: "text", value: editingItem.itemName, onChange: (e) => setEditingItem({ ...editingItem, itemName: e.target.value }), className: "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-400 mb-2", children: "Description" }), _jsx("textarea", { value: editingItem.description || '', onChange: (e) => setEditingItem({ ...editingItem, description: e.target.value }), className: "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none resize-none", rows: 2 })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-400 mb-2", children: "Category" }), _jsx("select", { value: editingItem.category, onChange: (e) => setEditingItem({ ...editingItem, category: e.target.value }), className: "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none cursor-pointer", children: categories.map(cat => _jsx("option", { value: cat, children: cat }, cat)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-400 mb-2", children: "Condition" }), _jsx("select", { value: editingItem.condition, onChange: (e) => setEditingItem({ ...editingItem, condition: e.target.value }), className: "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none cursor-pointer", children: conditions.map(c => _jsx("option", { value: c, children: c }, c)) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-400 mb-2", children: "Quantity" }), _jsx("input", { type: "number", value: editingItem.quantity, onChange: (e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) || 1 }), className: "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none", min: "1" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-400 mb-2", children: "Weight per unit (kg)" }), _jsx("input", { type: "number", value: editingItem.weight, onChange: (e) => setEditingItem({ ...editingItem, weight: parseFloat(e.target.value) || 0 }), className: "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none", min: "0", step: "0.1" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-400 mb-2", children: "Status" }), _jsx("select", { value: editingItem.status, onChange: (e) => setEditingItem({ ...editingItem, status: e.target.value }), className: "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none cursor-pointer", children: statuses.map(s => _jsx("option", { value: s, children: s.replace(/-/g, ' ') }, s)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-400 mb-2", children: "Location" }), _jsx("input", { type: "text", value: editingItem.location, onChange: (e) => setEditingItem({ ...editingItem, location: e.target.value }), className: "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none" })] })] })] }), _jsxs("div", { className: "flex gap-4 p-6 pt-0", children: [_jsx("button", { onClick: () => !saving && setShowEditModal(false), disabled: saving, className: "flex-1 bg-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors disabled:opacity-50", children: "Cancel" }), _jsx("button", { onClick: handleUpdateItem, disabled: !editingItem.itemName || saving, className: "flex-1 bg-[#06b6d4] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0891b2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2", children: saving ? (_jsxs(_Fragment, { children: [_jsx(Loader, { size: "sm", color: "white" }), "Saving..."] })) : ('Save Changes') })] })] }) })), showPickupModal && (_jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4", onClick: () => !bookingPickup && setShowPickupModal(false), children: _jsxs("div", { className: "bg-[#151F26] rounded-3xl w-full max-w-3xl border border-white/5 overflow-hidden max-h-[90vh] overflow-y-auto", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-[#151F26]", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-white font-bold text-lg", children: "Schedule Pickup" }), _jsxs("p", { className: "text-gray-500 text-sm", children: [selectedItems.length, " items selected \u2022 ", getSelectedTotalWeight().toFixed(1), " kg total"] })] }), _jsx("button", { onClick: () => !bookingPickup && setShowPickupModal(false), className: "p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white", children: _jsx("span", { className: "material-symbols-outlined", children: "close" }) })] }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "bg-white/5 rounded-xl p-4 max-h-40 overflow-y-auto", children: [_jsx("p", { className: "text-sm font-medium text-slate-400 mb-3", children: "Items to pickup:" }), _jsx("div", { className: "space-y-2", children: getSelectedItemsData().map(item => (_jsxs("div", { className: "flex justify-between items-center text-sm", children: [_jsx("span", { className: "text-white", children: item.itemName }), _jsxs("span", { className: "text-gray-500", children: [item.quantity, " \u00D7 ", item.weight, "kg"] })] }, item._id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-400 mb-2", children: "Select Recycling Agency *" }), loadingAgencies ? (_jsxs("div", { className: "bg-white/5 border border-white/5 rounded-xl p-4 text-center", children: [_jsx(Loader, { size: "sm", color: "#06b6d4", className: "mb-2" }), _jsx("p", { className: "text-gray-500 text-sm mt-2", children: "Loading agencies..." })] })) : agencies.length === 0 ? (_jsx("p", { className: "text-gray-500 text-sm text-center py-4 bg-white/5 rounded-xl", children: "No verified agencies available" })) : (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto pr-1", children: agencies.map(agency => (_jsxs("label", { "data-agency-select": agency._id, className: `flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${pickupData.agencyId === agency._id
                                                                ? 'border-[#06b6d4] bg-[#06b6d4]/10'
                                                                : 'border-white/5 bg-white/5 hover:border-white/20'}`, children: [_jsx("input", { type: "radio", name: "agency", value: agency._id, checked: pickupData.agencyId === agency._id, onChange: (e) => setPickupData({ ...pickupData, agencyId: e.target.value }), className: "hidden" }), _jsx("div", { className: "w-9 h-9 rounded-lg bg-[#8b5cf6]/20 flex items-center justify-center text-[#8b5cf6] font-bold text-sm", children: agency.name.charAt(0) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-white font-medium text-sm truncate", children: agency.name }), _jsxs("p", { className: "text-gray-500 text-xs truncate", children: [agency.address?.city, ", ", agency.address?.state] })] }), _jsxs("div", { className: "flex items-center gap-1 text-amber-400 shrink-0", children: [_jsx("span", { className: "material-symbols-outlined text-xs", children: "star" }), _jsx("span", { className: "text-xs font-medium", children: agency.rating?.toFixed(1) || '4.5' })] })] }, agency._id))) }), _jsx("div", { className: "relative", children: _jsx("div", { ref: pickupMapRef, className: "h-64 rounded-xl overflow-hidden border border-white/5", style: { background: '#1a2634' } }) })] }))] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-400 mb-2", children: "Pickup Date *" }), _jsx("input", { type: "date", value: pickupData.scheduledDate, onChange: (e) => setPickupData({ ...pickupData, scheduledDate: e.target.value }), min: new Date().toISOString().split('T')[0], className: "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-400 mb-2", children: "Preferred Time" }), _jsxs("select", { value: pickupData.scheduledTime, onChange: (e) => setPickupData({ ...pickupData, scheduledTime: e.target.value }), className: "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none cursor-pointer", children: [_jsx("option", { value: "09:00", children: "9:00 AM" }), _jsx("option", { value: "10:00", children: "10:00 AM" }), _jsx("option", { value: "11:00", children: "11:00 AM" }), _jsx("option", { value: "12:00", children: "12:00 PM" }), _jsx("option", { value: "14:00", children: "2:00 PM" }), _jsx("option", { value: "15:00", children: "3:00 PM" }), _jsx("option", { value: "16:00", children: "4:00 PM" }), _jsx("option", { value: "17:00", children: "5:00 PM" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-400 mb-2", children: "Special Instructions (Optional)" }), _jsx("textarea", { value: pickupData.notes, onChange: (e) => setPickupData({ ...pickupData, notes: e.target.value }), className: "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none resize-none", placeholder: "Any special handling instructions, access codes, etc...", rows: 3 })] })] }), _jsxs("div", { className: "flex gap-4 p-6 pt-0", children: [_jsx("button", { onClick: () => !bookingPickup && setShowPickupModal(false), disabled: bookingPickup, className: "flex-1 bg-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors disabled:opacity-50", children: "Cancel" }), _jsx("button", { onClick: handleBookPickup, disabled: !pickupData.agencyId || !pickupData.scheduledDate || bookingPickup, className: "flex-1 bg-[#8b5cf6] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#7c3aed] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2", children: bookingPickup ? (_jsxs(_Fragment, { children: [_jsx(Loader, { size: "sm", color: "white" }), "Scheduling..."] })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "material-symbols-outlined text-lg", children: "local_shipping" }), "Schedule Pickup"] })) })] })] }) })), _jsx("style", { children: `
          /* Leaflet container dark background */
          .leaflet-container {
            background: #0B1116 !important;
            font-family: 'Inter', sans-serif;
          }
          
          /* Custom marker wrapper */
          .pickup-marker-wrapper {
            background: transparent !important;
            border: none !important;
          }
          
          /* Marker container */
          .pickup-marker {
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .pickup-marker:hover {
            transform: scale(1.15);
          }
          .pickup-marker.selected {
            animation: pickup-bounce 1s ease-in-out infinite;
          }
          
          /* Pulse effect - cyan for Business theme */
          .pickup-marker-pulse {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 32px;
            height: 32px;
            background: rgba(6, 182, 212, 0.3);
            border-radius: 50%;
            animation: pickup-pulse 2s ease-out infinite;
          }
          .pickup-marker.selected .pickup-marker-pulse {
            background: rgba(139, 92, 246, 0.5);
            animation: pickup-pulse 1.2s ease-out infinite;
          }
          
          /* Main marker pin - cyan gradient */
          .pickup-marker-pin {
            position: relative;
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4), 0 0 0 2px rgba(255,255,255,0.2);
            transition: all 0.3s ease;
          }
          .pickup-marker:hover .pickup-marker-pin {
            box-shadow: 0 6px 20px rgba(6, 182, 212, 0.6), 0 0 0 3px rgba(255,255,255,0.3);
          }
          .pickup-marker.selected .pickup-marker-pin {
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            box-shadow: 0 6px 25px rgba(139, 92, 246, 0.6), 0 0 0 3px rgba(139, 92, 246, 0.4);
          }
          
          /* Marker icon */
          .pickup-marker-icon {
            transform: rotate(45deg);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          /* Custom popup styles */
          .pickup-custom-popup .leaflet-popup-content-wrapper {
            background: linear-gradient(180deg, #1a2730 0%, #151F26 100%);
            color: white;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 15px 40px rgba(0,0,0,0.5);
            padding: 0;
            overflow: hidden;
          }
          .pickup-custom-popup .leaflet-popup-content {
            margin: 0;
            min-width: 160px;
          }
          .pickup-custom-popup .leaflet-popup-tip-container {
            display: none;
          }
          .pickup-custom-popup .leaflet-popup-close-button {
            color: #94a3b8 !important;
            font-size: 18px !important;
            padding: 6px !important;
            right: 2px !important;
            top: 2px !important;
          }
          .pickup-custom-popup .leaflet-popup-close-button:hover {
            color: white !important;
          }
          
          /* Popup content */
          .pickup-popup {
            padding: 12px;
          }
          .pickup-popup-header {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 10px;
          }
          .pickup-popup-icon {
            font-size: 20px;
            background: rgba(6, 182, 212, 0.15);
            padding: 6px;
            border-radius: 8px;
          }
          .pickup-popup-title h3 {
            color: white;
            font-weight: 700;
            font-size: 13px;
            margin: 0 0 3px 0;
            line-height: 1.2;
          }
          .pickup-popup-location {
            color: #94a3b8;
            font-size: 11px;
          }
          .pickup-popup-stats {
            display: flex;
            gap: 12px;
            padding: 8px 0;
            border-top: 1px solid rgba(255,255,255,0.05);
            margin-bottom: 10px;
          }
          .pickup-stat {
            display: flex;
            align-items: center;
            gap: 4px;
          }
          .pickup-stat-icon {
            font-size: 12px;
          }
          .pickup-stat-value {
            color: white;
            font-size: 11px;
            font-weight: 600;
          }
          .pickup-select-btn {
            width: 100%;
            background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
            color: white;
            font-size: 11px;
            font-weight: 600;
            padding: 8px 12px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .pickup-select-btn:hover {
            transform: scale(1.02);
            box-shadow: 0 4px 15px rgba(6, 182, 212, 0.4);
          }
          
          /* Zoom controls */
          .leaflet-control-zoom {
            border: none !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4) !important;
            border-radius: 10px !important;
            overflow: hidden;
          }
          .leaflet-control-zoom a {
            background: #151F26 !important;
            color: white !important;
            border: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.05) !important;
            width: 32px !important;
            height: 32px !important;
            line-height: 32px !important;
            font-size: 16px !important;
            transition: all 0.2s ease !important;
          }
          .leaflet-control-zoom a:hover {
            background: #06b6d4 !important;
            color: white !important;
          }
          .leaflet-control-zoom-in {
            border-radius: 10px 10px 0 0 !important;
          }
          .leaflet-control-zoom-out {
            border-radius: 0 0 10px 10px !important;
            border-bottom: none !important;
          }
          
          /* Hide attribution */
          .leaflet-control-attribution {
            display: none !important;
          }
          
          /* Animations */
          @keyframes pickup-pulse {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(2);
              opacity: 0;
            }
          }
          @keyframes pickup-bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }
          @keyframes slideIn {
            from {
              transform: translateX(400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }
        ` }), notification.show && (_jsx("div", { className: "fixed top-20 right-4 z-[100] animate-slideIn", children: _jsxs("div", { className: `rounded-xl p-4 shadow-2xl border backdrop-blur-md flex items-center gap-3 min-w-[320px] ${notification.type === 'success'
                            ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]'
                            : 'bg-red-500/10 border-red-500/30 text-red-400'}`, children: [_jsx("div", { className: `p-2 rounded-lg ${notification.type === 'success' ? 'bg-[#10b981]/20' : 'bg-red-500/20'}`, children: _jsx("span", { className: "material-symbols-outlined text-2xl", children: notification.type === 'success' ? 'check_circle' : 'error' }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-semibold text-white text-sm", children: notification.type === 'success' ? 'Success!' : 'Error' }), _jsx("p", { className: "text-sm", children: notification.message })] }), _jsx("button", { onClick: () => setNotification({ show: false, type: 'success', message: '' }), className: "p-1 hover:bg-white/5 rounded transition-colors", children: _jsx("span", { className: "material-symbols-outlined text-lg", children: "close" }) })] }) }))] }) }));
};
export default BusinessInventory;
