import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/protectedRoute";
import Loader from "./components/loader";
import { useSelector } from "react-redux";

function App() {
  const { loader } = useSelector(state => state.loaderReducer);
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      { loader && <Loader />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute> }>
          </Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
