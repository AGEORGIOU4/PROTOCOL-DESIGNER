import React, { Component, Suspense } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { TubeRackProvider } from "./context/TubeRackContext";
import "./scss/style.scss";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Suspense fallback={loading}>
          <TubeRackProvider>
            <Routes>
              <Route path="*" name="Home" element={<DefaultLayout />} />
            </Routes>
          </TubeRackProvider>
        </Suspense>
      </HashRouter>
    );
  }
}

export default App;
