import React from 'react';
import { AppBar, Tabs, Tab, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const currentTab = location.pathname === '/dashboard' ? 0 : 1;

  return (
    <AppBar
      position="static"
      sx={{
        background: '#E6E6FA', // 整个导航栏的背景色
        boxShadow: 'none', // 去除阴影
        height: '70px',
        justifyContent:'flex-end',
        borderBottom:'2px solid #720e9e'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          marginLeft:'100px'
        }}
      >
        <Tabs
          value={currentTab}
          textColor="inherit"
          TabIndicatorProps={{ style: { display: 'none' } }} // 隐藏默认指示器
          sx={{
            '& .MuiTab-root': {
              minWidth: '150px',
              minHeight: '50px',
              margin: '0 10px',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              background: 'white',
              transition: 'background 0.3s, color 0.3s',
              fontWeight: 'bold',
              color: '#720e9e',
              '&:hover': {
                background: '#dcdcdc', // 悬停时背景色
              },
              '&.Mui-selected': {
                background: '#720e9e', // 选中时的背景色
                color: '#ffffff', // 选中时的字体颜色
              },
            },
          }}
        >
          <Tab label="Dashboard" component={Link} to="/dashboard" />
          <Tab label="Chart Builder" component={Link} to="/chart-builder" />
        </Tabs>
      </Box>
    </AppBar>
  );
}

export default Navbar;
