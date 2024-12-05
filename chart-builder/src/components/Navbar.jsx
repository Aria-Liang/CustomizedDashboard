import React from 'react';
import { AppBar, Tabs, Tab, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation(); // Hook to get the current location
  const currentTab = location.pathname === '/dashboard' ? 0 : 1; // Determine the selected tab based on the current path

  return (
    <AppBar
      position="static"
      sx={{
        background: '#E6E6FA', // Set the background color of the navbar
        boxShadow: 'none', // Remove shadow
        height: '70px', // Set the height of the navbar
        justifyContent: 'flex-end', // Align content to the end
        borderBottom: '2px solid #720e9e', // Add a bottom border with purple color
      }}
    >
      <Box
        sx={{
          display: 'flex', // Use flexbox for alignment
          justifyContent: 'flex-start', // Align content to the start
          marginLeft: '100px', // Add left margin
        }}
      >
        <Tabs
          value={currentTab} // Set the current selected tab
          textColor="inherit" // Use the inherited text color
          TabIndicatorProps={{ style: { display: 'none' } }} // Hide the default tab indicator
          sx={{
            '& .MuiTab-root': {
              minWidth: '150px', // Set minimum width for tabs
              minHeight: '50px', // Set minimum height for tabs
              margin: '0 10px', // Add horizontal margin between tabs
              borderTopLeftRadius: '20px', // Round top-left corners
              borderTopRightRadius: '20px', // Round top-right corners
              background: 'white', // Set default background color
              transition: 'background 0.3s, color 0.3s', // Smooth transition for hover and selection states
              fontWeight: 'bold', // Set font weight to bold
              color: '#720e9e', // Set default text color to purple
              '&:hover': {
                background: '#dcdcdc', // Change background color on hover
              },
              '&.Mui-selected': {
                background: '#720e9e', // Set background color for the selected tab
                color: '#ffffff', // Set text color for the selected tab
              },
            },
          }}
        >
          {/* Dashboard tab with routing */}
          <Tab label="Dashboard" component={Link} to="/dashboard" />
          {/* Chart Builder tab with routing */}
          <Tab label="Chart Builder" component={Link} to="/chart-builder" />
        </Tabs>
      </Box>
    </AppBar>
  );
}

export default Navbar;
