# TaskHub - Project Management Application

A comprehensive task management application built with React, featuring multiple pages, CRUD operations, and simulated API calls.

## 🚀 Features

### Pages & Functionality

1. **Dashboard**

   - Overview statistics (projects, tasks, team members)
   - Recent tasks display
   - Upcoming deadlines
   - Quick actions for common tasks
   - Real-time completion rate metrics

2. **Projects Management**

   - Create, read, update, and delete projects
   - Project progress tracking with visual progress bars
   - Budget and timeline management
   - Team size tracking
   - Project status indicators (Planning, Active, On Hold, Completed)

3. **Tasks Management**

   - Full CRUD operations for tasks
   - Advanced filtering by status, priority, and project
   - Task assignment to team members
   - Due date tracking
   - Priority levels (Low, Medium, High)
   - Status workflow (To Do, In Progress, Completed)

4. **Team Management**

   - Add and manage team members
   - Role and status tracking
   - Task and project count per member
   - Avatar customization
   - Email management

5. **Analytics Dashboard**

   - Task completion trends (7-day chart)
   - Project progress visualization
   - Team productivity metrics
   - Completion rate statistics
   - Task distribution analysis

6. **Settings**
   - Profile management
   - Preferences (theme, language, timezone)
   - Notification settings
   - Security options
   - Data export and privacy controls

## 🛠️ Tech Stack

- **React** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **CSS3** - Styling with modern features

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Component Library

### Reusable Components

- **Button** - Multiple variants (primary, secondary, danger, success, outline)
- **Card** - Container component with hover effects
- **Modal** - Responsive modal dialog
- **Input** - Form input with validation
- **Select** - Dropdown selector
- **Textarea** - Multi-line text input
- **Loading** - Loading spinner with different sizes
- **Layout** - Main layout with sidebar navigation

## 🔌 API Simulation

The application includes a comprehensive mock API service (`src/services/api.js`) that simulates:

- Network delays (300-800ms)
- CRUD operations for all entities
- Data persistence during session
- Realistic data structures
- Error handling

### Available API Methods

#### Tasks

- `getTasks(filters)` - Get all tasks with optional filtering
- `getTaskById(id)` - Get single task
- `createTask(taskData)` - Create new task
- `updateTask(id, updates)` - Update existing task
- `deleteTask(id)` - Delete task

#### Projects

- `getProjects(status)` - Get all projects
- `getProjectById(id)` - Get single project
- `createProject(projectData)` - Create new project
- `updateProject(id, updates)` - Update project
- `deleteProject(id)` - Delete project

#### Team Members

- `getTeamMembers(status)` - Get all team members
- `getTeamMemberById(id)` - Get single member
- `createTeamMember(memberData)` - Add team member
- `updateTeamMember(id, updates)` - Update member
- `deleteTeamMember(id)` - Remove member

#### Analytics

- `getAnalytics()` - Get comprehensive analytics data
- `getDashboardSummary()` - Get dashboard overview

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop (1400px+)
- Tablet (768px - 1400px)
- Mobile (< 768px)

## 🎯 Key Features

- **Clean UI/UX** - Modern, intuitive interface
- **Fast Performance** - Optimized with Vite
- **State Management** - React hooks (useState, useEffect)
- **Client-side Routing** - Smooth navigation with React Router
- **Form Validation** - Required field validation
- **Loading States** - User feedback during API calls
- **Error Handling** - Graceful error management
- **Animations** - Smooth transitions and hover effects

## 📂 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Button.jsx/css
│   ├── Card.jsx/css
│   ├── Input.jsx/css
│   ├── Layout.jsx/css
│   ├── Loading.jsx/css
│   ├── Modal.jsx/css
│   ├── Select.jsx/css
│   └── Textarea.jsx/css
├── pages/             # Page components
│   ├── Analytics.jsx/css
│   ├── Dashboard.jsx/css
│   ├── Projects.jsx/css
│   ├── Settings.jsx/css
│   ├── Tasks.jsx/css
│   └── Team.jsx/css
├── services/          # API services
│   └── api.js
├── App.jsx           # Main app component with routing
├── App.css          # App styles
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Open http://localhost:5173 in your browser
5. Explore the different pages and features!

## 💡 Usage Examples

### Creating a New Task

1. Navigate to Tasks page
2. Click "+ New Task" button
3. Fill in the form with title, description, priority, etc.
4. Click "Create Task"
5. Task appears in the list with simulated API delay

### Filtering Tasks

1. Go to Tasks page
2. Use the filter dropdowns for Status, Priority, or Project
3. Tasks update automatically based on selected filters

### Managing Projects

1. Navigate to Projects page
2. View all projects with their progress bars
3. Edit or delete existing projects
4. Create new projects with budget and timeline

## 🎨 Customization

The application uses a consistent color scheme that can be easily customized in the CSS files:

- Primary: `#6366f1` (Indigo)
- Success: `#10b981` (Green)
- Danger: `#ef4444` (Red)
- Warning: `#f59e0b` (Amber)

## 📊 Sample Data

The application comes pre-loaded with:

- 8 sample tasks across different statuses
- 4 projects with varying completion levels
- 5 team members with different roles
- Analytics data for the last 7 days

## 🔧 Technologies Used

- React 19
- React Router DOM 7
- Vite 7
- Modern ES6+ JavaScript
- CSS3 with Flexbox and Grid
- Component-based architecture

## 📄 License

MIT

## 👨‍💻 Developer Notes

This is a demonstration application showcasing:

- React component architecture
- State management patterns
- Mock API integration
- Responsive design principles
- Modern CSS techniques
- User experience best practices
