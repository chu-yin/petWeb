import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, LengthProvider } from './context/AuthProvider';
import PrivateRoute from './PrivateRoute';
import './i18n'
import Home from "./pages/Home";
import Login from "./pages/login";
import Post from './pages/Post';
import User from './pages/User';
import Register from './pages/register';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Hospital from './pages/Hospital';
import Profile from './pages/Profile';


function App() {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <AuthProvider>
          <LengthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="post"
              element={
                <PrivateRoute>
                  <Post/>
                </PrivateRoute>
              }
            />
            <Route
              path="user"
              element={
                <PrivateRoute>
                  <User/>
                </PrivateRoute>
              }
            />
            <Route
              path="shop"
              element={
                <PrivateRoute>
                  <Shop/>
                </PrivateRoute>
              }
            />
            <Route
              path="product"
              element={
                <PrivateRoute>
                  <Product/>
                </PrivateRoute>
              }
            />
            <Route
              path="hospital"
              element={
                <PrivateRoute>
                  <Hospital/>
                </PrivateRoute>
              }
            />
            <Route
              path="register"
              element={
                  <Register/>
              }
            />
            <Route
              path="profile"
              element={
                <Profile/>
              }
            />
          </Routes>
          </LengthProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
