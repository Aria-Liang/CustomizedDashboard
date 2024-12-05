# Customized Dashboard - Frontend

This is the frontend codebase for the Customized Dashboard Application, enabling users to create, configure, and manage personalized data visualizations.

## Features
- **Dynamic Dashboards**: Allows users to create, edit, and delete charts.
- **Chart Configurations**: Includes dropdowns for chart type, dimensions, grouping, time filters, and maximum data display.
- **Live Chart Preview**: Renders a real-time preview of the configured chart using ECharts.js.
- **Data Display**: Includes a data table to show filtered data alongside charts.
- **Interactive UI**: Built with Material-UI for a responsive and intuitive user experience.

## Technology Stack
- **React.js**: Main framework for building the UI.
- **Material-UI (MUI)**: Provides a responsive and styled component library.
- **ECharts.js**: For rendering dynamic and interactive charts.
- **MUI Date Pickers**: For date range filtering.

## Installation and Setup
1. Clone the repository:
2. Navigate to the project directory:
   ```
   cd chart-builder
   ```
3. npm install
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run start
   ```
5. Open your browser and navigate to http://localhost:3000/dashboard, http://localhost:3000/chart-builder

## Project Structure
1. /src/pages/
- Dashboard.jsx: Displays all saved charts and allows chart management.
  ![image](https://github.com/user-attachments/assets/60438f03-a620-46af-9089-34f37465fff8)
- ChartBuilder.jsx: Enables users to create and preview new charts.
  ![image](https://github.com/user-attachments/assets/ee0e1b0c-d552-4fac-b33c-3da9a48f4598)
2. /src/components/
- ChartBuilderLeftPanel.jsx: Configuration options for chart creation.
- ChartDisplay.jsx: Renders charts dynamically based on user configurations.
- DataTable.jsx: Displays underlying data for analysis.

## Key Endpoints
- Fetch and update data through the backend RESTful APIs:
  - GET /api/dashboard/:userId
  - GET /api/data/filter
  - POST /api/dashboard/:userId/add
  - PUT /api/dashboard/:userId/update/:chartId
  - DELETE /api/dashboard/:userId/delete/:chartId

## Improvements
- Enhance UI/UX based on future design updates.
- Implement drag-and-drop for dashboard charts.
- Allow zoom functionality for charts.
- Combine charts and tables into a single unified card.
