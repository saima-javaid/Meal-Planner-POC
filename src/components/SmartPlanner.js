import React, { useState, useEffect } from 'react';
import { Lightbulb, Calendar, Check, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ENHANCED_RECIPES, filterRecipesByPreferences, scoreRecipeByPreferences } from '../data/recipes';

function SmartPlanner({ groceries, setMealPlan, preferences, mealPlan }) {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    generateSuggestions();
  }, [groceries]);

  const generateSuggestions = () => {
    const availableIngredients = groceries.map(item => 
      item.name.toLowerCase().trim()
    );

    // Filter recipes by preferences first
    const filteredRecipes = filterRecipesByPreferences(ENHANCED_RECIPES, preferences);

    const possibleRecipes = filteredRecipes.filter(recipe => {
      const matchingIngredients = recipe.ingredients.filter(ingredient =>
        availableIngredients.some(available => 
          available.includes(ingredient.toLowerCase()) || 
          ingredient.toLowerCase().includes(available)
        )
      );
      return matchingIngredients.length >= 2; // At least 2 matching ingredients
    });

    // Score recipes by ingredient match percentage and preferences
    const scoredRecipes = possibleRecipes.map(recipe => {
      const matchScore = recipe.ingredients.filter(ingredient =>
        availableIngredients.some(available => 
          available.includes(ingredient.toLowerCase()) || 
          ingredient.toLowerCase().includes(available)
        )
      ).length / recipe.ingredients.length;

      const preferenceScore = scoreRecipeByPreferences(recipe, preferences);
      
      return {
        ...recipe,
        matchScore,
        preferenceScore,
        totalScore: matchScore + preferenceScore,
        missingIngredients: recipe.ingredients.filter(ingredient =>
          !availableIngredients.some(available => 
            available.includes(ingredient.toLowerCase()) || 
            ingredient.toLowerCase().includes(available)
          )
        )
      };
    });

    setSuggestions(scoredRecipes.sort((a, b) => b.totalScore - a.totalScore));
  };

  const toggleMealSelection = (recipe) => {
    setSelectedMeals(prev => {
      const isSelected = prev.find(meal => meal.name === recipe.name);
      if (isSelected) {
        return prev.filter(meal => meal.name !== recipe.name);
      } else {
        return [...prev, recipe];
      }
    });
  };

  const [integrationMode, setIntegrationMode] = useState('add'); // 'add' or 'replace'

  const [showPreview, setShowPreview] = useState(false);
  const [previewPlan, setPreviewPlan] = useState({});

  const generateSmartDistribution = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const newMealPlan = integrationMode === 'replace' ? {} : { ...mealPlan };
    const changes = [];

    if (integrationMode === 'replace') {
      // Replace mode: distribute evenly
      selectedMeals.forEach((meal, index) => {
        const day = days[index % days.length];
        const key = `${day}-${meal.type}`;
        
        if (!newMealPlan[key]) {
          newMealPlan[key] = [];
        }
        newMealPlan[key] = [meal];
        changes.push({ day, mealType: meal.type, meal: meal.name, action: 'replaced' });
      });
    } else {
      // Smart fill mode: fill empty slots first, then add to existing
      const emptySlots = [];
      const existingSlots = [];

      // Find empty and existing slots
      days.forEach(day => {
        ['Breakfast', 'Lunch', 'Dinner', 'Snacks'].forEach(mealType => {
          const key = `${day}-${mealType}`;
          const currentMeals = newMealPlan[key] || [];
          
          if (currentMeals.length === 0) {
            emptySlots.push({ day, mealType, key });
          } else {
            existingSlots.push({ day, mealType, key, count: currentMeals.length });
          }
        });
      });

      // Distribute meals
      selectedMeals.forEach((meal, index) => {
        // First, try to fill empty slots of the same meal type
        const emptySlotOfType = emptySlots.find(slot => 
          slot.mealType === meal.type && !newMealPlan[slot.key]?.length
        );
        
        if (emptySlotOfType) {
          if (!newMealPlan[emptySlotOfType.key]) {
            newMealPlan[emptySlotOfType.key] = [];
          }
          newMealPlan[emptySlotOfType.key].push(meal);
          changes.push({ 
            day: emptySlotOfType.day, 
            mealType: emptySlotOfType.mealType, 
            meal: meal.name, 
            action: 'filled empty slot' 
          });
          return;
        }

        // If no empty slots of same type, use any empty slot
        const anyEmptySlot = emptySlots.find(slot => !newMealPlan[slot.key]?.length);
        if (anyEmptySlot) {
          if (!newMealPlan[anyEmptySlot.key]) {
            newMealPlan[anyEmptySlot.key] = [];
          }
          newMealPlan[anyEmptySlot.key].push(meal);
          changes.push({ 
            day: anyEmptySlot.day, 
            mealType: anyEmptySlot.mealType, 
            meal: meal.name, 
            action: 'filled empty slot (different type)' 
          });
          return;
        }

        // If no empty slots, add to existing (round-robin)
        const day = days[index % days.length];
        const key = `${day}-${meal.type}`;
        
        if (!newMealPlan[key]) {
          newMealPlan[key] = [];
        }
        
        // Check for duplicates
        const exists = newMealPlan[key].some(existingMeal => existingMeal.name === meal.name);
        if (!exists) {
          newMealPlan[key].push(meal);
          changes.push({ 
            day, 
            mealType: meal.type, 
            meal: meal.name, 
            action: 'added to existing' 
          });
        }
      });
    }

    return { newMealPlan, changes };
  };

  const previewChanges = () => {
    const { newMealPlan, changes } = generateSmartDistribution();
    setPreviewPlan({ plan: newMealPlan, changes });
    setShowPreview(true);
  };

  const applyChanges = () => {
    setMealPlan(previewPlan.plan);
    setShowPreview(false);
    
    // Show success message and navigate
    setTimeout(() => {
      navigate('/planner');
    }, 500);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="smart-planner-header">
          <h2>
            <Lightbulb size={24} />
            Smart Meal Suggestions
          </h2>
          <p>Based on your current grocery inventory</p>
        </div>

        {groceries.length === 0 ? (
          <div className="empty-state">
            <Lightbulb size={48} />
            <h3>No groceries in inventory</h3>
            <p>Add some groceries to your inventory to get personalized meal suggestions.</p>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="empty-state">
            <h3>No matching recipes found</h3>
            <p>Try adding more common ingredients to get better suggestions.</p>
          </div>
        ) : (
          <>
            <div className="suggestions-grid">
              {suggestions.map((recipe, index) => (
                <div 
                  key={index} 
                  className={`suggestion-card ${selectedMeals.find(m => m.name === recipe.name) ? 'selected' : ''}`}
                  onClick={() => toggleMealSelection(recipe)}
                >
                  <div className="suggestion-header">
                    <h3>{recipe.name}</h3>
                    <div className="suggestion-meta">
                      <span className="meal-type">{recipe.type}</span>
                      <span className="difficulty">{recipe.difficulty}</span>
                    </div>
                    {selectedMeals.find(m => m.name === recipe.name) && (
                      <Check size={20} className="selected-icon" />
                    )}
                  </div>
                  
                  <div className="recipe-quick-info">
                    <span className="time">
                      <Clock size={14} />
                      {recipe.prepTime}
                    </span>
                    <span className="servings">
                      <Users size={14} />
                      {recipe.servings}
                    </span>
                    <span className="calories">{recipe.nutrition.calories} cal</span>
                  </div>
                  
                  <div className="match-score">
                    <div className="score-bar">
                      <div 
                        className="score-fill" 
                        style={{ width: `${recipe.matchScore * 100}%` }}
                      ></div>
                    </div>
                    <span>{Math.round(recipe.matchScore * 100)}% ingredient match</span>
                  </div>

                  <div className="recipe-rating-preview">
                    <div className="rating-stars-small">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={`star-small ${i < Math.floor(recipe.rating) ? 'filled' : ''}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="rating-score-small">{recipe.rating.toFixed(1)}</span>
                    <span className="rating-count-small">({recipe.totalRatings})</span>
                  </div>

                  <div className="nutrition-preview">
                    <span>{recipe.nutrition.protein}g protein</span>
                    <span>{recipe.nutrition.carbs}g carbs</span>
                    <span>{recipe.nutrition.fiber}g fiber</span>
                  </div>

                  <div className="ingredients-info">
                    <p><strong>You have:</strong> {recipe.ingredients.length - recipe.missingIngredients.length} ingredients</p>
                    {recipe.missingIngredients.length > 0 && (
                      <p><strong>Need to buy:</strong> {recipe.missingIngredients.join(', ')}</p>
                    )}
                  </div>

                  <div className="recipe-tags">
                    {recipe.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="recipe-tag">{tag}</span>
                    ))}
                  </div>

                  <p className="instructions">{recipe.instructions}</p>
                </div>
              ))}
            </div>

            {selectedMeals.length > 0 && (
              <div className="selected-meals-section">
                <h3>Selected Meals ({selectedMeals.length})</h3>
                <div className="selected-meals">
                  {selectedMeals.map((meal, index) => (
                    <span key={index} className="selected-meal-tag">
                      {meal.name} ({meal.type})
                    </span>
                  ))}
                </div>
                
                {Object.keys(mealPlan).length > 0 && (
                  <div className="integration-options">
                    <h4>How should we add these meals?</h4>
                    <div className="integration-buttons">
                      <button 
                        onClick={() => setIntegrationMode('add')}
                        className={`btn ${integrationMode === 'add' ? 'btn-primary' : 'btn-secondary'}`}
                      >
                        Add to Existing Plan
                      </button>
                      <button 
                        onClick={() => setIntegrationMode('replace')}
                        className={`btn ${integrationMode === 'replace' ? 'btn-primary' : 'btn-secondary'}`}
                      >
                        Replace Current Plan
                      </button>
                    </div>
                    <p className="integration-help">
                      {integrationMode === 'add' 
                        ? 'Selected meals will be added to your current meal plan'
                        : 'Selected meals will replace your current meal plan'
                      }
                    </p>
                  </div>
                )}
                
                <button onClick={previewChanges} className="btn btn-primary">
                  <Calendar size={16} />
                  Preview Changes
                </button>
              </div>
            )}
          </>
        )}

        {showPreview && (
          <div className="modal-overlay" onClick={() => setShowPreview(false)}>
            <div className="modal preview-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Preview Meal Plan Changes</h3>
              <p>Here's what will happen when you apply these changes:</p>
              
              <div className="changes-summary">
                <h4>📋 Summary of Changes</h4>
                <div className="changes-list">
                  {previewPlan.changes?.map((change, index) => (
                    <div key={index} className="change-item">
                      <span className="change-meal">{change.meal}</span>
                      <span className="change-arrow">→</span>
                      <span className="change-location">{change.day} {change.mealType}</span>
                      <span className={`change-action ${change.action.replace(/\s+/g, '-')}`}>
                        {change.action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="preview-week">
                <h4>📅 Your Updated Week</h4>
                <div className="preview-days">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <div key={day} className="preview-day">
                      <h5>{day}</h5>
                      {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map(mealType => {
                        const key = `${day}-${mealType}`;
                        const meals = previewPlan.plan?.[key] || [];
                        const isNew = previewPlan.changes?.some(c => c.day === day && c.mealType === mealType);
                        
                        return (
                          <div key={mealType} className={`preview-meal-slot ${isNew ? 'new-change' : ''}`}>
                            <span className="meal-type-label">{mealType}:</span>
                            {meals.length === 0 ? (
                              <span className="empty-slot">Empty</span>
                            ) : (
                              <span className="meal-names">
                                {meals.map(m => m.name).join(', ')}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button onClick={applyChanges} className="btn btn-primary">
                  ✅ Apply Changes ({previewPlan.changes?.length} changes)
                </button>
                <button onClick={() => setShowPreview(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SmartPlanner;