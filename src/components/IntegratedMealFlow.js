import React, { useState } from 'react';
import { ArrowRight, Check, Calendar, Zap, Package, Clock, ChefHat } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function IntegratedMealFlow({ mealPlan, setMealPlan, groceries, preferences }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [planningMethod, setPlanningMethod] = useState(null);
  const navigate = useNavigate();

  const steps = [
    { id: 1, title: 'Choose Planning Method', icon: <Zap size={20} /> },
    { id: 2, title: 'Create Meal Plan', icon: <Calendar size={20} /> },
    { id: 3, title: 'Schedule & Prep', icon: <Clock size={20} /> },
    { id: 4, title: 'Manage Groceries', icon: <Package size={20} /> }
  ];

  const planningMethods = [
    {
      id: 'quick',
      title: 'Quick AI Planning',
      description: 'Generate entire week in seconds with smart templates',
      icon: '⚡',
      pros: ['Fastest option', 'AI-powered suggestions', 'Considers preferences'],
      bestFor: 'Busy people who want instant results',
      action: () => navigate('/quick-planner')
    },
    {
      id: 'inventory',
      title: 'Use What You Have',
      description: 'Create meals based on your current grocery inventory',
      icon: '📦',
      pros: ['Reduces waste', 'Saves money', 'Uses existing ingredients'],
      bestFor: 'People who want to use up groceries',
      action: () => navigate('/smart-planner'),
      disabled: groceries.length === 0,
      disabledReason: 'Add groceries to your inventory first'
    },
    {
      id: 'manual',
      title: 'Manual Selection',
      description: 'Browse recipes and build your plan meal by meal',
      icon: '🎯',
      pros: ['Full control', 'Browse all recipes', 'Detailed customization'],
      bestFor: 'People who enjoy planning details',
      action: () => navigate('/planner')
    }
  ];

  const getCurrentMealCount = () => {
    return Object.values(mealPlan).reduce((count, meals) => count + meals.length, 0);
  };

  const getNextSteps = () => {
    const mealCount = getCurrentMealCount();
    const steps = [];

    if (mealCount === 0) {
      steps.push({
        title: 'Create Your Meal Plan',
        description: 'Choose a planning method to get started',
        action: 'Choose Method',
        priority: 'high'
      });
    } else {
      steps.push({
        title: 'Schedule Meal Times',
        description: `Set specific times for your ${mealCount} planned meals`,
        action: 'Schedule Meals',
        link: '/meal-schedule',
        priority: 'medium'
      });

      steps.push({
        title: 'Plan Meal Prep',
        description: 'Organize prep tasks throughout the week',
        action: 'Plan Prep',
        link: '/meal-prep',
        priority: 'medium'
      });

      steps.push({
        title: 'Get Groceries',
        description: 'Generate shopping list and order delivery',
        action: 'Manage Groceries',
        link: '/grocery-manager',
        priority: 'high'
      });
    }

    return steps;
  };

  return (
    <div className="container">
      <div className="card">
        <div className="integrated-flow-header">
          <h2>
            <ChefHat size={24} />
            Complete Meal Planning Workflow
          </h2>
          <p>Your all-in-one solution for meal planning, prep, and grocery management</p>
        </div>

        {/* Progress Steps */}
        <div className="workflow-steps">
          {steps.map((step, index) => (
            <div key={step.id} className={`workflow-step ${currentStep >= step.id ? 'completed' : ''}`}>
              <div className="step-icon">
                {currentStep > step.id ? <Check size={16} /> : step.icon}
              </div>
              <span className="step-title">{step.title}</span>
              {index < steps.length - 1 && (
                <ArrowRight size={16} className="step-arrow" />
              )}
            </div>
          ))}
        </div>

        {/* Current Status */}
        <div className="current-status">
          <div className="status-card">
            <h3>Your Current Progress</h3>
            <div className="status-grid">
              <div className="status-item">
                <span className="status-number">{getCurrentMealCount()}</span>
                <span className="status-label">Meals Planned</span>
              </div>
              <div className="status-item">
                <span className="status-number">{groceries.length}</span>
                <span className="status-label">Items in Inventory</span>
              </div>
              <div className="status-item">
                <span className="status-number">{preferences.allergies?.length || 0}</span>
                <span className="status-label">Dietary Restrictions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="next-steps">
          <h3>Recommended Next Steps</h3>
          <div className="steps-grid">
            {getNextSteps().map((step, index) => (
              <div key={index} className={`next-step-card ${step.priority}`}>
                <div className="step-content">
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
                <div className="step-action">
                  {step.link ? (
                    <Link to={step.link} className="btn btn-primary">
                      {step.action}
                    </Link>
                  ) : (
                    <button 
                      onClick={() => setCurrentStep(2)}
                      className="btn btn-primary"
                    >
                      {step.action}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Planning Methods (when choosing method) */}
        {currentStep === 2 && (
          <div className="planning-methods">
            <h3>Choose Your Planning Method</h3>
            <div className="methods-grid">
              {planningMethods.map(method => (
                <div 
                  key={method.id}
                  className={`method-card ${method.disabled ? 'disabled' : ''} ${planningMethod === method.id ? 'selected' : ''}`}
                  onClick={() => !method.disabled && setPlanningMethod(method.id)}
                >
                  <div className="method-header">
                    <span className="method-icon">{method.icon}</span>
                    <h4>{method.title}</h4>
                  </div>
                  
                  <p className="method-description">{method.description}</p>
                  
                  <div className="method-pros">
                    <strong>Benefits:</strong>
                    <ul>
                      {method.pros.map((pro, index) => (
                        <li key={index}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="method-best-for">
                    <strong>Best for:</strong> {method.bestFor}
                  </div>
                  
                  {method.disabled && (
                    <div className="method-disabled-reason">
                      ⚠️ {method.disabledReason}
                    </div>
                  )}
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!method.disabled) method.action();
                    }}
                    className={`btn ${method.disabled ? 'btn-disabled' : 'btn-primary'}`}
                    disabled={method.disabled}
                  >
                    {method.disabled ? 'Not Available' : 'Start Planning'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <Link to="/preferences" className="action-card">
              <span className="action-icon">⚙️</span>
              <div>
                <h4>Set Preferences</h4>
                <p>Configure dietary needs and allergies</p>
              </div>
            </Link>
            
            <Link to="/inventory" className="action-card">
              <span className="action-icon">📦</span>
              <div>
                <h4>Manage Inventory</h4>
                <p>Add groceries you have at home</p>
              </div>
            </Link>
            
            <Link to="/planner" className="action-card">
              <span className="action-icon">📅</span>
              <div>
                <h4>View Meal Plan</h4>
                <p>See your current weekly plan</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IntegratedMealFlow;