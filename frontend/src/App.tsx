
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./Registration";
import Success from "./success";


const App = () => {
  return (
    <Router>
       <div className=" flex object-center mt-110 justify-center item-center h-screen w-screen bg-white">
      <Routes>
       
        <Route path="/register" element={<Registration />} />
        <Route path="/success" element={<Success />} />
        <Route path="*" element={<Registration />} /> {/* fallback */}

      </Routes>
              </div>
    </Router>
  );
};

export default App;

  