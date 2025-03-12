// React.lazy로 동적 로딩
import React, { Suspense } from "react";
import "./assets/css/base.css"


const ReactMap = React.lazy(() => import("./features/gis/ReactMap"));
const Modal = React.lazy(() => import("./modal/Modal"));

const App = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Modal />
        <ReactMap />
      </Suspense>
    </div>
  );
};

export default App;
