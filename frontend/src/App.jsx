import React from "react";
import Home from "./pages/home";
import Footer from "./components/footer/footer";
import Navbar from "./components/navbar/navbar";


const App = () => {
  return <div>
    <Navbar />
    <Home />
    <Footer />
  </div>;
};

export default App;