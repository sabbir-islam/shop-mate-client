import { Outlet } from 'react-router'
import './App.css'
import Navbar from './Component/Navbar'
import Footer from './Component/Footer'

function App() {


  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Navbar />
      
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Page Content */}
        <main className="flex-1 overflow-auto lg:ml-72 p-4 lg:p-6">
          <Outlet />
        </main>
        
        {/* Footer */}
        <Footer></Footer>
      </div>
    </div>
  )
}

export default App
