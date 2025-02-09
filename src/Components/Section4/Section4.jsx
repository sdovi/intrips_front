import React from 'react'

import img1 from "./img/1.jpg";
import img2 from "./img/1.jpg";
import img3 from "./img/1.jpg";
import img4 from "./img/1.jpg";

import './style.css'

export default function Section4() {
  return (
    <div>
    
    <div className="restaurants">
      <h6 className="restaurants__title">Рестораны и бары</h6>
      <div className="restaurants__cards">
        <div
          className="restaurants__card"
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url(${img1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <h6>Ресторан «Деревня»</h6>
        </div>
        <div
          className="restaurants__card"
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url(${img2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <h6>Ресторан «Ласточки»</h6>
        </div>
        <div
          className="restaurants__card"
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url(${img3})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <h6>Ресторан «Уют»</h6>
        </div>
        <div
          className="restaurants__card"
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url(${img4})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <h6>Ресторан «Гастроном»</h6>
        </div>
      </div>
    </div>
    </div>
  )
}
