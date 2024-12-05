import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Grid,
  ListItemIcon,
} from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import LineStyleIcon from '@mui/icons-material/LineStyle';
import BarChartIcon from '@mui/icons-material/BarChart';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import PieChartIcon from '@mui/icons-material/PieChart';

function ChartBuilderLeftPanel({
  chartType,          // The selected chart type (e.g., line, bar, pie)
  setChartType,       // Function to update the chart type
  xAxis,              // The selected X-axis value
  setXAxis,           // Function to update the X-axis value
  yAxis,              // The selected Y-axis value
  setYAxis,           // Function to update the Y-axis value
  groupBy,            // The grouping criterion (e.g., day, month)
  setGroupBy,         // Function to update the grouping criterion
  from,               // Start date for the date filter
  setFrom,            // Function to update the start date
  to,                 // End date for the date filter
  setTo,              // Function to update the end date
  maxDisplay,         // Maximum number of items to display
  setMaxDisplay,      // Function to update the maximum display value
  customMaxDisplay,   // Custom maximum display value
  setCustomMaxDisplay,// Function to update the custom maximum display value
  dimension,          // The dimension to filter by (e.g., Service, Account)
  setDimension,       // Function to update the dimension
}) {
  // Common style for the FormControl components
  const formControlStyle = {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    },
  };

  // Common style for the InputLabel components
  const inputLabelStyle = {
    color: '#000',
    '&.Mui-focused': {
      color: '#720e9e', // Highlight color for focused labels
    },
  };

  // Common style for the Select components
  const selectStyle = {
    width: '100%',
    color: '#000',
    border: 'none',
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none', // Remove outline borders
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '&.Mui-focused': {
      borderBottom: '2px solid #720e9e', // Highlight for focused Select
      color: '#720e9e',
    },
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* Main container for the left panel */}
      <Box
        sx={{
          padding: '20px',
          backgroundColor: '#E6E6FA', // Lavender background
          height: '90vh',
          borderRadius: '8px',
        }}
      >
        {/* Section title */}
        <Typography
          variant="h6"
          sx={{ marginBottom: '30px', fontWeight: 'bold', textAlign: 'left' }}
        >
          Chart Options
        </Typography>

        <Grid container direction="column" spacing={3}>
          {/* Chart Type Selection */}
          <Grid item>
            <FormControl fullWidth sx={formControlStyle}>
              <InputLabel sx={inputLabelStyle}>Chart Type</InputLabel>
              <Select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                sx={{
                  ...selectStyle,
                  display: 'flex',
                  alignItems: 'center',
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px', // Spacing between icon and text
                  },
                }}
              >
                {/* Menu items with icons for chart types */}
                <MenuItem value="line">
                  <ListItemIcon>
                    <LineStyleIcon fontSize="small" />
                  </ListItemIcon>
                  Line Chart
                </MenuItem>
                <MenuItem value="bar">
                  <ListItemIcon>
                    <BarChartIcon fontSize="small" />
                  </ListItemIcon>
                  Bar Chart
                </MenuItem>
                <MenuItem value="treeMap">
                  <ListItemIcon>
                    <ViewQuiltIcon fontSize="small" />
                  </ListItemIcon>
                  TreeMap Chart
                </MenuItem>
                <MenuItem value="pie">
                  <ListItemIcon>
                    <PieChartIcon fontSize="small" />
                  </ListItemIcon>
                  Pie Chart
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* X-Axis Selection */}
          <Grid item>
            <FormControl fullWidth sx={formControlStyle}>
              <InputLabel sx={inputLabelStyle}>X-Axis</InputLabel>
              <Select
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
                sx={selectStyle}
              >
                <MenuItem value="time">Time</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Y-Axis Selection */}
          <Grid item>
            <FormControl fullWidth sx={formControlStyle}>
              <InputLabel sx={inputLabelStyle}>Y-Axis</InputLabel>
              <Select
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
                sx={selectStyle}
              >
                <MenuItem value="consumption">Consumption</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Group By Selection */}
          <Grid item>
            <FormControl fullWidth sx={formControlStyle}>
              <InputLabel sx={inputLabelStyle}>Group By</InputLabel>
              <Select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                sx={selectStyle}
              >
                <MenuItem value="day">Day</MenuItem>
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="quarter">Quarter</MenuItem>
                <MenuItem value="year">Year</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Time Range Filters */}
          <Grid item>
            <Typography
              variant="h6"
              sx={{
                marginTop: '40px',
                marginBottom: '30px',
                fontWeight: 'bold',
                textAlign: 'left',
              }}
            >
              Filter
            </Typography>
            <Grid container spacing={2}>
              {/* Start Date Picker */}
              <Grid item xs={6}>
                <DesktopDatePicker
                  label="From"
                  inputFormat="yyyy-MM-dd"
                  value={from}
                  onChange={(newValue) => setFrom(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              {/* End Date Picker */}
              <Grid item xs={6}>
                <DesktopDatePicker
                  label="To"
                  inputFormat="yyyy-MM-dd"
                  value={to}
                  onChange={(newValue) => setTo(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Maximum Display */}
          <Grid item>
            <FormControl fullWidth sx={formControlStyle}>
              <InputLabel sx={inputLabelStyle}>Maximum Display</InputLabel>
              <Select
                value={maxDisplay}
                onChange={(e) => setMaxDisplay(e.target.value)}
                label="Maximum Display"
                sx={selectStyle}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
            {/* Custom Maximum Display Input */}
            {maxDisplay === 'custom' && (
              <TextField
                label="Enter Value"
                type="number"
                fullWidth
                value={customMaxDisplay}
                onChange={(e) => setCustomMaxDisplay(e.target.value)}
                sx={{
                  marginTop: '10px',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  '& .MuiInputBase-input': {
                    color: '#000',
                  },
                  '& .Mui-focused .MuiInputBase-input': {
                    color: '#720e9e',
                  },
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                  },
                }}
                InputProps={{ inputProps: { min: 1, max: 1000 } }}
              />
            )}
          </Grid>

          {/* Dimension Selection */}
          <Grid item>
            <FormControl fullWidth sx={formControlStyle}>
              <InputLabel sx={inputLabelStyle}>Dimension</InputLabel>
              <Select
                value={dimension}
                onChange={(e) => setDimension(e.target.value)}
                sx={selectStyle}
              >
                <MenuItem value="CloudProvider">Cloud Provider</MenuItem>
                <MenuItem value="Region">Region</MenuItem>
                <MenuItem value="Account">Account</MenuItem>
                <MenuItem value="Service">Service</MenuItem>
                <MenuItem value="FinancialDomain">Financial Domain</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
}

export default ChartBuilderLeftPanel;
