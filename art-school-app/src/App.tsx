import { BrowserRouter, Routes, Route } from 'react-router-dom';
import USMap from "./app/map/USMap";
import StateMap from "./app/map/StateMap";
import NavBar from "./app/NavBar";
import Contacts from "./app/contact/Contact";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<USMap />} />
        <Route path="/state/:stateId" element={<StateMap />} />
        <Route path="/contacts" element={<Contacts />} /> 
      </Routes>
    </BrowserRouter>
  );
}