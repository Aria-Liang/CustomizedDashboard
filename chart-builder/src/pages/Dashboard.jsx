import React, { useState, useEffect } from 'react';
import ChartDisplay from '../components/ChartDisplay';
import { Grid, Card, CardContent, CardActionArea } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate(); // Hook for navigation
  const [dashboardOrder, setDashboardOrder] = useState([]); // Stores the order of charts on the dashboard
  const [charts, setCharts] = useState({}); // Stores chart configurations
  const [chartDataMap, setChartDataMap] = useState({}); // Maps chart IDs to their data
  const userId = 1; // Assumes a fixed userId for simplicity

  // Fetches dashboard data from the backend
  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch(`http://localhost:8080/api/dashboard/${userId}`);
        const data = await response.json();
        setDashboardOrder(data.dashboardOrder); // Updates the order of charts
        setCharts(data.charts); // Updates chart configurations
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    }

    fetchDashboard();
  }, [userId]);

  // Fetches data for each chart and processes it
  useEffect(() => {
    async function fetchChartData() {
      const newChartDataMap = {};
      for (const chartId of Object.keys(charts)) {
        const chart = charts[chartId];
        try {
          // Helper function to get the current date in YYYY-MM-DD format
          const getCurrentDate = () => {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          };

          const fromDate = '2023-01-01'; // Static start date
          const toDate = getCurrentDate(); // Current date as end date

          // API call to fetch chart data
          const response = await fetch(
            `http://localhost:8080/api/data/filter?dimension=${chart.dimension}&groupBy=${chart.groupBy}&from=${fromDate}&to=${toDate}&maxDisplay=${chart.maxDisplay || 'All'}`
          );
          const data = await response.json();

          // Process the data to match the format used by the chart
          const chartData = data.flatMap((providerData) =>
            providerData.aggregatedValues.map((entry) => ({
              timePeriod: entry.timePeriod,
              provider: providerData.key,
              totalConsumption: entry.totalConsumption,
            }))
          );

          newChartDataMap[chartId] = chartData; // Store processed data in the map
        } catch (error) {
          console.error(`Error fetching data for chart ${chartId}:`, error);
        }
      }
      setChartDataMap(newChartDataMap); // Update the state with the new data map
    }

    if (Object.keys(charts).length > 0) {
      fetchChartData(); // Fetch data only if charts exist
    }
  }, [charts]);

  // Updates the chart title via API call
  const handleUpdateChartTitle = async (chartId, newTitle) => {
    try {
      const dashboardInfo = dashboardOrder.find((item) => item.id === chartId);
      const chartInfo = {
        ...charts[chartId],
        title: newTitle, // Update the title
      };

      const updatedChart = { dashboardInfo, chartInfo };

      const response = await fetch(`http://localhost:8080/api/dashboard/${userId}/update/${chartId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedChart),
      });

      if (!response.ok) {
        console.error('Failed to update chart title');
      } else {
        console.log('Chart title updated successfully!');
        // Update the local state with the new title
        setCharts((prevCharts) => ({
          ...prevCharts,
          [chartId]: { ...prevCharts[chartId], title: newTitle },
        }));
      }
    } catch (error) {
      console.error('Error updating chart title:', error);
    }
  };

  // Handles chart deletion
  const handleDeleteChart = async (chartId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/dashboard/${userId}/delete/${chartId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.error('Failed to delete chart');
      } else {
        console.log('Chart deleted successfully!');
        // Update the local state to remove the chart
        setDashboardOrder((prevOrder) => prevOrder.filter((item) => item.id !== chartId));
        setCharts((prevCharts) => {
          const newCharts = { ...prevCharts };
          delete newCharts[chartId];
          return newCharts;
        });
        setChartDataMap((prevDataMap) => {
          const newDataMap = { ...prevDataMap };
          delete newDataMap[chartId];
          return newDataMap;
        });
      }
    } catch (error) {
      console.error('Error deleting chart:', error);
    }
  };

  return (
    <div style={{ marginInline: '30px' }}>
      <Grid container spacing={2}>
        {dashboardOrder.map((item) => (
          <Grid item xs={12} sm={6} key={item.id}>
            <Card>
              <CardContent>
                <ChartDisplay
                  chartType={charts[item.id]?.type}
                  data={chartDataMap[item.id] || []}
                  groupBy={charts[item.id]?.groupBy}
                  xAxis={charts[item.id]?.xAxis}
                  yAxis={charts[item.id]?.yAxis}
                  dimension={charts[item.id]?.dimension}
                  chartId={item.id}
                  initialChartTitle={charts[item.id]?.title}
                  showAddButton={false}
                  showDeleteButton={true} // Show delete button on the dashboard
                  onUpdateTitle={(newTitle) => handleUpdateChartTitle(item.id, newTitle)}
                  onDeleteChart={handleDeleteChart}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
        {/* Add new chart button */}
        <Grid item xs={12} sm={6}>
          <Card variant="outlined" style={{ height: '100%' }}>
            <CardActionArea
              style={{ height: '100%' }}
              onClick={() => navigate('/chart-builder')} // Navigate to the chart builder
            >
              <CardContent
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <AddIcon style={{ fontSize: 50, color: '#720e9e' }} />
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
