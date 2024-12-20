import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Anime from './pages/Anime/AnimePage';
import Watch from './pages/Watch';
import GenSearch from './pages/Search/Gen';
import MainSearch from './pages/Search/Search';
import LancamentosPage from './pages/Anime/Lan';
import Login from './pages/Login';
import Register from './pages/Register';
import ProdSearch from './pages/Search/Prod';
import Download from './pages/Anime/Download';
import Agenda from './pages/Anime/Agenda';
import GlobalContext, { GlobalProvider } from './GlobalContext';
import UserPageSelf from './pages/User/UserSelf';
import UserPage from "./pages/User/UserPage";
import UserSearch from "./pages/Search/UserSearch";
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
        <Route path='/user' element={<UserPageSelf/>}/>
        <Route path='/user/:id' element={<UserPage/>}/>
        <Route path='/user/search' element={<UserSearch/>}/>
      </Routes>
    </GlobalProvider>
  </Router>
);
}
export default App;
