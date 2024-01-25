import Logo from '../assets/logo.png'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header>
      <nav className='bg-gradient-to-r from-pink-500 to-purple-800 w-full h-16 flex justify-between items-center py-3'>
      <Link to='/'>
        <div className='flex items-center gap-3 ml-48'>
          
            <span>
                <img src={Logo} alt="Venturus logo" />  
            </span>
            <p className='text-white md:text-2xl sm:text-md'>Music Management Tool</p>      
        </div>
      </Link>

        <div className='flex items-center gap-3 mr-48'>
            <p className='text-white font-medium hidden md:text-2xl md:inline-block lg:inline-block xl:inline-block'>
                Roger Ridley
            </p>      
            <span className='inline-block bg-white rounded-full text-2xl font-medium p-2 text-purple-900'>
                RR
            </span>       
        </div>      
              
      </nav>
   </header>
  )
}

export default Header