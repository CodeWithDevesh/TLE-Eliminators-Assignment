import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/navbar";
import Login from "./components/auth/login";
import { AuthProvider } from "./components/auth/AuthContext";
import { ToastContainer } from "react-toastify";
import Profile from "./pages/Profile";
import ChangePass from "./pages/Profile/changePass";
import Signup from "./components/auth/signup";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <ToastContainer
            position="bottom-right"
            autoClose={2000}
            hideProgressBar
            closeOnClick={false}
            pauseOnHover
            draggable={false}
            theme="light"
          />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/changePass" element={<ChangePass />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
