import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./components/Contact";
import Doctors from "./components/Doctors";
import Footer from "./components/Footer";

function App(){
    return (
        <div>
            <Home />
            <About />
            <Doctors/>
            <Contact />
            <Footer/>
        </div>
    );
}
export default App;