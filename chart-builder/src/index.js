import React from 'react';
import { createRoot } from 'react-dom/client'; // 使用 createRoot 而不是 ReactDOM.render
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './App.css';

const container = document.getElementById('root');
const root = createRoot(container); // 创建 root 实例

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
