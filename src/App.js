import './App.css';
import { Routes, Route } from "react-router-dom";
import data from './out.json'
import List from "./List";
import Item from "./Item";
import Manual from "./Manual";



function App() {
  return (
      <div className="App">
        <h1>AZHealthTxt News Monitoring</h1>
        <Routes>
          <Route path="/" element={<List items={data} />} />
          <Route path="item" element={<Item />} />
          <Route path="manual" element={<Manual />} />
        </Routes>
      </div>
  );
}

export default App;
