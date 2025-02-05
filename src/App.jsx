// PageController 메뉴별 페이지

// import { HashRouter as Router, Route, Routes } from 'react-router-dom';
// import PrivateRoute from './routes/PrivateRoute';
// import { MainPage } from './pages/MainPage';
// import { Login } from './pages/Login';
// import './App.css'

// function App() {

//   return (
//     <div>
//       <Router>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route element={<PrivateRoute />}>
//             <Route path="/" element={<MainPage />} />
//           </Route>
//         </Routes>
//       </Router>
//     </div>
//   )
// }

// export default App



// React.lazy로 동적 로딩
import React, { Suspense } from "react";
import "./assets/css/base.css"


// const MainPage = React.lazy(() => import("./pages/MainPage"));
// const Logins = React.lazy(() => import("./pages/Login"));
const ReactMap = React.lazy(() => import("./features/gis/ReactMap"));

const App = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ReactMap />
      </Suspense>
    </div>
  );
};

export default App;