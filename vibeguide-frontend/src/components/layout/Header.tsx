import { Link } from 'react-router-dom'
import Navbar from '../navigation/Navbar'

export default function Header() {
  return (
    <header className="glass border-b border-white/20 sticky top-0 z-50 shadow-apple animate-slide-down">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between relative">
          <Link to="/" className="flex items-center space-x-3 group transition-all duration-300 ease-apple hover:scale-105">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-apple group-hover:shadow-glow transition-all duration-300 ease-apple">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent group-hover:animate-shimmer">VibeGuide</span>
          </Link>
          
          <Navbar />
        </nav>
      </div>
    </header>
  )
}