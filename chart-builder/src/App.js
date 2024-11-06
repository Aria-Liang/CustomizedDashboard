import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ChartBuilder from './pages/ChartBuilder';

function App() {
  const [charts, setCharts] = useState([]);

  const handleAddChart = (chart) => {
    setCharts((prevCharts) => [...prevCharts, chart]);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard charts={charts}/>} />
        <Route path="/chart-builder" element={<ChartBuilder onAddChart={handleAddChart}/>} />
      </Routes>
    </LocalizationProvider>
  );
}

export default App;
