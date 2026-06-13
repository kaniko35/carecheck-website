import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import InfantCare from './pages/InfantCare';
import ToddlerSolutions from './pages/ToddlerSolutions';
import OfficeSolutions from './pages/OfficeSolutions';
import Essentials from './pages/Essentials';
import Academy from './pages/Academy';
import About from './pages/About';
import Contact from './pages/Contact';
import './App.css';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/infant-care" element={<InfantCare />} />
        <Route path="/toddler" element={<ToddlerSolutions />} />
        <Route path="/office" element={<OfficeSolutions />} />
        <Route path="/essentials" element={<Essentials />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;