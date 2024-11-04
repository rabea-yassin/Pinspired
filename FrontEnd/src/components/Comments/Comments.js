import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Image } from "cloudinary-react";
import "./Comments.css";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { Comment } from "../Comments/comment";






export function Comments(props) {
    let history = useHistory();

    const [newComment, setnewComment] = useState("");
    const [Commentsarr, setCommentsarr] = useState([]);

    //getting the Comments on this post

    useEffect(() => {
        Axios.get(`http://localhost:3001/comments/${props.postid}`).then((response) => {
            setCommentsarr(response.data);
            console.log(response.data)
            console.log("Comments fetched")
        });
    }, [props.postid]);


    /******************************************* */
    function addComment() {
        Axios.post("http://localhost:3001/comments/add", {
            comment: newComment,
            postid: props.postid,
            userid: sessionStorage.getItem("userid"),
            userpic: sessionStorage.getItem("userpic"),
        }).then((resp) => {
            Axios.get(`http://localhost:3001/comments/${props.postid}`).then((response) => {
                setCommentsarr(response.data);
                console.log(response.data)
                console.log("Comments fetched")
            });
        })

    }




    return (

        <div className="Comments">
            <div className="Enteracomment">
                <Image cloudName="djwvq9dfp" publicId={sessionStorage.getItem("userpic")} className="userpic" />
                <input type="text" placeholder="enter a comment ..." onChange={(event) => {
                    setnewComment(event.target.value);
                }} />
                <button onClick={addComment}>add </button>
            </div>
            <div className="existingcomments">
                {Commentsarr.map((val, key) => {
                    return (
                        <Comment comment={val.comment} userid={val.userId}></Comment>
                    );
                })}
            </div>

        </div>
    );
}


