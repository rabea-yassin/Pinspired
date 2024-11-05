import React, { useEffect, useState } from "react";
import "./Card.css";
import Axios from "axios";
import { Image } from "cloudinary-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";





export function Card(props) {

    let navigate = useNavigate();

    const [postinfo, setpostinfo] = useState([]);
    const [saved, setsaved] = useState();
    const [liked, setliked] = useState();


    useEffect(() => {
        Axios.get(`http://localhost:3001/upload/postinfo/${props.id}`).then((response) => {
            console.log('resp' + JSON.stringify(response.data))
            const responsedata = (response.data);
            setpostinfo(responsedata[0])

        });
    }, []);


    //checking if the user have saved this 
    useEffect(() => {
        Axios.get(`http://localhost:3001/save/${props.id}/${sessionStorage.getItem("userid")}`).then((response) => {
            if (response.data == "not-empty") {
                console.log(`user with id : ${sessionStorage.getItem("userid")} have saved post with picpath ${props.id} `)
                setsaved(true);
            }
            else {
                console.log(`user with id : ${sessionStorage.getItem("userid")} didnt save ${props.id} `)
                setsaved(false);

            }
        });
    }, [saved]);


    //checking if the user have liked this 
    useEffect(() => {
        Axios.get(`http://localhost:3001/like/${props.id}/${sessionStorage.getItem("userid")}`).then((response) => {
            if (response.data == "not-empty") {
                console.log(`user with id : ${sessionStorage.getItem("userid")} have saved post with picpath ${props.id} `)
                setliked(true);
            }
            else {
                console.log(`user with id : ${sessionStorage.getItem("userid")} didnt save ${props.id} `)
                setliked(false);

            }
        });
    }, [liked]);



    const save = () => {
        console.log("picpath" + props.id);
        console.log("userid" + sessionStorage.getItem("userid"));
        Axios.post(`http://localhost:3001/save/${props.id}/${sessionStorage.getItem("userid")}`).then((response) => {
            console.log(response);
            setsaved(true);
        });
    };


    const unsave = () => {
        Axios.post(`http://localhost:3001/save/delete/${props.id}/${sessionStorage.getItem("userid")}`).then((response) => {
            console.log(response);
            setsaved(false);
        });
    };


    const like = () => {
        console.log("picpath" + props.id);
        console.log("userid" + sessionStorage.getItem("userid"));
        Axios.post(`http://localhost:3001/like/${props.id}/${sessionStorage.getItem("userid")}`).then((response) => {
            console.log(response);
            setliked(true);
        });
    };


    const unlike = () => {
        Axios.post(`http://localhost:3001/like/delete/${props.id}/${sessionStorage.getItem("userid")}`).then((response) => {
            console.log(response);
            setliked(false);
        });
    };


    console.log(saved)

    console.log(postinfo)

    return (

        <div className="card" >
            <Image cloudName="djwvq9dfp" publicId={postinfo.picpath} className="card-img" />
            <div className="card-overlay">

                <div className="clickformore" onClick={()=>{navigate(`/post/${props.id}`);}}></div>
                {/* <Link to={`/post/${props.id}`}  className="clickformore"></Link>  */}
                {liked ? <Image cloudName="djwvq9dfp" publicId="heartcolored2_eu2aha" className="likebtn" onClick={unlike} /> : <Image cloudName="djwvq9dfp" publicId="heart_fq2sre" className="likebtn" onClick={like} />}
                {saved ? <button className="unsave  overlaybutton" onClick={unsave}>unsave</button> : <button className="save overlaybutton" onClick={save}>save</button>}
                {postinfo.link == '' ? <div></div> : <div className="source">
                    <div className='icon'> <img src="diagonal-arrow3.png" alt="" className="arrow2pic"></img></div>
                    <div className="link">  <a href={postinfo.link} target="_blank">{postinfo.link}</a> </div>
                </div>}

            </div>

        </div>

    );
}


