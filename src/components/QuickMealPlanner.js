import React, { useState } from 'react';
import { Zap, Calendar, Shuffle, Check, Plus, Clock, Users } from 'lucide-react';
import { ENHANCED_RECIPES, filterRecipesByPreferences, scoreRecipeByPreferences } from '../data/recipes';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const QUICK_TEMPLATES = [
  {
    id: 'balanced',
    name: 'Balanced Week',
    description: 'Mix of healthy proteins, vegetables, and grains',
    icon: '⚖️'
  },
  {
    id: 'quick',
    name: 'Quick & Easy',
    description: 'Meals under 30 minutes prep time',
    icon: '⚡'
  },
  {
    id: 'healthy',
    name: 'Health Focus',
    description: 'High protein, low carb, nutrient dense',
    icon: '🥗'
  },
  {
    id: 'comfort',
    name: 'Comfort Food',
    description: 'Satisfying, hearty meals for the week',
    icon: '🍲'
  }
];

function QuickMealPlanner({ mealPlan, setMealPlan, preferences, groceries }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [selectedDays, setSelectedDays] = useState(DAYS);
  const [selectedMealTypes, setSelectedMealTypes] = useState(MEAL_TYPES);

  const generateSmartPlan = async (template) => {
    setIsGenerating(true);
    setSelectedTemplate(template);
    
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const filteredRecipes = filterRecipesByPreferences(ENHANCED_RECIPES, preferences);
    const availableIngredients = groceries.map(item => item.name.toLowerCase());
    
    // Score recipes based on template preferences
    const scoredRecipes = filteredRecipes.map(recipe => {
      let templateScore = 0;
      
      switch (template.id) {
        case 'quick':
          templateScore = parseInt(recipe.prepTime) <= 20 ? 2 : 0;
          break;
        case 'healthy':
          templateScore = recipe.nutrition.protein > 20 ? 2 : 0;
          templateScore += recipe.nutrition.fiber > 5 ? 1 : 0;
          break;
        case 'comfort':
          templateScore = recipe.tags.includes('comfort-food') ? 2 : 0;
          break;
        default:
          templateScore = 1;
      }
      
      const preferenceScore = scoreRecipeByPreferences(recipe, preferences);
      const inventoryScore = recipe.ingredients.filter(ingredient =>
        availableIngredients.some(available => 
          available.includes(ingredient.toLowerCase()) || 
          ingredient.toLowerCase().includes(available)
        )
      ).length * 0.1;
      
      return {
        ...recipe,
        totalScore: templateScore + preferenceScore + inventoryScore + (recipe.rating / 5)
      };
    });
    
    // Sort by score and variety
    const sortedRecipes = scoredRecipes.sort((a, b) => b.totalScore - a.totalScore);
    
    // Generate plan ensuring variety
    const newPlan = {};
    const usedRecipes = new Set();
    
    selectedDays.forEach(day => {
      selectedMealTypes.forEach(mealType => {
        const key = `${day}-${mealType}`;
        const availableForMealType = sortedRecipes.filter(recipe => 
          recipe.type === mealType && !usedRecipes.has(recipe.name)
        );
        
        if (availableForMealType.length > 0) {
          const selectedRecipe = availableForMealType[0];
          newPlan[key] = [selectedRecipe];
          usedRecipes.add(selectedRecipe.name);
        }
      });
    });
    
    setGeneratedPlan(newPlan);
    setIsGenerating(false);
  };

  const applyGeneratedPlan = () => {
    const mealsCount = Object.keys(generatedPlan).length;
    setMealPlan(prev => ({ ...prev, ...generatedPlan }));
    setShowSuccessMessage(`🎉 Successfully applied ${mealsCount} meals to your weekly plan!`);
    setGeneratedPlan(null);
    setSelectedTemplate(null);
    
    // Clear success message after 4 seconds
    setTimeout(() => {
      setShowSuccessMessage('');
    }, 4000);
  };

  const [addedMeals, setAddedMeals] = useState(new Set());
  const [showSuccessMessage, setShowSuccessMessage] = useState('');

  const addBulkMeals = (mealType, recipes) => {
    const newPlan = { ...mealPlan };
    let addedCount = 0;
    
    selectedDays.forEach((day, index) => {
      const key = `${day}-${mealType}`;
      const recipe = recipes[index % recipes.length];
      if (recipe) {
        newPlan[key] = [...(newPlan[key] || []), recipe];
        addedCount++;
      }
    });
    
    setMealPlan(newPlan);
    
    // Show success feedback
    const recipeName = recipes[0]?.name;
    setAddedMeals(prev => new Set([...prev, `${recipeName}-${mealType}`]));
    setShowSuccessMessage(`✅ Added "${recipeName}" to ${addedCount} days for ${mealType}!`);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage('');
    }, 3000);
  };

  const getPopularRecipes = (mealType, count = 3) => {
    return filterRecipesByPreferences(ENHANCED_RECIPES, preferences)
      .filter(recipe => recipe.type === mealType)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, count);
  };

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const toggleMealType = (mealType) => {
    setSelectedMealTypes(prev => 
      prev.includes(mealType) 
        ? prev.filter(m => m !== mealType)
        : [...prev, mealType]
    );
  };

  return (
    <div className="container">
      <div className="card">
        <div className="quick-planner-header">
          <h2>
            <Zap size={24} />
            Quick Meal Planner
          </h2>
          <p>Generate your entire week in seconds with AI-powered suggestions</p>
          
          {showSuccessMessage && (
            <div className="success-message">
              {showSuccessMessage}
            </div>
          )}
        </div>

        {!generatedPlan && !isGenerating && (
          <>
            <div className="planning-options">
              <div className="option-section">
                <h3>Choose Days to Plan</h3>
                <div className="day-toggles">
                  {DAYS.map(day => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`toggle-btn ${selectedDays.includes(day) ? 'active' : ''}`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="option-section">
                <h3>Choose Meal Types</h3>
                <div className="meal-type-toggles">
                  {MEAL_TYPES.map(mealType => (
                    <button
                      key={mealType}
                      onClick={() => toggleMealType(mealType)}
                      className={`toggle-btn ${selectedMealTypes.includes(mealType) ? 'active' : ''}`}
                    >
                      {mealType}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="template-section">
              <h3>Choose Your Style</h3>
              <div className="template-grid">
                {QUICK_TEMPLATES.map(template => (
                  <button
                    key={template.id}
                    onClick={() => generateSmartPlan(template)}
                    className="template-card"
                  >
                    <span className="template-icon">{template.icon}</span>
                    <h4>{template.name}</h4>
                    <p>{template.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Add Popular Meals</h3>
              <div className="quick-meal-sections">
                {MEAL_TYPES.map(mealType => (
                  <div key={mealType} className="quick-meal-section">
                    <h4>{mealType}</h4>
                    <div className="popular-recipes">
                      {getPopularRecipes(mealType).map(recipe => (
                        <div key={recipe.name} className="popular-recipe">
                          <div className="recipe-info">
                            <h5>{recipe.name}</h5>
                            <div className="recipe-meta">
                              <span className="rating">⭐ {recipe.rating.toFixed(1)}</span>
                              <span className="time">
                                <Clock size={12} />
                                {recipe.prepTime}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => addBulkMeals(mealType, [recipe])}
                            className={`btn-add-bulk ${addedMeals.has(`${recipe.name}-${mealType}`) ? 'added' : ''}`}
                            title={`Add to all ${selectedDays.length} selected days`}
                            disabled={addedMeals.has(`${recipe.name}-${mealType}`)}
                          >
                            {addedMeals.has(`${recipe.name}-${mealType}`) ? (
                              <>
                                <Check size={14} />
                                Added!
                              </>
                            ) : (
                              <>
                                <Plus size={14} />
                                Add to Week ({selectedDays.length} days)
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {isGenerating && (
          <div className="generating-state">
            <div className="loading-animation">
              <div className="loading-spinner"></div>
            </div>
            <h3>Creating Your Perfect Meal Plan...</h3>
            <p>Analyzing your preferences, dietary needs, and available ingredients</p>
            <div className="generation-steps">
              <div className="step active">✓ Filtering recipes by dietary preferences</div>
              <div className="step active">✓ Checking ingredient availability</div>
              <div className="step active">⏳ Optimizing for {selectedTemplate?.name.toLowerCase()}</div>
              <div className="step">⏳ Ensuring variety and balance</div>
            </div>
          </div>
        )}

        {generatedPlan && (
          <div className="generated-plan">
            <div className="plan-header">
              <h3>
                <Shuffle size={20} />
                Your {selectedTemplate?.name} Plan is Ready!
              </h3>
              <p>Generated {Object.keys(generatedPlan).length} meals for {selectedDays.length} days</p>
            </div>

            <div className="plan-preview">
              {selectedDays.map(day => (
                <div key={day} className="day-preview">
                  <h4>{day}</h4>
                  <div className="day-meals">
                    {selectedMealTypes.map(mealType => {
                      const key = `${day}-${mealType}`;
                      const meals = generatedPlan[key] || [];
                      return (
                        <div key={mealType} className="meal-preview">
                          <span className="meal-type">{mealType}</span>
                          {meals.length > 0 ? (
                            <span className="meal-name">{meals[0].name}</span>
                          ) : (
                            <span className="no-meal">-</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="plan-stats">
              <div className="stat">
                <span className="stat-number">
                  {Object.values(generatedPlan).reduce((sum, meals) => 
                    sum + meals.reduce((mealSum, meal) => mealSum + meal.nutrition.calories, 0), 0
                  )}
                </span>
                <span className="stat-label">Total Calories</span>
              </div>
              <div className="stat">
                <span className="stat-number">
                  {new Set(Object.values(generatedPlan).flat().flatMap(meal => meal.ingredients)).size}
                </span>
                <span className="stat-label">Unique Ingredients</span>
              </div>
              <div className="stat">
                <span className="stat-number">
                  {Math.round(Object.values(generatedPlan).flat().reduce((sum, meal) => 
                    sum + parseInt(meal.prepTime), 0
                  ) / Object.values(generatedPlan).flat().length)}
                </span>
                <span className="stat-label">Avg Prep Time (min)</span>
              </div>
            </div>

            <div className="plan-actions">
              <button onClick={applyGeneratedPlan} className="btn btn-primary">
                <Check size={16} />
                Apply This Plan
              </button>
              <button 
                onClick={() => generateSmartPlan(selectedTemplate)} 
                className="btn btn-secondary"
              >
                <Shuffle size={16} />
                Generate Different Plan
              </button>
              <button 
                onClick={() => setGeneratedPlan(null)} 
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuickMealPlanner;