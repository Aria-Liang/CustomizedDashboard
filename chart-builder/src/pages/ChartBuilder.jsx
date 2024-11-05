// src/pages/ChartBuilder.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import ChartBuilderLeftPanel from '../components/ChartBuilderLeftPanel';
import ChartDisplay from '../components/ChartDisplay';
import DataTable from '../components/DataTable';
import { aggregateDataByCloudProvider } from '../chartLogic/cloudProviderAggregation';
import mockData from '../data/mockData.json';

function ChartBuilder() {
  // State variables
  const [chartType, setChartType] = useState('line');
  const [xAxis, setXAxis] = useState('time');
  const [yAxis, setYAxis] = useState('consumption');
  const [groupBy, setGroupBy] = useState('day');
  const [fromDate, setFromDate] = useState(new Date('2023-01-01'));
  const [toDate, setToDate] = useState(new Date());
  const [maxDisplay, setMaxDisplay] = useState('all');
  const [customMaxDisplay, setCustomMaxDisplay] = useState('');
  const [dimension, setDimension] = useState('cloudProvider');

  useEffect(() => {
    console.log('From Date in Parent:', fromDate);
    console.log('To Date in Parent:', toDate);
  }, [fromDate, toDate]);
  // State to store aggregated data
  const [aggregatedData, setAggregatedData] = useState([]);

  // Memoize the filtered data
  const filteredData = useMemo(() => {
    const startOfFromDate = new Date(fromDate);
    startOfFromDate.setHours(0, 0, 0, 0);

    const endOfToDate = new Date(toDate);
    endOfToDate.setHours(23, 59, 59, 999);
    
    return mockData.filter((d) => {
        const date = new Date(d.date);
        if (isNaN(date)) {
          console.error('Invalid date format in data:', d.date);
          return false;
        }
        return date >= startOfFromDate && date <= endOfToDate;
    });
  }, [mockData, fromDate, toDate]);

  // Aggregation logic moved to parent
  useEffect(() => {
    if (dimension === 'cloudProvider') {
      const aggregated = aggregateDataByCloudProvider(
        filteredData,
        groupBy,
        fromDate,
        toDate
      );
      setAggregatedData(aggregated);
    }
  }, [dimension, filteredData, groupBy, fromDate, toDate]);

  return (
    <Grid container sx={{ height: '90vh' }}>
      {/* Left Side */}
      <Grid
        item
        xs={2.5}
        sx={{ backgroundColor: '#E6E6FA', padding: '20px', borderRight:'2px solid #720e9e' }}
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
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          maxDisplay={maxDisplay}
          setMaxDisplay={setMaxDisplay}
          customMaxDisplay={customMaxDisplay}
          setCustomMaxDisplay={setCustomMaxDisplay}
          dimension={dimension}
          setDimension={setDimension}
        />
      </Grid>

      {/* Right Side */}
      <Grid
        item
        xs={9.5}
        sx={{ display: 'flex', flexDirection: 'column', height: '90vh' }}
      >
        {/* Upper Part - Chart */}
        <Box sx={{ flex: '0 0 50%', padding: '20px', backgroundColor: '#fff' }}>
          <ChartDisplay
            chartType={chartType}
            xAxis={xAxis}
            yAxis={yAxis}
            groupBy={groupBy}
            fromDate={fromDate}
            toDate={toDate}
            maxDisplay={maxDisplay}
            customMaxDisplay={customMaxDisplay}
            dimension={dimension}
            data={aggregatedData} // Pass aggregated data to the chart
          />
        </Box>

        {/* Lower Part - Data Table */}
        <Box
          sx={{
            flex: '0 0 50%',
            paddingInline: '40px',
            paddingTop:'20px',
            backgroundColor: '#E6E6FA',
            overflow: 'hidden', // Remove overflow as we have pagination
          }}
        >
          <Typography variant="h6" gutterBottom sx={{display: 'flex', justifyContent:'center', fontWeight:'bold'}}>
            Database
          </Typography>
          {/* Use the DataTable component and pass the same aggregated data */}
          <DataTable
            data={aggregatedData.flatMap((d) =>
                d.aggregatedValues.map((value) => ({
                ...value,
                provider: d.provider, // Include provider name
                }))
            )}
            />
        </Box>
      </Grid>
    </Grid>
  );
}

export default ChartBuilder;