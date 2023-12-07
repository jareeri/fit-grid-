import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./SignIn";
import Signup from "./Signup";
import Admain from "./Admain";

import Home from "./Home";


import axios from 'axios';
import Cookies from 'js-cookie';
// Set the Authorization header globally
axios.defaults.headers.common['Authorization'] = `${Cookies.get('token')}`;

function App() {
  return (
    <div className="App">
      <Router>
    
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Admin" element={<Admain />} /> {/* Check this line */}
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/Signup" element={<Signup />} />
        </Routes>
  
      </Router>
    </div>
  );
}

export default App;
