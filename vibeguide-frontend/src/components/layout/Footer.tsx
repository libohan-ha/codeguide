export default function Footer() {
  return (
    <footer className="glass border-t border-white/20 py-12 mt-auto backdrop-blur-md relative">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-3 mb-6 group hover:scale-105 transition-all duration-300 ease-apple">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-apple group-hover:shadow-glow transition-all duration-300 ease-apple">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">VibeGuide</span>
        </div>
        <p className="text-gray-600 text-sm opacity-80 hover:opacity-100 transition-opacity duration-300">
          © 2025 VibeGuide. 让AI赋能您的开发之路.
        </p>
        
        {/* 底部装饰光晕 */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-primary opacity-30 blur-sm" />
      </div>
    </footer>
  )
}