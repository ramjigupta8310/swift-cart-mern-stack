import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App.jsx'
import './index.css'
import UserState from './Context/UserState.jsx';
import CartState from './Context/CartState.jsx';
import ProductState from './Context/ProductState.jsx';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <BrowserRouter>
    <UserState>
      <CartState>
        <ProductState>
          <App />
        </ProductState>
      </CartState>
    </UserState>
  </BrowserRouter>
  // </StrictMode>
)
