import React, { useState } from "react";
import "./Upload.css";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export function Upload() {
  const [Error, setError] = useState('');
  const [msg, setmsg] = useState('');
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categname, setcategname] = useState("");
  const [link, setlink] = useState("");
  const [image, setImage] = useState([]);
  let navigate = useNavigate();

  const upload = () => {
    console.log(image[0]);
    if (!image[0]) {
      alert("🚫 No image selected");
      setError("🚫 No image selected");
    } else if (title === '' || categname === "") {
      setError("🚫 Title and category are required");
    } else {
      setError('');
      setmsg("Uploading, please wait ⏳");

      // Create FormData for Cloudinary
      const formData = new FormData();
      formData.append("file", image[0]);
      formData.append("upload_preset", "lguymv3o");

      // Upload image to Cloudinary
      Axios.post(`https://api.cloudinary.com/v1_1/djwvq9dfp/image/upload`, formData)
          .then((response) => {
            const fileName = response.data.public_id;
            console.log("Image uploaded to Cloudinary:", fileName);

            // Post data to backend server
            Axios.post("http://localhost:3001/upload", {
              title: title,
              description: description,
              picpath: fileName,
              postedby: sessionStorage.getItem("userid"),
              link: link,
              categname: categname.toUpperCase(),
            })
                .then(() => {
                  console.log("Post has been uploaded successfully");
                  setmsg("Post uploaded successfully 😝🥳");
                  setTimeout(() => navigate("/Home"), 1000);
                })
                .catch((error) => {
                  console.error("Error posting to backend:", error);
                  setError("Failed to upload post. Please try again.");
                });
          })
          .catch((error) => {
            console.error("Error uploading to Cloudinary:", error);
            setError("Failed to upload image. Please try again.");
          });
    }
  };

  return (
      <div>
        {sessionStorage.getItem("loggedin") === "true" ? (
            <div className="Upload">
              <div className="btns">
                <Link to='/Home'>Return home</Link>
              </div>
              <h1>Create A Post</h1>
              <div className="UploadForm">
                <input type="file" onChange={(e) => setImage(e.target.files)} accept="image/*" />
                <input
                    type="text"
                    placeholder="Title..."
                    onChange={(event) => setTitle(event.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description..."
                    onChange={(event) => setDescription(event.target.value)}
                />
                <input
                    type="text"
                    placeholder="Category (e.g., Super Cars, Nature)"
                    onChange={(event) => setcategname(event.target.value)}
                />
                <input
                    type="text"
                    placeholder="Link to source (optional)"
                    onChange={(event) => setlink(event.target.value)}
                />
                {Error && <p id="Errors">{Error}</p>}
                {msg && <p id="msg">{msg}</p>}
                <button onClick={upload}>Upload</button>
              </div>
            </div>
        ) : (
            <div className="Upload">
              <h1>Please sign in first</h1>
              <li><Link to='/'>Sign in / Sign up</Link></li>
            </div>
        )}
      </div>
  );
}
