import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Map from "./app/map/Map";
import NavBar from "./app/NavBar";
import Contacts from "./app/contact/Contact";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/state/:stateId" element={<Map />} />
        <Route path="/contacts" element={<Contacts />} /> 
      </Routes>
    </BrowserRouter>
  );
}