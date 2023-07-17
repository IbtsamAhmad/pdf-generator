import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../src/components/navbar";

import Home from "./pages/Home";
import UploadPage from "./pages/UploadPage";
import NullPage from "./pages/NullPage"
import "antd/dist/antd.css";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <>
      <Navbar />
      <RecoilRoot>
        <BrowserRouter>
          <Routes>
            <Route path="/upload" element={<UploadPage />} />

            <Route path="/" element={<Home />}></Route>

          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
  );
}

export default App;
