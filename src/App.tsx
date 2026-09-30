
import { Outlet } from 'react-router-dom'
import './App.css'
import MangaPage from './pages/MangaPage'
import Header from './layouts/Header/Header'

function App() {

 return (
    <div className="app-layout">
        <Header/>
        <main className='app-layout_main'>
            <Outlet/>
        </main>
    </div>
 )
  
}

export default App
