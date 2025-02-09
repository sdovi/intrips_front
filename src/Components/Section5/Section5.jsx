import React from "react";
import img from "./img/1.jpg";
import "./style.css";

export default function Section5() {
  return (
    <div className="sect5 container">
      <div
        className="sect5__bassein"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h5 className="sect5__txt-h5">Бассейны</h5>
      </div>
    </div>
  );
}
