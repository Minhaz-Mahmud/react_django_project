
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainHome from "./components/home_components/main_home";
import Registration from './components/registration/Registration'
import Login from './components/login/Login'

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <BrowserRouter>
       <Routes>
          <Route path='/' element={<MainHome/>}/>
          <Route path='/registration' element={<Registration/>}/>
          <Route path='/login' element={<Login/>}/>


       </Routes>
    </BrowserRouter>
  )
}

export default App




// import "bootstrap/dist/css/bootstrap.min.css";
// import MainHome from "./components/home_components/main_home";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./App.css";

// function App() {
//   return (
//     <div className="app-div">
//       <MainHome />
//     </div>
//   );
// }

// export default App;
