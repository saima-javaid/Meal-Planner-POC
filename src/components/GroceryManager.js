import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Check, X, Truck, Calendar, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DELIVERY_SERVICES = [
  {
    id: 'instacart',
    name: 'Instacart',
    logo: '🛒',
    deliveryTime: '1-2 hours',
    minOrder: 35,
    deliveryFee: 3.99,
    color: '#22c55e'
  },
  {
    id: 'amazon-fresh',
    name: 'Amazon Fresh',
    logo: '📦',
    deliveryTime: '2-4 hours',
    minOrder: 35,
    deliveryFee: 0,
    color: '#ff9500'
  },
  {
    id: 'walmart',
    name: 'Walmart Grocery',
    logo: '🏪',
    deliveryTime: '1-3 hours',
    minOrder: 35,
    deliveryFee: 9.95,
    color: '#004c91'
  },
  {
    id: 'target',
    name: 'Target Shipt',
    logo: '🎯',
    deliveryTime: '1-2 hours',
    minOrder: 35,
    deliveryFee: 7.99,
    color: '#cc0000'
  }
];

function GroceryManager({ groceries, setGroceries, mealPlan, scheduledDelivery, setScheduledDelivery }) {
  const [shoppingList, setShoppingList] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  // Generate shopping list from meal plan
  useEffect(() => {
    const generateShoppingList = () => {
      const neededIngredients = new Map();

      // Collect all ingredients from meal plan
      Object.values(mealPlan).forEach(meals => {
        meals.forEach(meal => {
          meal.ingredients.forEach(ingredient => {
            const key = ingredient.toLowerCase().trim();
            neededIngredients.set(key, {
              name: ingredient,
              needed: true,
              fromRecipes: neededIngredients.get(key)?.fromRecipes || []
            });
            neededIngredients.get(key).fromRecipes.push(meal.name);
          });
        });
      });

      // Check what we already have
      const availableIngredients = new Set(
        groceries.map(item => item.name.toLowerCase().trim())
      );

      // Create shopping list for missing items
      const shoppingItems = Array.from(neededIngredients.entries())
        .filter(([key]) => !availableIngredients.has(key))
        .map(([key, data]) => ({
          id: key,
          name: data.name,
          quantity: '1',
          category: getCategoryForIngredient(data.name),
          fromRecipes: [...new Set(data.fromRecipes)],
          checked: false,
          estimated_price: getEstimatedPrice(data.name)
        }));

      setShoppingList(shoppingItems);
    };

    generateShoppingList();
  }, [mealPlan, groceries]);

  const getCategoryForIngredient = (ingredient) => {
    const categories = {
      'Produce': ['tomato', 'lettuce', 'onion', 'garlic', 'lemon', 'avocado', 'banana', 'apple', 'broccoli', 'carrot', 'bell pepper', 'cucumber', 'spinach', 'sweet potato'],
      'Meat & Seafood': ['chicken', 'beef', 'salmon', 'turkey', 'bacon', 'ham'],
      'Dairy': ['milk', 'cheese', 'butter', 'yogurt', 'feta'],
      'Pantry': ['rice', 'pasta', 'quinoa', 'oats', 'flour', 'oil', 'salt', 'pepper', 'soy sauce'],
      'Nuts & Seeds': ['almonds', 'walnuts', 'peanut butter', 'nuts'],
      'Other': []
    };

    const ingredientLower = ingredient.toLowerCase();
    for (const [category, items] of Object.entries(categories)) {
      if (items.some(item => ingredientLower.includes(item) || item.includes(ingredientLower))) {
        return category;
      }
    }
    return 'Other';
  };

  const getEstimatedPrice = (ingredient) => {
    const prices = {
      'tomato': 2.99, 'lettuce': 1.99, 'chicken': 8.99, 'beef': 12.99,
      'salmon': 15.99, 'milk': 3.49, 'cheese': 4.99, 'rice': 2.49,
      'pasta': 1.99, 'bread': 2.99, 'eggs': 3.99, 'butter': 4.49
    };

    const ingredientLower = ingredient.toLowerCase();
    for (const [item, price] of Object.entries(prices)) {
      if (ingredientLower.includes(item)) return price;
    }
    return Math.random() * 5 + 1; // Random price between $1-6
  };

  const toggleShoppingItem = (itemId) => {
    setShoppingList(prev => prev.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    ));
  };

  const addToInventory = (item) => {
    setGroceries(prev => [...prev, {
      id: Date.now(),
      name: item.name,
      quantity: item.quantity,
      dateAdded: new Date().toLocaleDateString(),
      category: item.category
    }]);

    // Remove from shopping list
    setShoppingList(prev => prev.filter(shoppingItem => shoppingItem.id !== item.id));
  };

  const scheduleDelivery = (service, deliveryTime) => {
    const checkedItems = shoppingList.filter(item => item.checked);
    const totalCost = checkedItems.reduce((sum, item) => sum + item.estimated_price, 0);

    setScheduledDelivery({
      service,
      items: checkedItems,
      deliveryTime,
      totalCost: totalCost + service.deliveryFee,
      scheduledAt: new Date().toISOString()
    });

    setShowDeliveryModal(false);

    // Simulate delivery completion after a short delay
    setTimeout(() => {
      checkedItems.forEach(item => addToInventory(item));
      setScheduledDelivery(null);
    }, 3000);
  };

  const getTotalEstimatedCost = () => {
    const itemsCost = shoppingList
      .filter(item => item.checked)
      .reduce((sum, item) => sum + item.estimated_price, 0);

    return selectedService ? itemsCost + selectedService.deliveryFee : itemsCost;
  };

  const groupedShoppingList = shoppingList.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
    return groups;
  }, {});

  return (
    <div className="container">
      <div className="card">
        <div className="grocery-manager-header">
          <div className="header-navigation">
            <Link to="/inventory" className="nav-quick-link">
              <Package size={16} />
              View My Inventory ({groceries.length} items)
            </Link>
            <Link to="/planner" className="nav-quick-link">
              <Calendar size={16} />
              Back to Meal Planner
            </Link>
          </div>
          <h2>
            <ShoppingCart size={24} />
            Smart Grocery Manager
          </h2>
          <p>Automatically generated from your meal plan</p>
        </div>

        {scheduledDelivery && (
          <div className="delivery-status">
            <div className="delivery-info">
              <Truck size={20} />
              <div>
                <h4>Delivery Scheduled with {scheduledDelivery.service.name}</h4>
                <p>{scheduledDelivery.items.length} items • ${scheduledDelivery.totalCost.toFixed(2)} • Arriving in {scheduledDelivery.service.deliveryTime}</p>
              </div>
            </div>
            <div className="delivery-progress">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <span>Preparing your order...</span>
            </div>
          </div>
        )}

        <div className="grocery-stats">
          <div className="stat-item">
            <span className="stat-number">{shoppingList.length}</span>
            <span className="stat-label">Items Needed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{shoppingList.filter(item => item.checked).length}</span>
            <span className="stat-label">Selected</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">${getTotalEstimatedCost().toFixed(2)}</span>
            <span className="stat-label">Estimated Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{groceries.length}</span>
            <span className="stat-label">In Inventory</span>
          </div>
        </div>

        {shoppingList.length === 0 ? (
          <div className="empty-shopping-list">
            <Package size={48} />
            <h3>All Set!</h3>
            <p>You have all ingredients needed for your meal plan.</p>
          </div>
        ) : (
          <>
            <div className="shopping-actions">
              <button
                onClick={() => {
                  setShoppingList(prev => prev.map(item => ({ ...item, checked: true })));
                }}
                className="btn btn-secondary"
              >
                Select All
              </button>
              <button
                onClick={() => {
                  setShoppingList(prev => prev.map(item => ({ ...item, checked: false })));
                }}
                className="btn btn-secondary"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowDeliveryModal(true)}
                className="btn btn-primary"
                disabled={shoppingList.filter(item => item.checked).length === 0}
              >
                <Truck size={16} />
                Order Delivery ({shoppingList.filter(item => item.checked).length} items)
              </button>
            </div>

            <div className="shopping-list">
              {Object.entries(groupedShoppingList).map(([category, items]) => (
                <div key={category} className="category-section">
                  <h3 className="category-title">{category}</h3>
                  <div className="category-items">
                    {items.map(item => (
                      <div key={item.id} className={`shopping-item ${item.checked ? 'checked' : ''}`}>
                        <div className="item-checkbox">
                          <button
                            onClick={() => toggleShoppingItem(item.id)}
                            className={`checkbox ${item.checked ? 'checked' : ''}`}
                          >
                            {item.checked && <Check size={14} />}
                          </button>
                        </div>

                        <div className="item-info">
                          <h4>{item.name}</h4>
                          <div className="item-details">
                            <span className="item-price">${item.estimated_price.toFixed(2)}</span>
                            <span className="item-recipes">
                              For: {item.fromRecipes.slice(0, 2).join(', ')}
                              {item.fromRecipes.length > 2 && ` +${item.fromRecipes.length - 2} more`}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => addToInventory(item)}
                          className="btn-add-inventory"
                          title="I already have this"
                        >
                          <Package size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showDeliveryModal && (
        <div className="modal-overlay" onClick={() => setShowDeliveryModal(false)}>
          <div className="modal delivery-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Choose Delivery Service</h3>
            <p>{shoppingList.filter(item => item.checked).length} items • Estimated total: ${getTotalEstimatedCost().toFixed(2)}</p>

            <div className="delivery-services">
              {DELIVERY_SERVICES.map(service => (
                <div
                  key={service.id}
                  className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
                  onClick={() => setSelectedService(service)}
                >
                  <div className="service-header">
                    <span className="service-logo">{service.logo}</span>
                    <div className="service-info">
                      <h4>{service.name}</h4>
                      <p>Delivery in {service.deliveryTime}</p>
                    </div>
                  </div>
                  <div className="service-details">
                    <span className="delivery-fee">
                      {service.deliveryFee === 0 ? 'Free delivery' : `$${service.deliveryFee} delivery`}
                    </span>
                    <span className="min-order">Min: ${service.minOrder}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="delivery-time-slots">
              <h4>Select Delivery Time</h4>
              <div className="time-slots">
                <button className="time-slot">ASAP</button>
                <button className="time-slot">In 2 hours</button>
                <button className="time-slot">Tomorrow morning</button>
                <button className="time-slot">Tomorrow evening</button>
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={() => selectedService && scheduleDelivery(selectedService, 'ASAP')}
                className="btn btn-primary"
                disabled={!selectedService}
              >
                <ArrowRight size={16} />
                Schedule Delivery
              </button>
              <button onClick={() => setShowDeliveryModal(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroceryManager;