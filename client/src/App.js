import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import BusinessDashboard from './pages/business/Dashboard';
import IndividualDashboard from './pages/individual/Dashboard';
import BrowseBusiness from './pages/business/Browse';
import BusinessDetails from './pages/business/BusinessDetails';
import BrowseIndividuals from './pages/individual/Browse';
import IndividualDetails from './pages/individual/IndividualDetails';
import Profile from './pages/profile/Profile';
import CreatePost from './pages/posts/CreatePost';
import PostsFeed from './pages/posts/PostsFeed';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/business" element={<BusinessDashboard />} />
        <Route path="/dashboard/individual" element={<IndividualDashboard />} />
        <Route path="/browse/business" element={<BrowseBusiness />} />
        <Route path="/business/:id" element={<BusinessDetails />} />
        <Route path="/browse/individuals" element={<BrowseIndividuals />} />
        <Route path="/individual/:id" element={<IndividualDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/posts" element={<PostsFeed />} />
      </Routes>
    </Router>
  );
}

export default App;
