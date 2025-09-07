import React, { useState } from 'react';
import { User, Heart, AlertTriangle, X, Leaf } from 'lucide-react';
import { DIETARY_TYPES } from '../data/recipes';

const COMMON_ALLERGENS = [
  'nuts', 'peanuts', 'dairy', 'eggs', 'soy', 'gluten', 'shellfish', 'fish', 'sesame'
];

const COMMON_INGREDIENTS = [
  'chicken', 'beef', 'pork', 'fish', 'vegetables', 'pasta', 'rice', 'beans', 
  'cheese', 'spicy food', 'garlic', 'onions', 'mushrooms', 'tomatoes'
];

function UserPreferences({ preferences, setPreferences }) {
  const [newAllergy, setNewAllergy] = useState('');
  const [newLike, setNewLike] = useState('');
  const [newDislike, setNewDislike] = useState('');
  const [newDietaryType, setNewDietaryType] = useState('');

  const addItem = (type, item) => {
    if (item.trim()) {
      setPreferences(prev => ({
        ...prev,
        [type]: [...(prev[type] || []), item.trim().toLowerCase()]
      }));
      if (type === 'allergies') setNewAllergy('');
      if (type === 'likes') setNewLike('');
      if (type === 'dislikes') setNewDislike('');
      if (type === 'dietaryTypes') setNewDietaryType('');
    }
  };

  const removeItem = (type, item) => {
    setPreferences(prev => ({
      ...prev,
      [type]: prev[type]?.filter(i => i !== item) || []
    }));
  };

  const addQuickItem = (type, item) => {
    if (!preferences[type]?.includes(item)) {
      addItem(type, item);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="preferences-header">
          <h2>
            <User size={24} />
            Dietary Preferences
          </h2>
          <p>Help us personalize your meal suggestions</p>
        </div>

        {/* Allergies Section */}
        <div className="preference-section">
          <h3>
            <AlertTriangle size={20} />
            Allergies & Restrictions
          </h3>
          <div className="quick-add">
            {COMMON_ALLERGENS.map(allergen => (
              <button
                key={allergen}
                onClick={() => addQuickItem('allergies', allergen)}
                className={`quick-btn ${preferences.allergies?.includes(allergen) ? 'active' : ''}`}
                disabled={preferences.allergies?.includes(allergen)}
              >
                {allergen}
              </button>
            ))}
          </div>
          <div className="add-custom">
            <input
              type="text"
              placeholder="Add custom allergy..."
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem('allergies', newAllergy)}
              className="input"
            />
            <button 
              onClick={() => addItem('allergies', newAllergy)}
              className="btn btn-secondary"
            >
              Add
            </button>
          </div>
          <div className="selected-items">
            {preferences.allergies?.map(item => (
              <span key={item} className="item-tag allergy-tag">
                {item}
                <button onClick={() => removeItem('allergies', item)}>
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Likes Section */}
        <div className="preference-section">
          <h3>
            <Heart size={20} />
            Foods You Love
          </h3>
          <div className="quick-add">
            {COMMON_INGREDIENTS.map(ingredient => (
              <button
                key={ingredient}
                onClick={() => addQuickItem('likes', ingredient)}
                className={`quick-btn ${preferences.likes?.includes(ingredient) ? 'active' : ''}`}
                disabled={preferences.likes?.includes(ingredient)}
              >
                {ingredient}
              </button>
            ))}
          </div>
          <div className="add-custom">
            <input
              type="text"
              placeholder="Add something you love..."
              value={newLike}
              onChange={(e) => setNewLike(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem('likes', newLike)}
              className="input"
            />
            <button 
              onClick={() => addItem('likes', newLike)}
              className="btn btn-secondary"
            >
              Add
            </button>
          </div>
          <div className="selected-items">
            {preferences.likes?.map(item => (
              <span key={item} className="item-tag like-tag">
                {item}
                <button onClick={() => removeItem('likes', item)}>
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Dislikes Section */}
        <div className="preference-section">
          <h3>Foods You Avoid</h3>
          <div className="quick-add">
            {COMMON_INGREDIENTS.map(ingredient => (
              <button
                key={ingredient}
                onClick={() => addQuickItem('dislikes', ingredient)}
                className={`quick-btn ${preferences.dislikes?.includes(ingredient) ? 'active' : ''}`}
                disabled={preferences.dislikes?.includes(ingredient)}
              >
                {ingredient}
              </button>
            ))}
          </div>
          <div className="add-custom">
            <input
              type="text"
              placeholder="Add something you dislike..."
              value={newDislike}
              onChange={(e) => setNewDislike(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem('dislikes', newDislike)}
              className="input"
            />
            <button 
              onClick={() => addItem('dislikes', newDislike)}
              className="btn btn-secondary"
            >
              Add
            </button>
          </div>
          <div className="selected-items">
            {preferences.dislikes?.map(item => (
              <span key={item} className="item-tag dislike-tag">
                {item}
                <button onClick={() => removeItem('dislikes', item)}>
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Dietary Types Section */}
        <div className="preference-section">
          <h3>
            <Leaf size={20} />
            Dietary Preferences
          </h3>
          <div className="quick-add">
            {DIETARY_TYPES.map(dietType => (
              <button
                key={dietType}
                onClick={() => addQuickItem('dietaryTypes', dietType)}
                className={`quick-btn ${preferences.dietaryTypes?.includes(dietType) ? 'active' : ''}`}
                disabled={preferences.dietaryTypes?.includes(dietType)}
              >
                {dietType}
              </button>
            ))}
          </div>
          <div className="add-custom">
            <input
              type="text"
              placeholder="Add custom dietary preference..."
              value={newDietaryType}
              onChange={(e) => setNewDietaryType(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem('dietaryTypes', newDietaryType)}
              className="input"
            />
            <button 
              onClick={() => addItem('dietaryTypes', newDietaryType)}
              className="btn btn-secondary"
            >
              Add
            </button>
          </div>
          <div className="selected-items">
            {preferences.dietaryTypes?.map(item => (
              <span key={item} className="item-tag dietary-tag">
                {item}
                <button onClick={() => removeItem('dietaryTypes', item)}>
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPreferences;