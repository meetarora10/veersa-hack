import Navbar from '../components/Navbar'
import img from '../assets/header_back2.jpg'
function Home() {
  return (
    <div className='bg-cover bg-center h-screen ' style={{backgroundImage: `url(${img})`}}>

      <Navbar />
    </div>
  )
}

export default Home
