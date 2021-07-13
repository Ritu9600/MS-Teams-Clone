import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { ContextProvider } from './SocketContext';
import './styles.css';


ReactDOM.render(
  
  <ContextProvider>
    <App />
  </ContextProvider>,
  document.getElementById('root'),
);
