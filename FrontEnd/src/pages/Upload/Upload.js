import React, { useState } from "react";
import "./Upload.css";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";


export function Upload() {

  const [Error, setError] = useState('');
  const [msg, setmsg] = useState('');
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categname, setcategname] = useState("");
  const [link, setlink] = useState("");
  const [image, setImage] = useState([]);

  let history = useHistory();

  const upload = () => {
    console.log(image[0]);
    if (image[0] === undefined) { alert(" 🚫no img have been selected "); setError(" 🚫no image have been selected ") }
    else if (title === '' || categname === "") { setError(" 🚫you should include Title and category ") }
    else {
      setError('');
      setmsg(" dont leave yet ⏳ it will take some time ")
      const formData = new FormData();
      formData.append("file", image[0]);
      formData.append("upload_preset", "lguymv3o");
      Axios.post(
        `https://api.cloudinary.com/v1_1/djwvq9dfp/image/upload`,
        formData
      ).then((response) => {
        const fileName = response.data.public_id;
        Axios.post("http://localhost:3001/upload", {

          title: title,
          description: description,
          picpath: fileName,
          postedby: sessionStorage.getItem("userid"),
          link: link,
          categname: categname.toUpperCase(),
        }).then(() => {
          console.log('post have been uploaded successfully');
          setmsg("post have been uploaded successfully😝🥳")
          //after 1sec we will send the user to Home
          setTimeout(function () { history.push("/Home");; }, 1000);
        });
      });
    };
  }
  return (
    <div>
      {sessionStorage.getItem("loggedin") == "true" ?
        <div className="Upload">


          <div className="btns">
            <Link to='/Home'>return home</Link>
          </div>

          <h1>Create A Post</h1>
          <div className="UploadForm">
            <input type="file" onChange={(e) => setImage(e.target.files)} accept="image/*" />
            <input
              type="text"
              placeholder="Title..."
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Description..."
              onChange={(event) => {
                setDescription(event.target.value);
              }}
            />
            <input
              type="text"
              placeholder="enter Category (Super Cars,Nature.....)"
              onChange={(event) => {
                setcategname(event.target.value);
              }}
            />
            <input
              type="text"
              placeholder="you can add a link for source "
              onChange={(event) => {
                setlink(event.target.value);
              }}
            />
            {Error === "" ? null : <p id="Errors">
              {Error}
            </p>}
            {msg === "" ? null : <p id="msg">
              {msg}
            </p>}
            <button onClick={upload}>Upload</button>
          </div>
        </div>
        :
        <div className="Upload">
          <h1>please signin first</h1>
          <li> <Link to='/'> you can click here to signin/signup </Link></li>
        </div>}
    </div>

  );
}


