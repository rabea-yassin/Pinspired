import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Image } from "cloudinary-react";
import "./Comments.css";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";






export function Comment(props) {

    const [userpic, setuserpic] = useState("");
    const [username, setusername] = useState("");

    //getting the user details
    useEffect(() => {
        if (props.userid != undefined) {
            Axios.get(`http://localhost:3001/user/${props.userid}`).then((response) => {
                console.log("used detailes fetched")
                setuserpic(response.data[0].pic)
                setusername(response.data[0].Name)
            });
        }

    }, []);




    return (
        <div className="comment">
            <Link to={`/visetuser/${props.userid}`}><Image cloudName="djwvq9dfp" publicId={userpic} className="userpic" /></Link>
            <h3 className="commentby"> {username}:</h3>
            <h5> {props.comment}</h5>
        </div>

    );

}


