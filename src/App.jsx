import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import NewArtist from './pages/NewArtist';


const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <div className='bg-custom-color'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='new_artist' element={<NewArtist />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  )
}

export default App