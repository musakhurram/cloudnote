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
                <Route path="/login" element={<Login showAlert={showAlert} />} />
                <Route path="/signup" element={<Signup showAlert={showAlert} />} />
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
