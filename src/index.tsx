import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Anime from './pages/anime/AnimePage';
import Watch from './pages/anime/Watch';
import GenSearch from './pages/Search/Gen';
import MainSearch from './pages/Search/Search';
import LancamentosPage from './pages/Search/Lan';
import Login from './pages/User/Login';
import Register from './pages/User/Register';
import ProdSearch from './pages/Search/Prod';
import Download from './pages/anime/Download';
import Agenda from './pages/Search/Agenda';
import GlobalContext, { GlobalProvider } from './GlobalContext';
import UserPage from './pages/User/User';
const App:React.FC = ()=> {
return (
  <Router>
    <GlobalProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/Anime/lancamentos' element={<LancamentosPage />} />
        <Route path='/Anime/:id' element={<Anime />}/>
        <Route path='/Anime/:id/watch/:seasonId/:epId' element={<Watch />} />
        <Route path='/Anime/:id/download/:seasonId/:epId' element={<Download/>}/>
        <Route path='/Anime/agenda' element={<Agenda/>}/>
        <Route path='/gen/:gen' element={<GenSearch />} />
        <Route path='/prod/:prod' element={<ProdSearch type='Produtor'/>}/>
        <Route path='/crea/:prod' element={<ProdSearch type='Criador'/>}/>
        <Route path='/stud/:prod' element={<ProdSearch type='Estudio'/>}/>
        <Route path='/search' element={<MainSearch />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/user' element={<UserPage/>}/>
      </Routes>
    </GlobalProvider>
  </Router>
);
}
export default App;
