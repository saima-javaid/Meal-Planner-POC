# Meal Planner POC

A comprehensive React-based meal planning application that helps users plan weekly meals, manage grocery inventory, schedule meal prep, and order groceries with smart recommendations.

## 🌟 Features

### Core Functionality
- **Weekly Meal Planning**: Plan meals for each day of the week across breakfast, lunch, dinner, and snacks
- **Smart Recipe Recommendations**: AI-powered suggestions based on dietary preferences and restrictions
- **Grocery Management**: Track inventory, generate shopping lists, and schedule deliveries
- **Meal Prep Scheduling**: Organize cooking tasks and meal preparation times
- **Dietary Preferences**: Support for allergies, dietary types (vegan, keto, etc.), and food preferences
- **Recipe Rating System**: Rate and review recipes with community feedback

### Smart Features
- **Integrated Workflow**: Guided experience from meal planning to grocery ordering
- **Quick AI Planning**: Generate entire weekly meal plans in seconds
- **Inventory-Based Planning**: Create meals using ingredients you already have
- **Smart Grocery Lists**: Categorized lists showing what you have, need, and what's coming
- **Nutritional Tracking**: Weekly nutrition summaries and per-meal breakdowns

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        MEAL PLANNER POC                         │
├─────────────────────────────────────────────────────────────────┤
│                     React Frontend (SPA)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Navigation    │  │   Routing       │  │   State Mgmt    │ │
│  │   (Navbar)      │  │ (React Router)  │  │   (useState)    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                        CORE COMPONENTS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  IntegratedMeal │  │   MealPlanner   │  │  QuickMeal      │ │
│  │     Flow        │  │                 │  │   Planner       │ │
│  │                 │  │ • Weekly View   │  │                 │ │
│  │ • Guided Flow   │  │ • Recipe Select │  │ • AI Templates  │ │
│  │ • Progress      │  │ • Nutrition     │  │ • Bulk Planning │ │
│  │ • Recommendations│  │ • Collapsible   │  │ • Smart Suggest │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  SmartPlanner   │  │ GroceryManager  │  │ GroceryInventory│ │
│  │                 │  │                 │  │                 │ │
│  │ • Use Inventory │  │ • Shopping List │  │ • Item Tracking │ │
│  │ • Waste Reduce  │  │ • Delivery Svc  │  │ • Expiry Dates  │ │
│  │ • Recipe Match  │  │ • Price Compare │  │ • Categories    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  MealScheduler  │  │ MealPrepScheduler│ │ UserPreferences │ │
│  │                 │  │                 │  │                 │ │
│  │ • Time Slots    │  │ • Prep Tasks    │  │ • Allergies     │ │
│  │ • Reminders     │  │ • Batch Cooking │  │ • Dietary Types │ │
│  │ • Calendar View │  │ • Time Optimize │  │ • Likes/Dislikes│ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                      SHARED COMPONENTS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐                      │
│  │  RecipeRating   │  │ CollapsibleUI   │                      │
│  │                 │  │                 │                      │
│  │ • Star Rating   │  │ • Expandable    │                      │
│  │ • User Reviews  │  │ • Section Mgmt  │                      │
│  │ • Portion Adj   │  │ • State Persist │                      │
│  └─────────────────┘  └─────────────────┘                      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                         DATA LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    recipes.js                               │ │
│  │                                                             │ │
│  │  • ENHANCED_RECIPES (12 recipes with full metadata)        │ │
│  │  • Nutrition data, allergens, dietary types                │ │
│  │  • Ratings, prep times, difficulty levels                  │ │
│  │  • Meal prep instructions, storage info                    │ │
│  │                                                             │ │
│  │  • filterRecipesByPreferences()                            │ │
│  │  • scoreRecipeByPreferences()                              │ │
│  │  • adjustRecipePortions()                                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                      EXTERNAL SERVICES                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Grocery APIs  │  │  Nutrition APIs │  │   Recipe APIs   │ │
│  │                 │  │                 │  │                 │ │
│  │ • Instacart     │  │ • Calorie Data  │  │ • Recipe Search │ │
│  │ • Amazon Fresh  │  │ • Macro Tracking│  │ • Ingredient DB │ │
│  │ • Local Stores  │  │ • Health Metrics│  │ • Cooking Times │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
KiroProject/
├── public/
│   └── index.html                 # Main HTML template
├── src/
│   ├── components/               # React components
│   │   ├── IntegratedMealFlow.js # Main workflow component
│   │   ├── MealPlanner.js        # Weekly meal planning
│   │   ├── QuickMealPlanner.js   # AI-powered quick planning
│   │   ├── SmartPlanner.js       # Inventory-based planning
│   │   ├── GroceryManager.js     # Shopping & delivery
│   │   ├── GroceryInventory.js   # Inventory tracking
│   │   ├── MealScheduler.js      # Meal timing
│   │   ├── MealPrepScheduler.js  # Prep task organization
│   │   ├── UserPreferences.js    # Dietary settings
│   │   └── RecipeRating.js       # Rating system
│   ├── data/
│   │   └── recipes.js            # Recipe database & utilities
│   ├── App.js                    # Main app component
│   ├── App.css                   # Global styles
│   ├── index.js                  # React entry point
│   └── index.css                 # Base styles
├── package.json                  # Dependencies & scripts
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd KiroProject
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner in watch mode
- `npm run test:coverage` - Runs tests with coverage report
- `npm run test:integration` - Runs integration tests only
- `npm eject` - Ejects from Create React App (one-way operation)

### Running Tests

1. **Run all tests in watch mode**
   ```bash
   npm test
   ```

2. **Run tests with coverage report**
   ```bash
   npm run test:coverage
   ```

3. **Run only integration tests**
   ```bash
   npm run test:integration
   ```

4. **View coverage report**
   After running coverage tests, open `coverage/lcov-report/index.html` in your browser

## 🎯 Usage Guide

### 1. Getting Started
- Visit the home page for an overview of all features
- Use the **Complete Meal Planning** workflow for a guided experience
- Set up your dietary preferences first for personalized recommendations

### 2. Planning Meals
- **Quick AI Planning**: Generate a full week instantly with smart templates
- **Manual Planning**: Browse recipes and build your plan meal by meal
- **Smart Planning**: Use ingredients from your inventory to reduce waste

### 3. Managing Groceries
- Add items to your inventory as you shop
- Generate smart shopping lists from your meal plans
- Schedule grocery deliveries from integrated services

### 4. Meal Prep & Scheduling
- Set specific meal times throughout the week
- Organize prep tasks to optimize cooking efficiency
- Get reminders for meal preparation

## 🔧 Technical Details

### Dependencies
- **React 18.2.0** - Core framework
- **React Router DOM 6.8.0** - Client-side routing
- **Lucide React 0.263.1** - Icon library
- **React Scripts 5.0.1** - Build tooling

### Testing
- **Jest** - Test framework
- **React Testing Library** - Component testing utilities
- **Coverage reporting** - 70% threshold for branches, functions, lines, statements
- **Integration tests** - End-to-end workflow testing

### Key Features Implementation

#### State Management
- Uses React's built-in `useState` for component state
- Props drilling for shared state between components
- Local storage persistence (can be added)

#### Recipe System
- Comprehensive recipe database with nutrition data
- Smart filtering based on dietary preferences
- Portion adjustment calculations
- Rating and review system

#### Responsive Design
- Mobile-first CSS approach
- Collapsible sections for better mobile UX
- Touch-friendly interface elements

## 🎨 UI/UX Features

- **Collapsible Sections**: Organized content with expand/collapse functionality
- **Smart Navigation**: Context-aware navigation with quick actions
- **Progress Tracking**: Visual indicators for meal planning progress
- **Categorized Lists**: Organized grocery lists (have/need/coming)
- **Nutrition Summaries**: Weekly and daily nutrition breakdowns
- **Rating System**: Interactive star ratings for recipes

## 🧪 Testing

### Test Structure
```
src/
├── components/
│   ├── MealPlanner.test.js      # Unit tests for MealPlanner
│   ├── RecipeRating.test.js     # Unit tests for RecipeRating
│   └── GroceryInventory.test.js # Unit tests for GroceryInventory
├── data/
│   └── recipes.test.js          # Unit tests for recipe utilities
├── integration/
│   └── MealPlanningFlow.test.js # Integration tests
├── App.test.js                  # App component tests
└── setupTests.js                # Test configuration
```

### Running Tests
```bash
# Run all tests in watch mode
npm test

# Run tests with coverage report
npm run test:coverage

# Run only integration tests
npm run test:integration
```

### Test Coverage
- **Unit Tests**: Component logic, utility functions, state management
- **Integration Tests**: Complete user workflows, navigation, component interaction
- **Coverage Threshold**: 70% minimum for branches, functions, lines, statements

## 🔮 Future Enhancements

### Planned Features
- **Backend Integration**: User accounts, data persistence
- **AI Recipe Generation**: Custom recipe creation based on preferences
- **Social Features**: Share meal plans, community recipes
- **Mobile App**: React Native version
- **Calendar Integration**: Sync with Google Calendar, Apple Calendar
- **Nutrition Goals**: Set and track daily nutrition targets
- **Meal History**: Track what you've cooked and liked

### Technical Improvements
- **State Management**: Redux or Context API for complex state
- **E2E Testing**: Cypress or Playwright for full user journey testing
- **Performance**: Code splitting, lazy loading, memoization
- **Accessibility**: WCAG compliance, screen reader support
- **PWA Features**: Offline support, push notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is a Proof of Concept (POC) for demonstration purposes.

## 📞 Support

For questions or support, please open an issue in the repository.

---

**Built with ❤️ using React and modern web technologies**