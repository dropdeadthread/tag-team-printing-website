import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

const ADMIN_PASSWORD = "2StaceyS>@ne"; // Change this to your real password

const OrderManagementAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', notes: '', trackingNumber: '' });

  const statusOptions = [
    { value: 'pending', label: 'Order Received', color: '#f59e0b' },
    { value: 'artwork-review', label: 'Artwork Review', color: '#8b5cf6' },
    { value: 'approved', label: 'Approved for Production', color: '#10b981' },
    { value: 'in-production', label: 'In Production', color: '#3b82f6' },
    { value: 'completed', label: 'Production Complete', color: '#059669' },
    { value: 'shipped', label: 'Shipped', color: '#0891b2' },
    { value: 'delivered', label: 'Delivered', color: '#065f46' },
    { value: 'cancelled', label: 'Cancelled', color: '#dc2626' }
  ];

  useEffect(() => {
    // Simple localStorage token check
    const token = window.localStorage.getItem("adminToken");
    if (token === ADMIN_PASSWORD) setIsAdmin(true);
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    fetchOrders();
  }, [isAdmin]);

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      window.localStorage.setItem("adminToken", passwordInput);
    } else {
      alert("Incorrect password");
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Since we can't easily fetch all orders without an email filter,
      // we'll need to implement an admin-specific endpoint
      const response = await fetch('/api/admin-list-orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId) => {
    if (!statusUpdate.status) {
      alert('Please select a status');
      return;
    }

    try {
      setUpdatingOrder(orderId);
      
      const response = await fetch('/api/update-order-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          newStatus: statusUpdate.status,
          notes: statusUpdate.notes,
          trackingNumber: statusUpdate.trackingNumber
        })
      });

      if (response.ok) {
        alert('Order status updated successfully!');
        fetchOrders(); // Refresh the list
        setStatusUpdate({ status: '', notes: '', trackingNumber: '' });
      } else {
        const error = await response.json();
        alert(`Error updating status: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    } finally {
      setUpdatingOrder(null);
    }
  };

  if (!isAdmin) {
    return (
      <Layout>
        <div style={{ 
          maxWidth: '400px', 
          margin: '4rem auto', 
          padding: '2rem',
          background: '#f9f9f9',
          borderRadius: '8px',
          border: '2px solid #000'
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin Login</h1>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="password"
              placeholder="Admin Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #000',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#c32b14',
              color: 'white',
              border: '2px solid #000',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Order Management</h1>
          <button
            onClick={() => {
              setIsAdmin(false);
              localStorage.removeItem("adminToken");
            }}
            style={{
              padding: '0.5rem 1rem',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ 
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #c32b14',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p>Loading orders...</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <p><strong>Total Orders:</strong> {orders.length}</p>
              <button
                onClick={fetchOrders}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginLeft: '1rem'
                }}
              >
                Refresh
              </button>
            </div>

            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>No orders found.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {orders.map(order => {
                  const currentStatusOption = statusOptions.find(s => s.value === order.status);
                  
                  return (
                    <div key={order.id} style={{
                      background: 'white',
                      border: '2px solid #000',
                      borderRadius: '8px',
                      padding: '1.5rem'
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ margin: '0 0 0.5rem 0', color: '#c32b14' }}>{order.id}</h3>
                          <p><strong>Customer:</strong> {order.customerName || order.customer?.name}</p>
                          <p><strong>Email:</strong> {order.customerEmail || order.customer?.email}</p>
                          <p><strong>Date:</strong> {new Date(order.timestamp).toLocaleDateString()}</p>
                        </div>
                        
                        <div>
                          <p><strong>Current Status:</strong></p>
                          <span style={{
                            background: currentStatusOption?.color || '#6b7280',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                            fontWeight: 'bold'
                          }}>
                            {currentStatusOption?.label || order.status}
                          </span>
                          <p style={{ marginTop: '0.5rem' }}>
                            <strong>Total:</strong> ${order.total || 'TBD'}
                          </p>
                        </div>
                        
                        <div>
                          <p><strong>Update Status:</strong></p>
                          <select
                            value={statusUpdate.status}
                            onChange={(e) => setStatusUpdate({...statusUpdate, status: e.target.value})}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                              marginBottom: '0.5rem'
                            }}
                          >
                            <option value="">Select new status...</option>
                            {statusOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          
                          <input
                            type="text"
                            placeholder="Notes (optional)"
                            value={statusUpdate.notes}
                            onChange={(e) => setStatusUpdate({...statusUpdate, notes: e.target.value})}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                              marginBottom: '0.5rem'
                            }}
                          />
                          
                          {statusUpdate.status === 'shipped' && (
                            <input
                              type="text"
                              placeholder="Tracking number"
                              value={statusUpdate.trackingNumber}
                              onChange={(e) => setStatusUpdate({...statusUpdate, trackingNumber: e.target.value})}
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                marginBottom: '0.5rem'
                              }}
                            />
                          )}
                          
                          <button
                            onClick={() => handleStatusUpdate(order.id)}
                            disabled={updatingOrder === order.id || !statusUpdate.status}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              background: updatingOrder === order.id ? '#6b7280' : '#c32b14',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: updatingOrder === order.id ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {updatingOrder === order.id ? 'Updating...' : 'Update Status'}
                          </button>
                        </div>
                      </div>
                      
                      {order.notes && (
                        <div style={{ 
                          background: '#f9f9f9', 
                          padding: '1rem', 
                          borderRadius: '4px',
                          marginTop: '1rem'
                        }}>
                          <strong>Notes:</strong> {order.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  );
};

export default OrderManagementAdmin;