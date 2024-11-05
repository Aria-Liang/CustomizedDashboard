import React, { useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Typography, Grid, ListItemIcon  } from '@mui/material';
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import LineStyleIcon from '@mui/icons-material/LineStyle';
import BarChartIcon from '@mui/icons-material/BarChart';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import PieChartIcon from '@mui/icons-material/PieChart';

function ChartBuilderLeftPanel({
    chartType, setChartType,
    xAxis, setXAxis,
    yAxis, setYAxis,
    groupBy, setGroupBy,
    fromDate, setFromDate,
    toDate, setToDate,
    maxDisplay, setMaxDisplay,
    customMaxDisplay, setCustomMaxDisplay,
    dimension, setDimension}) {
//   const handleChange = (event) => {
//     setMaxDisplay(event.target.value);
//   };

  const formControlStyle = {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    }
  };

  const inputLabelStyle = {
    color: '#000', 
    '&.Mui-focused': {
      color: '#720e9e', 
    }
  };

  const selectStyle = {
    width: '100%',
    color: '#000', 
    border: 'none',
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '&.Mui-focused': {
      borderBottom: '2px solid #720e9e', 
      color: '#720e9e', 
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ padding: '20px', backgroundColor: '#E6E6FA', height: '90vh', borderRadius: '8px' }}>
        <Typography variant="h6" sx={{ marginBottom: '30px', fontWeight: 'bold', textAlign: 'left' }}>Chart Options</Typography>

        <Grid container direction="column" spacing={3}>
            {/* Chart Type */}
            <Grid item>
                <FormControl fullWidth sx={formControlStyle}>
                <InputLabel sx={inputLabelStyle}>Chart Type</InputLabel>
                <Select 
            // defaultValue="line" 
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            sx={{
                ...selectStyle,
                display: 'flex',
                alignItems: 'center',
                '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                gap: '8px', 
                }
            }}
            >
            <MenuItem value="line" sx={{ display: 'flex', alignItems: 'center' }}>
                <ListItemIcon sx={{ minWidth: '30px' }}>
                <LineStyleIcon fontSize="small" />
                </ListItemIcon>
                Line Chart
            </MenuItem>
            <MenuItem value="bar" sx={{ display: 'flex', alignItems: 'center' }}>
                <ListItemIcon sx={{ minWidth: '30px' }}>
                <BarChartIcon fontSize="small" />
                </ListItemIcon>
                Bar Chart
            </MenuItem>
            <MenuItem value="treeMap" sx={{ display: 'flex', alignItems: 'center' }}>
                <ListItemIcon sx={{ minWidth: '30px' }}>
                <ViewQuiltIcon fontSize="small" />
                </ListItemIcon>
                TreeMap Chart
            </MenuItem>
            <MenuItem value="pie" sx={{ display: 'flex', alignItems: 'center' }}>
                <ListItemIcon sx={{ minWidth: '30px' }}>
                <PieChartIcon fontSize="small" />
                </ListItemIcon>
                Pie Chart
            </MenuItem>
            </Select>
            </FormControl>
        </Grid>

          {/* X-Axis */}
          <Grid item>
            <FormControl fullWidth sx={formControlStyle}>
              <InputLabel sx={inputLabelStyle}>X-Axis</InputLabel>
              <Select 
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)} 
                sx={selectStyle}>
                <MenuItem value="time">Time</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Y-Axis */}
          <Grid item>
            <FormControl fullWidth sx={formControlStyle}>
              <InputLabel sx={inputLabelStyle}>Y-Axis</InputLabel>
              <Select 
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)} 
                sx={selectStyle}>
                <MenuItem value="consumption">Consumption</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Group By */}
          <Grid item>
            <FormControl fullWidth sx={formControlStyle}>
              <InputLabel sx={inputLabelStyle}>Group By</InputLabel>
              <Select 
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)} 
                sx={selectStyle}>
                <MenuItem value="day">Day</MenuItem>
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="quarter">Quarter</MenuItem>
                <MenuItem value="year">Year</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Time Range */}
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
                <Grid item xs={6}>
                <DesktopDatePicker
                    label="From"
                    inputFormat="yyyy-MM-dd"
                    value={fromDate}
                    onChange={(newValue) => setFromDate(newValue)}
                    disableCloseOnSelect // Prevent the calendar from closing after selecting a date
                    slotProps={{
                    textField: {
                        fullWidth: true,
                        sx: {
                        ...formControlStyle, // Apply shared form control styles
                        '& .MuiInputBase-input': {
                            color: '#000', // Default text color (black)
                        },
                        '& .MuiInputLabel-root': {
                            color: '#000', // Default label color (black)
                            '&.Mui-focused': {
                            color: '#720e9e', // Label color when focused (purple)
                            },
                        },
                        '& .MuiOutlinedInput-root': {
                            '&.Mui-focused': {
                            '& .MuiInputBase-input': {
                                color: '#720e9e', // Text color when focused (purple)
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#720e9e', // Border color when focused (purple)
                            },
                            },
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'transparent', // Default border color (transparent)
                        },
                        },
                    },
                    }}
                />
                </Grid>
                <Grid item xs={6}>
                <DesktopDatePicker
                    label="To"
                    inputFormat="yyyy-MM-dd"
                    value={toDate}
                    onChange={(newValue) => setToDate(newValue)}
                    disableCloseOnSelect // Prevent the calendar from closing after selecting a date
                    slotProps={{
                    textField: {
                        fullWidth: true,
                        sx: {
                        ...formControlStyle, // Apply shared form control styles
                        '& .MuiInputBase-input': {
                            color: '#000', // Default text color (black)
                        },
                        '& .MuiInputLabel-root': {
                            color: '#000', // Default label color (black)
                            '&.Mui-focused': {
                            color: '#720e9e', // Label color when focused (purple)
                            },
                        },
                        '& .MuiOutlinedInput-root': {
                            '&.Mui-focused': {
                            '& .MuiInputBase-input': {
                                color: '#720e9e', // Text color when focused (purple)
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#720e9e', // Border color when focused (purple)
                            },
                            },
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'transparent', // Default border color (transparent)
                        },
                        },
                    },
                    }}
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
                sx={selectStyle}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
            {maxDisplay === 'custom' && (
              <TextField
                label="Enter Value"
                type="number"
                fullWidth
                value={customMaxDisplay} // 显示当前自定义值
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
                  }
                }}
                InputProps={{ inputProps: { min: 1, max: 1000 } }}
              />
            )}
          </Grid>

          {/* Dimension */}
          <Grid item>
            <FormControl fullWidth sx={formControlStyle}>
              <InputLabel sx={inputLabelStyle}>Dimension</InputLabel>
              <Select 
                value={dimension}
                onChange={(e) => setDimension(e.target.value)} 
                sx={selectStyle}>
                <MenuItem value="cloudProvider">Cloud Provider</MenuItem>
                <MenuItem value="cloudProviderRegion">Cloud Provider + Region</MenuItem>
                <MenuItem value="cloudProviderAccount">Cloud Provider + Account</MenuItem>
                <MenuItem value="cloudProviderService">Cloud Provider + Service</MenuItem>
                <MenuItem value="region">Region</MenuItem>
                <MenuItem value="account">Account</MenuItem>
                <MenuItem value="service">Service</MenuItem>
                <MenuItem value="financialDomain">Financial Domain</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
}

export default ChartBuilderLeftPanel;
