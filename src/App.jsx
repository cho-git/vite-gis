// React.lazy로 동적 로딩
import React, { Suspense } from "react";
import "./assets/css/base.css"

const MainPage = React.lazy(() => import('./pages/MainPage'));
const Modal = React.lazy(() => import("./modal/Modal"));

const App = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Modal />
        <MainPage />
      </Suspense>
    </div>
  );
};

export default App;
