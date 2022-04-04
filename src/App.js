import './App.css';
import { Routes, Route } from 'react-router';
import { HomePage } from './HomePage/HomePage';
import { GoalPage } from './GoalPage/GoalPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/g/:goalSlug" element={<GoalPage />} />
        <Route path="/goal/:goalSlug" element={<GoalPage />} />
      </Routes>
    </div>
  );
}

export default App;
