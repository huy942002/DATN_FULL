import React from 'react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import reportWebVitals from './reportWebVitals';
import { ToastContainer } from 'react-toastify';
import store from './features/store'
import { Provider } from 'react-redux';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <StrictMode>
      <App />
    </StrictMode>
    <ToastContainer />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
