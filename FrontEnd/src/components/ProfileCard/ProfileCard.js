import React, { useEffect, useState } from "react";
import './ProfileCard.css';
import { Authorinfo } from "../../pages/Authorinfo/Authorinfo";



export function ProfileCard(props) {

  function qs(whichElems) {
    return document.querySelector(whichElems);
  }

  function deletedivcontent() {
    console.log("deletedivcontent")
    qs("#overlay").classList.remove('active')
    qs("#userslist").classList.remove('active')
  }

  return (
    <div className="ProfileCard-container">
      <div id="userslist"  >   {props.array.map((val, key) => {
        return (
          <Authorinfo authorid={val.id} ></Authorinfo>
        );
      })}</div>

      <div id="overlay" onClick={deletedivcontent} ></div>
    </div>
  );
}


