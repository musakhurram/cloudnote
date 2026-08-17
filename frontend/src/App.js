import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import NoteState from "./context/notes/NoteState";
import ThemeProvider from "./context/theme/themes";
import Alert from "./components/common/Alert";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// If the user is already signed in (token in localStorage), visiting /login
// or /signup makes no sense — send them straight to the notes page instead.
// This also fixes the browser-back-after-login case where a logged-in user
// would otherwise land on the login form.
const RedirectIfAuthenticated = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return children;
};

function App() {
  const [alert, setAlert] = useState(null);
  const alertTimeout = useRef(null);

  useEffect(() => {
    return () => {
      if (alertTimeout.current) {
        clearTimeout(alertTimeout.current);
      }
    };
  }, []);

  const showAlert = (message, type) => {
    if (alertTimeout.current) {
      clearTimeout(alertTimeout.current);
    }

    setAlert({
      msg: message,
      type: type,
    });

    alertTimeout.current = setTimeout(() => {
      setAlert(null);
    }, 1500);
  };

  return (
    <ThemeProvider>
      <div className="app-shell">
        <NoteState>
          <BrowserRouter>
            <Navbar />
            <Alert alert={alert} />
            <main>
              <Routes>
                <Route path="/" element={<Home showAlert={showAlert} />} />
                <Route path="/about" element={<About />} />
                <Route
                  path="/login"
                  element={
                    <RedirectIfAuthenticated>
                      <Login showAlert={showAlert} />
                    </RedirectIfAuthenticated>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <RedirectIfAuthenticated>
                      <Signup showAlert={showAlert} />
                    </RedirectIfAuthenticated>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </BrowserRouter>
        </NoteState>
      </div>
    </ThemeProvider>
  );
}

export default App;
