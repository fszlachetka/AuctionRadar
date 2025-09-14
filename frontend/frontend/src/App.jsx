import {Route, Routes} from 'react-router-dom';
import './App.css';
import LandingPage from "./components/LandingPage.jsx";

function App() {
  return (
    <>
      <div className={"content"}>
          <Routes>
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/" element={<LandingPage/>} />
          </Routes>
      </div>
    </>
  )
}

export default App
