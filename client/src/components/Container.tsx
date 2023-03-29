import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import EventsContainer from "../pages/Events/EventsContainer";

export const Container = () => {

  return (
    <Routes>
      <Route path="/" element={<EventsContainer />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};
