import React, { useCallback, useState, useEffect, useContext } from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'

import SidebarProvider, { SidebarContext } from './contexts/SidebarContext';
import CartProvider, { CartContext } from './contexts/CartContext';

import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Footer from './components/Footer'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const { setIsOpen } = useContext(SidebarContext);
  useEffect(() => {
    setIsOpen(false);
  }, []);

  const { cart } = useContext(CartContext);

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("/create-checkout-session", {
      method: "POST",
      body: JSON.stringify({
        items: cart,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  const options = {fetchClientSecret};

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}

const Return = () => {
  const [status, setStatus] = useState(null);
  // const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    fetch(`/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        // setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === 'open') {
    return (
      <Navigate to="/checkout" />
    )
  }

  // if (status === 'complete') {
  //   return (
  //     <section id="success">
  //       <p>
  //         We appreciate your business! A confirmation email will be sent to {customerEmail}.

  //         If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
  //       </p>
  //     </section>
  //   )
  // }

  return (
      <Navigate to="/" />
    );
}

const App = () => {
  return (
    <SidebarProvider>
      <CartProvider>
        <div className='overflow-hidden'>
          <Router>
            <Header />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/product/:id' element={<ProductDetails />} />
              <Route path="/checkout" element={<CheckoutForm />} />
              <Route path="/return" element={<Return />} />
            </Routes>
            <Sidebar />
            <Footer />
          </Router>
        </div>
      </CartProvider>
    </SidebarProvider>
  );
};

export default App;
