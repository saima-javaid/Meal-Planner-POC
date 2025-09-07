import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Calendar, ShoppingCart, ChefHat, Home, User, Clock, Package } from 'lucide-react';
import MealPlanner from './components/MealPlanner';
import GroceryInventory from './components/GroceryInventory';
import SmartPlanner from './components/SmartPlanner';
import UserPreferences from './components/UserPreferences';
import MealPrepScheduler from './components/MealPrepScheduler';
import GroceryManager from './components/GroceryManager';
import MealScheduler from './components/MealScheduler';
import QuickMealPlanner from './components/QuickMealPlanner';
import IntegratedMealFlow from './components/IntegratedMealFlow';
import './App.css';

function App() {
  const [groceries, setGroceries] = useState([]);
  const [mealPlan, setMealPlan] = useState({});
  const [preferences, setPreferences] = useState({
    allergies: [],
    likes: [],
    dislikes: [],
    dietaryTypes: []
  });
  const [scheduledDelivery, setScheduledDelivery] = useState(null);

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="container">
            <div className="nav-brand">
              <ChefHat size={24} />
              <span>Meal Planner</span>
            </div>
            <div className="nav-links">
              <Link to="/" className="nav-link">
                <Home size={20} />
                Home
              </Link>
              <Link to="/planner" className="nav-link">
                <Calendar size={20} />
                Plan Meals
              </Link>
              <Link to="/meal-schedule" className="nav-link">
                <Clock size={20} />
                Schedule
              </Link>
              <Link to="/grocery-manager" className="nav-link">
                <ShoppingCart size={20} />
                Smart Grocery
              </Link>
              <Link to="/inventory" className="nav-link">
                <Package size={20} />
                My Inventory
              </Link>
              <Link to="/preferences" className="nav-link">
                <User size={20} />
                Preferences
              </Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/planner" 
              element={
                <MealPlanner 
                  mealPlan={mealPlan} 
                  setMealPlan={setMealPlan}
                  preferences={preferences}
                  groceries={groceries}
                  scheduledDelivery={scheduledDelivery}
                />
              } 
            />
            <Route 
              path="/inventory" 
              element={
                <GroceryInventory 
                  groceries={groceries} 
                  setGroceries={setGroceries} 
                />
              } 
            />
            <Route 
              path="/grocery-manager" 
              element={
                <GroceryManager 
                  groceries={groceries} 
                  setGroceries={setGroceries}
                  mealPlan={mealPlan}
                  scheduledDelivery={scheduledDelivery}
                  setScheduledDelivery={setScheduledDelivery}
                />
              } 
            />
            <Route 
              path="/meal-schedule" 
              element={
                <MealScheduler 
                  mealPlan={mealPlan}
                  setMealPlan={setMealPlan}
                />
              } 
            />
            <Route 
              path="/quick-planner" 
              element={
                <QuickMealPlanner 
                  mealPlan={mealPlan}
                  setMealPlan={setMealPlan}
                  preferences={preferences}
                  groceries={groceries}
                />
              } 
            />
            <Route 
              path="/smart-planner" 
              element={
                <SmartPlanner 
                  groceries={groceries} 
                  setMealPlan={setMealPlan}
                  preferences={preferences}
                  mealPlan={mealPlan}
                />
              } 
            />
            <Route 
              path="/integrated-flow" 
              element={
                <IntegratedMealFlow 
                  mealPlan={mealPlan}
                  setMealPlan={setMealPlan}
                  groceries={groceries}
                  preferences={preferences}
                />
              } 
            />
            <Route 
              path="/preferences" 
              element={
                <UserPreferences 
                  preferences={preferences} 
                  setPreferences={setPreferences} 
                />
              } 
            />
            <Route 
              path="/meal-prep" 
              element={
                <MealPrepScheduler 
                  mealPlan={mealPlan} 
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function HomePage() {
  return (
    <div className="container">
      <div className="hero">
        <h1>Smart Meal Planning Made Easy</h1>
        <p>Plan your weekly meals, schedule cooking times, and get groceries delivered - all in one place.</p>
        
        <div className="feature-cards">
          <Link to="/integrated-flow" className="feature-card featured">
            <ChefHat size={32} />
            <h3>🌟 Complete Meal Planning</h3>
            <p>Guided workflow from planning to prep to groceries - everything in one place.</p>
          </Link>

          <Link to="/quick-planner" className="feature-card">
            <Calendar size={32} />
            <h3>Quick AI Planning</h3>
            <p>Generate entire week in seconds with smart templates and AI suggestions.</p>
          </Link>
          
          <Link to="/smart-planner" className="feature-card">
            <Package size={32} />
            <h3>Use Your Inventory</h3>
            <p>Create meals based on groceries you already have at home to reduce waste.</p>
          </Link>

          <Link to="/grocery-manager" className="feature-card">
            <ShoppingCart size={32} />
            <h3>Smart Grocery Manager</h3>
            <p>Auto-generate shopping lists and order delivery from top services.</p>
          </Link>

          <Link to="/meal-schedule" className="feature-card">
            <Clock size={32} />
            <h3>Schedule & Prep</h3>
            <p>Set meal times and organize prep tasks throughout the week.</p>
          </Link>

          <Link to="/preferences" className="feature-card">
            <User size={32} />
            <h3>Dietary Preferences</h3>
            <p>Set allergies, dietary types, and food preferences for personalized suggestions.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;