import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Anime from './pages/AnimePage';
import Watch from './pages/Watch';
import GenSearch from './pages/Search/Gen';
import MainSearch from './pages/Search/Search';
import LancamentosPage from './pages/Lan';
import Login from './pages/Login';
import Register from './pages/Register';
const App:React.FC = ()=> {
return (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/Anime/lancamentos' element={<LancamentosPage />} />
      <Route path='/Anime/:id' element={<Anime />}/>
      <Route path='/Anime/:id/watch/:seasonId/:epId' element={<Watch />} />
      <Route path='/gen/:gen' element={<GenSearch />} />
      <Route path='/search' element={<MainSearch />} />
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
    </Routes>
  </Router>
);
}
export default App;