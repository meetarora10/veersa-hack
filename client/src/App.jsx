import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./components/Contact";
import Doctors from "./components/Doctors";

function App(){
    return (
        <div>
            <Home />
            <About />
            <Contact />
            <Doctors/>
        </div>
    );
}
export default App;