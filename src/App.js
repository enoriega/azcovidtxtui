import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import data from './test_data.json'
import List from "./List";



function Item() {
  return "Mundo";
}

function App() {
  return (
      <div className="App">
        <h1>AZCovidTxt News Monitoring</h1>
        <Routes>
          <Route path="/" element={<List items={data} />} />
          <Route path="item" element={<Item />} />
        </Routes>
      </div>
  );
}

export default App;
