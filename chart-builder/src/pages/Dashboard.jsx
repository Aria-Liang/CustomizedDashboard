// src/components/Dashboard.jsx

import React,{ useState } from 'react';
import ChartDisplay from '../components/ChartDisplay';
import {Grid, Card, CardContent,Typography, CardActionArea } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

function Dashboard({ charts }) {
    const navigate = useNavigate();
    const [dashboardTitle, setDashboardTitle] = useState('Dashboard');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const handleAddChartClick = () => {
        navigate('/chart-builder');
      };
    
    return (
      <div style={{marginInline:'30px'}}>
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBlock: '20px',
            }}
            >
            <input
                type="text"
                value={dashboardTitle}
                onChange={(e) => setDashboardTitle(e.target.value)}
                style={{
                fontSize: '24px',
                fontWeight: 'bold',
                textAlign: 'center',
                border: isEditingTitle ? '1px dashed #ccc' : 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                width: 'auto',
                cursor: isEditingTitle ? 'text' : 'pointer',
                }}
                readOnly={!isEditingTitle}
                onClick={() => setIsEditingTitle(true)}
                onBlur={() => setIsEditingTitle(false)}
            />
            <EditIcon
                style={{ color: '#720e9e', cursor: 'pointer', marginLeft: '8px' }}
                onClick={() => setIsEditingTitle(true)}
            />
            </div>

        <Grid container spacing={2}>
          {charts.map((chart, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card>
                <CardContent>
                  <ChartDisplay
                    chartType={chart.chartType}
                    data={chart.data}
                    groupBy={chart.groupBy}
                    initialChartTitle={chart.chartTitle}
                    showAddButton={false}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12} sm={6}>
          <Card
            variant="outlined"
            style={{ height: '100%' }}
          >
            <CardActionArea
              style={{ height: '100%' }}
              onClick={handleAddChartClick}
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