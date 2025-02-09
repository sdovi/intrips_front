import React from 'react'
import img from './img/1.jpg'
import img2 from './img/2.jpg'
import './style.css'

export default function Section6() {
  return (
    <div>
      <div className="secton1 sect2">
        <div className="container sect1_container">
          <p className="sect1__p1">Еда и напитки в номер</p>
          <div className="sect1__cards mt-3">
            <div
              className="sect1__card"
              style={{
                background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <h6>Основное меню</h6>
            </div>

            <div className="sect1__block-heith"></div>
            <div
              className="sect1__card"
              style={{
                background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url(${img2})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <h6>Основное меню</h6>
            </div>
          </div>
        </div>
      </div>  
    </div>
  )
}
