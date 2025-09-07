import React, { useState } from 'react';
import { Plus, Trash2, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

function GroceryInventory({ groceries, setGroceries }) {
  const [newItem, setNewItem] = useState('');
  const [quantity, setQuantity] = useState('');

  const addGrocery = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      setGroceries(prev => [...prev, {
        id: Date.now(),
        name: newItem.trim(),
        quantity: quantity || '1',
        dateAdded: new Date().toLocaleDateString()
      }]);
      setNewItem('');
      setQuantity('');
    }
  };

  const removeGrocery = (id) => {
    setGroceries(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    setGroceries(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  return (
    <div className="container">
      <div className="card">
        <div className="inventory-header">
          <h2>
            <Package size={24} />
            My Grocery Inventory
          </h2>
          {groceries.length > 0 && (
            <Link to="/smart-planner" className="btn btn-primary">
              Create Meal Plan from Inventory
            </Link>
          )}
        </div>

        <form onSubmit={addGrocery} className="add-grocery-form">
          <input
            type="text"
            placeholder="Add grocery item..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="input quantity-input"
          />
          <button type="submit" className="btn btn-primary">
            <Plus size={16} />
            Add
          </button>
        </form>

        {groceries.length === 0 ? (
          <div className="empty-state">
            <Package size={48} />
            <h3>No groceries added yet</h3>
            <p>Start by adding items you have at home to get personalized meal suggestions.</p>
          </div>
        ) : (
          <div className="grocery-grid">
            {groceries.map(item => (
              <div key={item.id} className="grocery-card">
                <div className="grocery-info">
                  <h4>{item.name}</h4>
                  <div className="grocery-details">
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, e.target.value)}
                      className="quantity-edit"
                    />
                    <span className="date-added">Added {item.dateAdded}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeGrocery(item.id)}
                  className="btn-remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="inventory-stats">
          <div className="stat">
            <span className="stat-number">{groceries.length}</span>
            <span className="stat-label">Items in inventory</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroceryInventory;