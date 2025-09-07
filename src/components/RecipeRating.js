import React, { useState } from 'react';
import { Star, Users, MessageCircle } from 'lucide-react';

function RecipeRating({ recipe, onRate, userRating, showPortionAdjuster = false, onPortionChange }) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [adjustedServings, setAdjustedServings] = useState(recipe.servings);

  const handleStarClick = (rating) => {
    if (onRate) {
      onRate(recipe.name, rating);
    }
  };

  const handlePortionChange = (newServings) => {
    setAdjustedServings(newServings);
    if (onPortionChange) {
      onPortionChange(newServings);
    }
  };

  const renderStars = (rating, interactive = false, size = 16) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const filled = i <= (interactive ? (hoveredStar || userRating || 0) : rating);
      stars.push(
        <button
          key={i}
          className={`star ${filled ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
          onClick={() => interactive && handleStarClick(i)}
          onMouseEnter={() => interactive && setHoveredStar(i)}
          onMouseLeave={() => interactive && setHoveredStar(0)}
          disabled={!interactive}
        >
          <Star size={size} fill={filled ? 'currentColor' : 'none'} />
        </button>
      );
    }
    return stars;
  };

  const getRatingQuality = (rating) => {
    if (rating >= 4.5) return { label: 'Excellent', class: 'excellent' };
    if (rating >= 4.0) return { label: 'Very Good', class: 'very-good' };
    if (rating >= 3.0) return { label: 'Good', class: 'good' };
    if (rating >= 2.0) return { label: 'Fair', class: 'fair' };
    return { label: 'Poor', class: 'poor' };
  };

  const getPortionMultiplier = () => {
    return adjustedServings / recipe.servings;
  };

  const getAdjustedNutrition = () => {
    const multiplier = getPortionMultiplier();
    return {
      calories: Math.round(recipe.nutrition.calories * multiplier),
      protein: Math.round(recipe.nutrition.protein * multiplier),
      carbs: Math.round(recipe.nutrition.carbs * multiplier),
      fat: Math.round(recipe.nutrition.fat * multiplier),
      fiber: Math.round(recipe.nutrition.fiber * multiplier)
    };
  };

  return (
    <div className="recipe-rating-section">
      <div className="rating-display">
        <div className="average-rating">
          <div className="rating-summary">
            <span className="rating-score">{recipe.rating.toFixed(1)}</span>
            <div className="rating-details">
              <div className="stars">
                {renderStars(recipe.rating, false, 18)}
              </div>
              <div className="rating-breakdown">
                <span className="rating-text">
                  Based on <span className="total-reviews">{recipe.totalRatings} reviews</span>
                </span>
                <span className={`rating-quality ${getRatingQuality(recipe.rating).class}`}>
                  {getRatingQuality(recipe.rating).label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {onRate && (
          <div className="user-rating">
            <span className="rating-label">Your Rating</span>
            <div className="interactive-stars">
              {renderStars(userRating, true, 20)}
            </div>
            {userRating && (
              <span className="user-rating-feedback show">
                Thanks for rating!
              </span>
            )}
          </div>
        )}
      </div>

      {showPortionAdjuster && (
        <div className="portion-adjuster">
          <div className="portion-controls">
            <label className="portion-label">
              <Users size={16} />
              Servings:
            </label>
            <div className="portion-input-group">
              <button 
                onClick={() => handlePortionChange(Math.max(1, adjustedServings - 1))}
                className="portion-btn"
                disabled={adjustedServings <= 1}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="20"
                value={adjustedServings}
                onChange={(e) => handlePortionChange(parseInt(e.target.value) || 1)}
                className="portion-input"
              />
              <button 
                onClick={() => handlePortionChange(adjustedServings + 1)}
                className="portion-btn"
                disabled={adjustedServings >= 20}
              >
                +
              </button>
            </div>
          </div>

          {adjustedServings !== recipe.servings && (
            <div className="adjusted-nutrition">
              <h4>Adjusted Nutrition (per serving):</h4>
              <div className="nutrition-grid-small">
                {(() => {
                  const adjusted = getAdjustedNutrition();
                  const perServing = {
                    calories: Math.round(adjusted.calories / adjustedServings),
                    protein: Math.round(adjusted.protein / adjustedServings),
                    carbs: Math.round(adjusted.carbs / adjustedServings),
                    fat: Math.round(adjusted.fat / adjustedServings),
                    fiber: Math.round(adjusted.fiber / adjustedServings)
                  };
                  return (
                    <>
                      <span>{perServing.calories} cal</span>
                      <span>{perServing.protein}g protein</span>
                      <span>{perServing.carbs}g carbs</span>
                      <span>{perServing.fat}g fat</span>
                      <span>{perServing.fiber}g fiber</span>
                    </>
                  );
                })()}
              </div>
              <div className="total-nutrition">
                <strong>Total for {adjustedServings} servings:</strong>
                {(() => {
                  const total = getAdjustedNutrition();
                  return (
                    <span>
                      {total.calories} calories, {total.protein}g protein
                    </span>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="recipe-badges">
        {recipe.dietaryTypes.map(type => (
          <span key={type} className="dietary-badge">
            {type}
          </span>
        ))}
        {recipe.mealPrepFriendly && (
          <span className="prep-badge">Meal Prep Friendly</span>
        )}
      </div>
    </div>
  );
}

export default RecipeRating;