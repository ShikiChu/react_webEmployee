import './App.css';
import { NavLink } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {Home} from './Home';
import Department from './Department';
import Employee from './Employee';

function App() {
  return (
    <div className="App container">
      <Router>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/Home">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/Department">Department</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/Employee">Employee</NavLink>
              </li>
            </ul>
          </div>
        </nav>
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/Department" element={<Department />} />
          <Route path="/Employee" element={<Employee />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
