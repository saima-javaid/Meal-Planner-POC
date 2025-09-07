import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Package, CheckCircle, AlertCircle, ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PREP_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function MealPrepScheduler({ mealPlan }) {
  const navigate = useNavigate();
  const [prepSchedule, setPrepSchedule] = useState({});
  const [selectedPrepDay, setSelectedPrepDay] = useState('Sunday');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load saved schedule from localStorage on component mount
  useEffect(() => {
    const savedSchedule = localStorage.getItem('mealPrepSchedule');
    if (savedSchedule) {
      try {
        setPrepSchedule(JSON.parse(savedSchedule));
      } catch (error) {
        console.error('Error loading saved schedule:', error);
      }
    }
  }, []);

  // Save schedule to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(prepSchedule).length > 0) {
      localStorage.setItem('mealPrepSchedule', JSON.stringify(prepSchedule));
    }
  }, [prepSchedule]);

  const getMealPrepTasks = () => {
    const tasks = [];
    
    Object.entries(mealPlan).forEach(([key, meals]) => {
      const [day, mealType] = key.split('-');
      meals.forEach(meal => {
        if (meal.mealPrepFriendly) {
          tasks.push({
            id: `${key}-${meal.name}`,
            meal: meal.name,
            day,
            mealType,
            prepTime: meal.prepTime,
            cookTime: meal.cookTime,
            servings: meal.servings,
            storageInstructions: meal.storageInstructions,
            ingredients: meal.ingredients,
            difficulty: meal.difficulty
          });
        }
      });
    });
    
    return tasks;
  };

  const assignTaskToPrepDay = (taskId, prepDay) => {
    setPrepSchedule(prev => ({
      ...prev,
      [taskId]: { prepDay, completed: prev[taskId]?.completed || false }
    }));
    setHasUnsavedChanges(true);
  };

  const toggleTaskCompletion = (taskId) => {
    setPrepSchedule(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        completed: !prev[taskId]?.completed
      }
    }));
    setHasUnsavedChanges(true);
  };

  const saveSchedule = () => {
    localStorage.setItem('mealPrepSchedule', JSON.stringify(prepSchedule));
    setHasUnsavedChanges(false);
    // Show a brief success message
    const button = document.querySelector('.save-btn');
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Saved!';
      button.style.background = '#10b981';
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
      }, 2000);
    }
  };

  const clearAllSchedules = () => {
    if (window.confirm('Are you sure you want to clear all meal prep schedules? This cannot be undone.')) {
      setPrepSchedule({});
      localStorage.removeItem('mealPrepSchedule');
      setHasUnsavedChanges(false);
    }
  };

  const getTasksForDay = (prepDay) => {
    const allTasks = getMealPrepTasks();
    return allTasks.filter(task => 
      prepSchedule[task.id]?.prepDay === prepDay
    );
  };

  const getUnscheduledTasks = () => {
    const allTasks = getMealPrepTasks();
    return allTasks.filter(task => 
      !prepSchedule[task.id]?.prepDay
    );
  };

  const getTotalPrepTime = (prepDay) => {
    const tasks = getTasksForDay(prepDay);
    return tasks.reduce((total, task) => {
      const prepMinutes = parseInt(task.prepTime) || 0;
      const cookMinutes = parseInt(task.cookTime) || 0;
      return total + prepMinutes + cookMinutes;
    }, 0);
  };

  const allTasks = getMealPrepTasks();

  if (allTasks.length === 0) {
    return (
      <div className="container">
        <div className="card">
          <div className="prep-scheduler-header">
            <button 
              onClick={() => navigate('/planner')} 
              className="back-btn"
            >
              <ArrowLeft size={16} />
              Back to Meal Planner
            </button>
            <h2>
              <Calendar size={24} />
              Meal Prep Scheduler
            </h2>
          </div>
          <div className="empty-state">
            <Package size={48} />
            <h3>No Meal Prep Tasks</h3>
            <p>Add some meal prep friendly recipes to your meal plan to get started with scheduling.</p>
            <button 
              onClick={() => navigate('/planner')} 
              className="btn btn-primary"
            >
              Go to Meal Planner
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="prep-scheduler-header">
          <div className="header-top">
            <button 
              onClick={() => navigate('/planner')} 
              className="back-btn"
            >
              <ArrowLeft size={16} />
              Back to Meal Planner
            </button>
            <div className="header-actions">
              {hasUnsavedChanges && (
                <button 
                  onClick={saveSchedule}
                  className="btn btn-primary save-btn"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              )}
              <button 
                onClick={clearAllSchedules}
                className="btn btn-secondary clear-btn"
              >
                Clear All
              </button>
            </div>
          </div>
          <div className="header-content">
            <h2>
              <Calendar size={24} />
              Meal Prep Scheduler
            </h2>
            <p>Organize your meal prep tasks throughout the week</p>
          </div>
        </div>

        <div className="prep-overview">
          <div className="prep-stats">
            <div className="stat-card">
              <span className="stat-number">{allTasks.length}</span>
              <span className="stat-label">Prep Tasks</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{getUnscheduledTasks().length}</span>
              <span className="stat-label">Unscheduled</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {Object.values(prepSchedule).filter(s => s.completed).length}
              </span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </div>

        {getUnscheduledTasks().length > 0 && (
          <div className="unscheduled-section">
            <h3>
              <AlertCircle size={20} />
              Unscheduled Tasks
            </h3>
            <div className="task-list">
              {getUnscheduledTasks().map(task => (
                <div key={task.id} className="task-card unscheduled">
                  <div className="task-info">
                    <h4>{task.meal}</h4>
                    <div className="task-meta">
                      <span className="task-day">{task.day} {task.mealType}</span>
                      <span className="task-time">
                        <Clock size={14} />
                        {task.prepTime} + {task.cookTime}
                      </span>
                      <span className="task-difficulty">{task.difficulty}</span>
                    </div>
                    <p className="storage-tip">{task.storageInstructions}</p>
                  </div>
                  <div className="task-actions">
                    <select 
                      onChange={(e) => {
                        if (e.target.value) {
                          assignTaskToPrepDay(task.id, e.target.value);
                        }
                      }}
                      className="prep-day-select"
                      defaultValue=""
                    >
                      <option value="">📅 Schedule for...</option>
                      {PREP_DAYS.map(day => (
                        <option key={day} value={day}>
                          {day} ({getTasksForDay(day).length} tasks)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="prep-schedule">
          <div className="day-selector">
            {PREP_DAYS.map(day => (
              <button
                key={day}
                onClick={() => setSelectedPrepDay(day)}
                className={`day-btn ${selectedPrepDay === day ? 'active' : ''}`}
              >
                {day}
                <span className="task-count">{getTasksForDay(day).length}</span>
              </button>
            ))}
          </div>

          <div className="selected-day-tasks">
            <div className="day-header">
              <h3>{selectedPrepDay} Prep Schedule</h3>
              <div className="day-summary">
                <span className="total-time">
                  <Clock size={16} />
                  {getTotalPrepTime(selectedPrepDay)} minutes total
                </span>
                <span className="task-count">
                  {getTasksForDay(selectedPrepDay).length} tasks
                </span>
              </div>
            </div>

            <div className="task-list">
              {getTasksForDay(selectedPrepDay).map(task => (
                <div 
                  key={task.id} 
                  className={`task-card ${prepSchedule[task.id]?.completed ? 'completed' : ''}`}
                >
                  <div className="task-checkbox">
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      className={`checkbox ${prepSchedule[task.id]?.completed ? 'checked' : ''}`}
                    >
                      {prepSchedule[task.id]?.completed && <CheckCircle size={16} />}
                    </button>
                  </div>
                  
                  <div className="task-info">
                    <h4>{task.meal}</h4>
                    <div className="task-meta">
                      <span className="task-day">For {task.day} {task.mealType}</span>
                      <span className="task-time">
                        <Clock size={14} />
                        Prep: {task.prepTime}, Cook: {task.cookTime}
                      </span>
                      <span className="servings">{task.servings} servings</span>
                    </div>
                    <div className="ingredients-preview">
                      <strong>Ingredients:</strong> {task.ingredients.slice(0, 4).join(', ')}
                      {task.ingredients.length > 4 && '...'}
                    </div>
                    <p className="storage-tip">{task.storageInstructions}</p>
                  </div>

                  <div className="task-actions">
                    <select 
                      value={prepSchedule[task.id]?.prepDay || ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          assignTaskToPrepDay(task.id, e.target.value);
                        }
                      }}
                      className="prep-day-select small"
                    >
                      {PREP_DAYS.map(day => (
                        <option key={day} value={day}>
                          {day === selectedPrepDay ? `${day} (current)` : day}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        const newSchedule = { ...prepSchedule };
                        delete newSchedule[task.id];
                        setPrepSchedule(newSchedule);
                        setHasUnsavedChanges(true);
                      }}
                      className="btn-remove-schedule"
                      title="Remove from schedule"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              
              {getTasksForDay(selectedPrepDay).length === 0 && (
                <div className="empty-day">
                  <Package size={32} />
                  <p>No prep tasks scheduled for {selectedPrepDay}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MealPrepScheduler;