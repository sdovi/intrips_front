import React from "react";
import Navbar from "../Components/Navbar/Navbar";
import SectionMenu from "../Components/Section_menu/Section_menu";
import Footer from "../Components/Footer/Footer";
import AdminChat from "../Components/Chat/AdminChat";

export default function Main() {
  return (
    <div>
      <Navbar />
      <SectionMenu/>
      <AdminChat/>
      <Footer/>
    </div>
  );
}
