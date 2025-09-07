import React, { useState } from 'react';
import { Plus, Trash2, ShoppingCart, Clock, Users, Info, Calendar, Zap, ChevronDown, ChevronRight } from 'lucide-react';
import { ENHANCED_RECIPES, filterRecipesByPreferences, adjustRecipePortions } from '../data/recipes';
import RecipeRating from './RecipeRating';
import { Link } from 'react-router-dom';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

function CollapsibleSection({ title, icon, children, defaultExpanded = false, headerContent }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`collapsible-section ${isExpanded ? 'expanded' : ''}`}>
      <div 
        className="section-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="section-title">
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          <span className="section-icon">{icon}</span>
          <h3>{title}</h3>
        </div>
        {headerContent && (
          <div className="section-header-content" onClick={(e) => e.stopPropagation()}>
            {headerContent()}
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="section-content">
          {children}
        </div>
      )}
    </div>
  );
}

function CollapsibleDay({ day, mealTypes, mealPlan, removeMeal, mealCount, onAddMeal }) {
  const [isExpanded, setIsExpanded] = useState(mealCount > 0 || day === new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  
  const getDayNutrition = () => {
    let totals = { calories: 0, protein: 0 };
    mealTypes.forEach(mealType => {
      const meals = mealPlan[`${day}-${mealType}`] || [];
      meals.forEach(meal => {
        if (meal.nutrition) {
          totals.calories += meal.nutrition.calories;
          totals.protein += meal.nutrition.protein;
        }
      });
    });
    return totals;
  };

  const isToday = day === new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const nutrition = getDayNutrition();

  return (
    <div className={`collapsible-day ${isToday ? 'today' : ''} ${isExpanded ? 'expanded' : ''}`}>
      <div 
        className="day-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="day-info">
          <div className="day-title">
            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            <h3>{day} {isToday && <span className="today-badge">Today</span>}</h3>
          </div>
          <div className="day-summary">
            <span className="meal-count">{mealCount} meal{mealCount !== 1 ? 's' : ''}</span>
            {nutrition.calories > 0 && (
              <span className="day-calories">{nutrition.calories} cal</span>
            )}
          </div>
        </div>
        <div className="day-actions">
          <button 
            className="btn-add-day"
            onClick={(e) => {
              e.stopPropagation();
              onAddMeal('Breakfast');
            }}
            title="Add meal to this day"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="day-content">
          {mealTypes.map(mealType => {
            const meals = mealPlan[`${day}-${mealType}`] || [];
            return (
              <div key={mealType} className="meal-type-section">
                <div className="meal-type-header">
                  <h4>{mealType}</h4>
                  <button 
                    className="btn-add-meal-type"
                    onClick={() => onAddMeal(mealType)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                
                {meals.length === 0 ? (
                  <div className="empty-meal-slot">
                    <span>No {mealType.toLowerCase()} planned</span>
                  </div>
                ) : (
                  <div className="meals-list">
                    {meals.map((meal, index) => (
                      <div key={index} className="meal-item-compact">
                        <div className="meal-info">
                          <span className="meal-name">{meal.name}</span>
                          <div className="meal-meta">
                            {meal.nutrition && (
                              <span className="meal-calories">{meal.nutrition.calories} cal</span>
                            )}
                            <span className="meal-time">{meal.prepTime}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeMeal(day, mealType, index)}
                          className="btn-remove-compact"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MealPlanner({ mealPlan, setMealPlan, preferences, groceries, scheduledDelivery }) {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [showRecipes, setShowRecipes] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [userRatings, setUserRatings] = useState({});
  const [portionAdjustments, setPortionAdjustments] = useState({});

  const addMeal = (recipe, customServings = null) => {
    const key = `${selectedDay}-${selectedMealType}`;
    const finalRecipe = customServings ? adjustRecipePortions(recipe, customServings) : recipe;
    
    setMealPlan(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), finalRecipe]
    }));
    setShowRecipes(false);
  };

  const handleRateRecipe = (recipeName, rating) => {
    setUserRatings(prev => ({
      ...prev,
      [recipeName]: rating
    }));
  };

  const removeMeal = (day, mealType, index) => {
    const key = `${day}-${mealType}`;
    setMealPlan(prev => ({
      ...prev,
      [key]: prev[key]?.filter((_, i) => i !== index) || []
    }));
  };

  const generateCategorizedGroceryList = () => {
    const allIngredients = new Set();
    const recipeMap = new Map(); // Track which recipes need each ingredient
    
    // Collect all ingredients from meal plan
    Object.values(mealPlan).forEach(meals => {
      meals.forEach(meal => {
        meal.ingredients.forEach(ingredient => {
          const key = ingredient.toLowerCase().trim();
          allIngredients.add(ingredient);
          
          if (!recipeMap.has(key)) {
            recipeMap.set(key, []);
          }
          recipeMap.get(key).push(meal.name);
        });
      });
    });

    // Check what we already have in inventory
    const availableIngredients = new Set(
      (groceries || []).map(item => item.name.toLowerCase().trim())
    );

    // Check what's in scheduled delivery
    const deliveryIngredients = new Set(
      scheduledDelivery?.items?.map(item => item.name.toLowerCase().trim()) || []
    );

    // Categorize ingredients
    const inInventory = [];
    const needToBuy = [];
    const onTheWay = [];

    Array.from(allIngredients).forEach(ingredient => {
      const key = ingredient.toLowerCase().trim();
      const usedInRecipes = [...new Set(recipeMap.get(key) || [])];
      
      const ingredientData = {
        name: ingredient,
        usedIn: usedInRecipes,
        count: usedInRecipes.length
      };

      if (availableIngredients.has(key)) {
        inInventory.push(ingredientData);
      } else if (deliveryIngredients.has(key)) {
        onTheWay.push(ingredientData);
      } else {
        needToBuy.push(ingredientData);
      }
    });

    return { inInventory, needToBuy, onTheWay, total: allIngredients.size };
  };

  const getFilteredRecipes = () => {
    const allRecipes = filterRecipesByPreferences(ENHANCED_RECIPES, preferences);
    return allRecipes.filter(recipe => recipe.type === selectedMealType);
  };

  const getTotalNutrition = () => {
    let totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    Object.values(mealPlan).forEach(meals => {
      meals.forEach(meal => {
        if (meal.nutrition) {
          totals.calories += meal.nutrition.calories;
          totals.protein += meal.nutrition.protein;
          totals.carbs += meal.nutrition.carbs;
          totals.fat += meal.nutrition.fat;
          totals.fiber += meal.nutrition.fiber;
        }
      });
    });
    return totals;
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Weekly Meal Planner</h2>
        
        <div className="planner-header-actions">
          <Link to="/quick-planner" className="btn btn-primary quick-plan-btn">
            <Zap size={16} />
            Quick Plan Entire Week
          </Link>
        </div>

        <div className="planner-controls">
          <select 
            value={selectedDay} 
            onChange={(e) => setSelectedDay(e.target.value)}
            className="input"
          >
            {DAYS.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          
          <select 
            value={selectedMealType} 
            onChange={(e) => setSelectedMealType(e.target.value)}
            className="input"
          >
            {MEAL_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <button 
            onClick={() => setShowRecipes(true)} 
            className="btn btn-secondary"
          >
            <Plus size={16} />
            Add Single Meal
          </button>
        </div>

        <div className="collapsible-meal-planner">
          {DAYS.map(day => {
            const dayMeals = MEAL_TYPES.reduce((count, mealType) => {
              return count + (mealPlan[`${day}-${mealType}`]?.length || 0);
            }, 0);
            
            return (
              <CollapsibleDay
                key={day}
                day={day}
                mealTypes={MEAL_TYPES}
                mealPlan={mealPlan}
                removeMeal={removeMeal}
                mealCount={dayMeals}
                onAddMeal={(mealType) => {
                  setSelectedDay(day);
                  setSelectedMealType(mealType);
                  setShowRecipes(true);
                }}
              />
            );
          })}
        </div>

        <div className="planner-actions">
          <Link to="/meal-schedule" className="btn btn-primary">
            <Calendar size={16} />
            Schedule Meals
          </Link>
          <Link to="/meal-prep" className="btn btn-secondary">
            <Calendar size={16} />
            Plan Meal Prep
          </Link>
          <Link to="/grocery-manager" className="btn btn-secondary">
            <ShoppingCart size={16} />
            Smart Grocery List
          </Link>
        </div>

        <CollapsibleSection
          title="Weekly Nutrition Summary"
          icon="📊"
          defaultExpanded={false}
        >
          <div className="nutrition-grid">
            {(() => {
              const totals = getTotalNutrition();
              return (
                <>
                  <div className="nutrition-item">
                    <span className="nutrition-value">{totals.calories}</span>
                    <span className="nutrition-label">Calories</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-value">{totals.protein}g</span>
                    <span className="nutrition-label">Protein</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-value">{totals.carbs}g</span>
                    <span className="nutrition-label">Carbs</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-value">{totals.fat}g</span>
                    <span className="nutrition-label">Fat</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-value">{totals.fiber}g</span>
                    <span className="nutrition-label">Fiber</span>
                  </div>
                </>
              );
            })()}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Smart Grocery List"
          icon="🛒"
          defaultExpanded={false}
          headerContent={() => {
            const { inInventory, needToBuy, onTheWay, total } = generateCategorizedGroceryList();
            return (
              <div className="grocery-stats-summary">
                <span className="stat-badge total">{total} total</span>
                <span className="stat-badge have">{inInventory.length} have</span>
                {onTheWay.length > 0 && (
                  <span className="stat-badge delivery">{onTheWay.length} coming</span>
                )}
                <span className="stat-badge need">{needToBuy.length} need</span>
                {needToBuy.length > 0 && (
                  <Link to="/grocery-manager" className="quick-action-btn">
                    Order Now
                  </Link>
                )}
              </div>
            );
          }}
        >

          {(() => {
            const { inInventory, needToBuy, onTheWay } = generateCategorizedGroceryList();
            
            if (inInventory.length === 0 && needToBuy.length === 0 && onTheWay.length === 0) {
              return (
                <div className="empty-grocery-list">
                  <p>No meals planned yet. Add some meals to generate your grocery list!</p>
                </div>
              );
            }

            return (
              <div className="categorized-grocery-list">
                {onTheWay.length > 0 && scheduledDelivery && (
                  <div className="grocery-category on-the-way">
                    <div className="category-header">
                      <h4>🚚 On the Way ({onTheWay.length} items)</h4>
                      <div className="delivery-info-compact">
                        <span className="delivery-service">{scheduledDelivery.service.name}</span>
                        <span className="delivery-time">Arriving in {scheduledDelivery.service.deliveryTime}</span>
                      </div>
                    </div>
                    <div className="delivery-progress-mini">
                      <div className="progress-bar-mini">
                        <div className="progress-fill-mini"></div>
                      </div>
                      <span className="delivery-status-text">Order confirmed • Preparing for delivery</span>
                    </div>
                    <div className="grocery-items">
                      {onTheWay.map((item, index) => (
                        <div key={index} className="grocery-item-detailed delivery">
                          <span className="ingredient-name">{item.name}</span>
                          <div className="ingredient-meta">
                            <span className="recipe-count">Used in {item.count} recipe{item.count > 1 ? 's' : ''}</span>
                            <span className="recipe-list" title={item.usedIn.join(', ')}>
                              {item.usedIn.slice(0, 2).join(', ')}
                              {item.usedIn.length > 2 && ` +${item.usedIn.length - 2} more`}
                            </span>
                          </div>
                          <div className="delivery-badge">
                            <span>📦 ${scheduledDelivery.items.find(dItem => 
                              dItem.name.toLowerCase() === item.name.toLowerCase()
                            )?.estimated_price.toFixed(2) || '0.00'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {needToBuy.length > 0 && (
                  <div className="grocery-category need-to-buy">
                    <div className="category-header">
                      <h4>🛒 Need to Buy ({needToBuy.length} items)</h4>
                      <Link to="/grocery-manager" className="category-action-btn">
                        Order Delivery
                      </Link>
                    </div>
                    <div className="grocery-items">
                      {needToBuy.map((item, index) => (
                        <div key={index} className="grocery-item-detailed need">
                          <span className="ingredient-name">{item.name}</span>
                          <div className="ingredient-meta">
                            <span className="recipe-count">Used in {item.count} recipe{item.count > 1 ? 's' : ''}</span>
                            <span className="recipe-list" title={item.usedIn.join(', ')}>
                              {item.usedIn.slice(0, 2).join(', ')}
                              {item.usedIn.length > 2 && ` +${item.usedIn.length - 2} more`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {inInventory.length > 0 && (
                  <div className="grocery-category in-inventory">
                    <div className="category-header">
                      <h4>✅ Already Have ({inInventory.length} items)</h4>
                      <Link to="/inventory" className="category-action-btn">
                        View Inventory
                      </Link>
                    </div>
                    <div className="grocery-items">
                      {inInventory.map((item, index) => (
                        <div key={index} className="grocery-item-detailed have">
                          <span className="ingredient-name">{item.name}</span>
                          <div className="ingredient-meta">
                            <span className="recipe-count">Used in {item.count} recipe{item.count > 1 ? 's' : ''}</span>
                            <span className="recipe-list" title={item.usedIn.join(', ')}>
                              {item.usedIn.slice(0, 2).join(', ')}
                              {item.usedIn.length > 2 && ` +${item.usedIn.length - 2} more`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </CollapsibleSection>
      </div>

      {showRecipes && (
        <div className="modal-overlay" onClick={() => setShowRecipes(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Choose a Recipe for {selectedMealType}</h3>
            <div className="recipe-list">
              {getFilteredRecipes().map((recipe, index) => (
                <div key={index} className="recipe-item" onClick={() => addMeal(recipe)}>
                  <div className="recipe-header">
                    <h4>{recipe.name}</h4>
                    <div className="recipe-meta">
                      <span className="difficulty">{recipe.difficulty}</span>
                      <span className="time">
                        <Clock size={14} />
                        {recipe.prepTime}
                      </span>
                      <span className="servings">
                        <Users size={14} />
                        {recipe.servings}
                      </span>
                    </div>
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
                  
                  <div className="recipe-nutrition">
                    <span>{recipe.nutrition.calories} cal</span>
                    <span>{recipe.nutrition.protein}g protein</span>
                    <span>{recipe.nutrition.carbs}g carbs</span>
                  </div>
                  
                  <p className="recipe-ingredients">
                    <strong>Ingredients:</strong> {recipe.ingredients.join(', ')}
                  </p>
                  
                  <div className="recipe-tags">
                    {recipe.tags.map(tag => (
                      <span key={tag} className="recipe-tag">{tag}</span>
                    ))}
                  </div>
                  
                  <button 
                    className="recipe-info-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRecipe(recipe);
                    }}
                  >
                    <Info size={14} />
                    View Details
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => setShowRecipes(false)} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      {selectedRecipe && (
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="modal recipe-detail-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedRecipe.name}</h2>
            
            <div className="recipe-detail-header">
              <div className="recipe-times">
                <span><Clock size={16} /> Prep: {selectedRecipe.prepTime}</span>
                <span><Clock size={16} /> Cook: {selectedRecipe.cookTime}</span>
                <span><Users size={16} /> Serves: {selectedRecipe.servings}</span>
              </div>
              <span className="difficulty-badge">{selectedRecipe.difficulty}</span>
            </div>

            <RecipeRating 
              recipe={selectedRecipe}
              onRate={handleRateRecipe}
              userRating={userRatings[selectedRecipe.name]}
              showPortionAdjuster={true}
              onPortionChange={(servings) => setPortionAdjustments(prev => ({
                ...prev,
                [selectedRecipe.name]: servings
              }))}
            />

            <div className="recipe-detail-content">
              <div className="recipe-section">
                <h4>Nutrition (per serving)</h4>
                <div className="nutrition-detail">
                  <span>Calories: {selectedRecipe.nutrition.calories}</span>
                  <span>Protein: {selectedRecipe.nutrition.protein}g</span>
                  <span>Carbs: {selectedRecipe.nutrition.carbs}g</span>
                  <span>Fat: {selectedRecipe.nutrition.fat}g</span>
                  <span>Fiber: {selectedRecipe.nutrition.fiber}g</span>
                </div>
              </div>

              <div className="recipe-section">
                <h4>Ingredients</h4>
                <ul className="ingredients-list">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="recipe-section">
                <h4>Instructions</h4>
                <p className="instructions-text">{selectedRecipe.instructions}</p>
              </div>

              {selectedRecipe.allergens.length > 0 && (
                <div className="recipe-section">
                  <h4>Contains Allergens</h4>
                  <div className="allergen-tags">
                    {selectedRecipe.allergens.map(allergen => (
                      <span key={allergen} className="allergen-tag">{allergen}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="recipe-detail-actions">
              <button 
                onClick={() => {
                  const customServings = portionAdjustments[selectedRecipe.name];
                  addMeal(selectedRecipe, customServings);
                  setSelectedRecipe(null);
                }}
                className="btn btn-primary"
              >
                Add to Meal Plan
                {portionAdjustments[selectedRecipe.name] && 
                  ` (${portionAdjustments[selectedRecipe.name]} servings)`
                }
              </button>
              <button onClick={() => setSelectedRecipe(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MealPlanner;