import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App.jsx'
import './index.css'
import UserState from './Context/UserState.jsx';
import CartState from './Context/CartState.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserState>
        <CartState>
          <App />
        </CartState>
      </UserState>
    </BrowserRouter>
  </StrictMode>
)
