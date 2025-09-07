import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Bell, Plus, Edit3, Trash2 } from 'lucide-react';

const TIME_SLOTS = [
  { id: 'breakfast', label: 'Breakfast', defaultTime: '08:00', icon: '🌅' },
  { id: 'lunch', label: 'Lunch', defaultTime: '12:30', icon: '☀️' },
  { id: 'dinner', label: 'Dinner', defaultTime: '18:30', icon: '🌙' },
  { id: 'snacks', label: 'Snacks', defaultTime: '15:00', icon: '🍎' }
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function MealScheduler({ mealPlan, setMealPlan }) {
  const [mealSchedules, setMealSchedules] = useState({});
  const [notifications, setNotifications] = useState({});
  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));

  // Load saved schedules
  useEffect(() => {
    const saved = localStorage.getItem('mealSchedules');
    if (saved) {
      try {
        setMealSchedules(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading meal schedules:', error);
      }
    }
  }, []);

  // Save schedules
  useEffect(() => {
    localStorage.setItem('mealSchedules', JSON.stringify(mealSchedules));
  }, [mealSchedules]);

  const updateMealTime = (day, mealType, time) => {
    const key = `${day}-${mealType}`;
    setMealSchedules(prev => ({
      ...prev,
      [key]: { ...prev[key], time, day, mealType }
    }));
  };

  const toggleNotification = (day, mealType) => {
    const key = `${day}-${mealType}`;
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    // In a real app, this would set up actual notifications
    if (!notifications[key]) {
      console.log(`Notification set for ${mealType} on ${day}`);
    }
  };

  const getMealTime = (day, mealType) => {
    const key = `${day}-${mealType}`;
    const schedule = mealSchedules[key];
    if (schedule?.time) return schedule.time;
    
    const timeSlot = TIME_SLOTS.find(slot => slot.id.toLowerCase() === mealType.toLowerCase());
    return timeSlot?.defaultTime || '12:00';
  };

  const getUpcomingMeals = () => {
    const now = new Date();
    const today = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.toTimeString().slice(0, 5);
    
    const upcoming = [];
    
    DAYS.forEach(day => {
      TIME_SLOTS.forEach(slot => {
        const key = `${day}-${slot.label}`;
        const meals = mealPlan[key];
        if (meals && meals.length > 0) {
          const mealTime = getMealTime(day, slot.label);
          const isToday = day === today;
          const isPast = isToday && mealTime < currentTime;
          
          if (!isPast) {
            upcoming.push({
              day,
              mealType: slot.label,
              time: mealTime,
              meals,
              icon: slot.icon,
              isToday,
              key
            });
          }
        }
      });
    });
    
    return upcoming.sort((a, b) => {
      if (a.isToday && !b.isToday) return -1;
      if (!a.isToday && b.isToday) return 1;
      if (a.day !== b.day) {
        return DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
      }
      return a.time.localeCompare(b.time);
    }).slice(0, 6);
  };

  const generateWeeklySchedule = () => {
    const schedule = {};
    
    DAYS.forEach(day => {
      TIME_SLOTS.forEach(slot => {
        const key = `${day}-${slot.label}`;
        if (mealPlan[key] && mealPlan[key].length > 0) {
          schedule[key] = {
            day,
            mealType: slot.label,
            time: getMealTime(day, slot.label),
            meals: mealPlan[key],
            icon: slot.icon
          };
        }
      });
    });
    
    return schedule;
  };

  const exportToCalendar = () => {
    const schedule = generateWeeklySchedule();
    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Meal Planner//EN\n';
    
    Object.values(schedule).forEach(meal => {
      const startDate = new Date();
      // Find the next occurrence of this day
      const dayIndex = DAYS.indexOf(meal.day);
      const today = startDate.getDay() === 0 ? 6 : startDate.getDay() - 1; // Convert Sunday=0 to Monday=0
      const daysUntil = (dayIndex - today + 7) % 7;
      startDate.setDate(startDate.getDate() + daysUntil);
      
      const [hours, minutes] = meal.time.split(':');
      startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1);
      
      const formatDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };
      
      icsContent += `BEGIN:VEVENT\n`;
      icsContent += `DTSTART:${formatDate(startDate)}\n`;
      icsContent += `DTEND:${formatDate(endDate)}\n`;
      icsContent += `SUMMARY:${meal.mealType} - ${meal.meals.map(m => m.name).join(', ')}\n`;
      icsContent += `DESCRIPTION:Meal prep for ${meal.meals.length} recipe(s)\n`;
      icsContent += `END:VEVENT\n`;
    });
    
    icsContent += 'END:VCALENDAR';
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meal-schedule.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="meal-scheduler-header">
          <h2>
            <Calendar size={24} />
            Meal Scheduler
          </h2>
          <div className="scheduler-actions">
            <button onClick={exportToCalendar} className="btn btn-secondary">
              <Calendar size={16} />
              Export to Calendar
            </button>
          </div>
        </div>

        <div className="upcoming-meals">
          <h3>
            <Clock size={20} />
            Upcoming Meals
          </h3>
          <div className="upcoming-list">
            {getUpcomingMeals().map(meal => (
              <div key={meal.key} className={`upcoming-meal ${meal.isToday ? 'today' : ''}`}>
                <div className="meal-time">
                  <span className="meal-icon">{meal.icon}</span>
                  <div className="time-info">
                    <span className="time">{meal.time}</span>
                    <span className="day">{meal.isToday ? 'Today' : meal.day}</span>
                  </div>
                </div>
                <div className="meal-details">
                  <h4>{meal.mealType}</h4>
                  <p>{meal.meals.map(m => m.name).join(', ')}</p>
                </div>
                <button
                  onClick={() => toggleNotification(meal.day, meal.mealType)}
                  className={`notification-btn ${notifications[meal.key] ? 'active' : ''}`}
                >
                  <Bell size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="day-scheduler">
          <div className="day-selector">
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`day-btn ${selectedDay === day ? 'active' : ''}`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>

          <div className="day-schedule">
            <h3>{selectedDay} Schedule</h3>
            <div className="time-slots">
              {TIME_SLOTS.map(slot => {
                const key = `${selectedDay}-${slot.label}`;
                const meals = mealPlan[key] || [];
                const mealTime = getMealTime(selectedDay, slot.label);
                
                return (
                  <div key={slot.id} className="time-slot">
                    <div className="slot-header">
                      <div className="slot-info">
                        <span className="slot-icon">{slot.icon}</span>
                        <h4>{slot.label}</h4>
                      </div>
                      <div className="time-controls">
                        <input
                          type="time"
                          value={mealTime}
                          onChange={(e) => updateMealTime(selectedDay, slot.label, e.target.value)}
                          className="time-input"
                        />
                        <button
                          onClick={() => toggleNotification(selectedDay, slot.label)}
                          className={`notification-btn ${notifications[key] ? 'active' : ''}`}
                        >
                          <Bell size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="slot-meals">
                      {meals.length === 0 ? (
                        <div className="empty-slot">
                          <p>No meals planned</p>
                        </div>
                      ) : (
                        meals.map((meal, index) => (
                          <div key={index} className="scheduled-meal">
                            <div className="meal-info">
                              <h5>{meal.name}</h5>
                              <div className="meal-meta">
                                <span>{meal.prepTime} prep</span>
                                <span>{meal.servings} servings</span>
                                <span>{meal.nutrition.calories} cal</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MealScheduler;