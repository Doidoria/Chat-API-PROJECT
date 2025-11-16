import logo from './logo.svg';

import { BrowserRouter as BR, Routes, Route } from "react-router-dom"
import Layout from './pages/Layout';
import Main from './pages/main';


function App() {
  return (
    <div className="App">
      <BR>
        <Routes>
            <Route element={<Layout/>}>
              <Route path="/" element={<Main/>}></Route>
              <Route path="/" element={""}></Route>
            </Route>
        </Routes>
      </BR>

    </div>
  );
}

export default App;
