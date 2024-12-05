import React, { useState, useEffect } from 'react';
import { Grid, Box } from '@mui/material';
import ChartBuilderLeftPanel from '../components/ChartBuilderLeftPanel';
import ChartDisplay from '../components/ChartDisplay';
import DataTable from '../components/DataTable';

function ChartBuilder() {
  // State for chart configuration
  const [chartType, setChartType] = useState('line'); // Type of chart (e.g., line, bar)
  const [xAxis, setXAxis] = useState('time'); // X-axis dimension
  const [yAxis, setYAxis] = useState('consumption'); // Y-axis metric
  const [groupBy, setGroupBy] = useState('month'); // Grouping level (e.g., month, year)
  const [dimension, setDimension] = useState('Service'); // Dimension to filter/group data
  const [chartId, setChartId] = useState('chart' + Date.now()); // Unique chart ID
  const [chartTitle, setChartTitle] = useState('Your Chart Title'); // Chart title

  // State for date range
  const [from, setFrom] = useState(new Date('2023-01-01')); // Start date
  const [to, setTo] = useState(new Date()); // End date (default to today)

  // State for maximum display options
  const [maxDisplay, setMaxDisplay] = useState('all'); // Limit for data display
  const [customMaxDisplay, setCustomMaxDisplay] = useState(''); // Custom limit for display

  // State for chart data
  const [chartData, setChartData] = useState([]);

  // Helper function to format a date object to 'YYYY-MM-DD'
  const formatDate = (date) => {
    if (typeof date === 'string') return date; // If already a string, return as is
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Pad month with 0
    const day = String(date.getDate()).padStart(2, '0'); // Pad day with 0
    return `${year}-${month}-${day}`;
  };

  // Fetch chart data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Format the date range for API query
        const formattedFrom = formatDate(from);
        const formattedTo = formatDate(to);

        // Determine the appropriate maxDisplay parameter
        let maxDisplayParam = 'all';
        if (maxDisplay === 'custom') {
          maxDisplayParam = customMaxDisplay || 'all'; // Default to 'all' if custom is empty
        } else {
          maxDisplayParam = maxDisplay;
        }

        // Fetch filtered data from the backend API
        const response = await fetch(
          `http://localhost:8080/api/data/filter?dimension=${dimension}&groupBy=${groupBy}&from=${formattedFrom}&to=${formattedTo}&maxDisplay=${maxDisplayParam}`
        );
        const data = await response.json();

        // Transform the data for use in the chart and table components
        setChartData(
          data.flatMap((providerData) =>
            providerData.aggregatedValues.map((entry) => ({
              timePeriod: entry.timePeriod,
              provider: providerData.key,
              totalConsumption: entry.totalConsumption,
              budget: providerData.budget,
            }))
          )
        );
      } catch (error) {
        console.error('Error fetching chart data:', error); // Log any errors
      }
    };

    fetchData();
  }, [dimension, groupBy, from, to, maxDisplay, customMaxDisplay]); // Dependencies for re-fetching data

  return (
    <Grid container sx={{ height: '90vh' }}>
      {/* Left panel for chart configuration */}
      <Grid
        item
        xs={2.5}
        sx={{
          backgroundColor: '#E6E6FA',
          padding: '20px',
          borderRight: '2px solid #720e9e',
        }}
      >
        <ChartBuilderLeftPanel
          chartType={chartType}
          setChartType={setChartType}
          xAxis={xAxis}
          setXAxis={setXAxis}
          yAxis={yAxis}
          setYAxis={setYAxis}
          groupBy={groupBy}
          setGroupBy={setGroupBy}
          dimension={dimension}
          setDimension={setDimension}
          from={from}
          setFrom={setFrom}
          to={to}
          setTo={setTo}
          maxDisplay={maxDisplay} // Pass maxDisplay state
          setMaxDisplay={setMaxDisplay} // Pass maxDisplay setter
          customMaxDisplay={customMaxDisplay} // Pass customMaxDisplay state
          setCustomMaxDisplay={setCustomMaxDisplay} // Pass customMaxDisplay setter
        />
      </Grid>

      {/* Main panel for chart display and data table */}
      <Grid
        item
        xs={9.5}
        sx={{ display: 'flex', flexDirection: 'column', height: '90vh' }}
      >
        {/* Chart display area */}
        <Box sx={{ flex: '1', padding: '20px', backgroundColor: '#fff' }}>
          <ChartDisplay
            chartType={chartType}
            data={chartData}
            groupBy={groupBy}
            xAxis={xAxis}
            yAxis={yAxis}
            dimension={dimension}
            chartId={chartId}
            initialChartTitle={chartTitle}
            showAddButton={true}
            customMaxDisplay={customMaxDisplay}
          />
        </Box>

        {/* Data table area */}
        <Box sx={{ flex: '1', padding: '20px', overflow: 'auto' }}>
          <DataTable data={chartData} dimension={dimension} />
        </Box>
      </Grid>
    </Grid>
  );
}

export default ChartBuilder;