import React, { useEffect, useState } from "react";
import './Authorinfo.css';
import Axios from "axios";
import { Image } from "cloudinary-react";
import { Link } from "react-router-dom";



export function AuthorInfo(props) {


    const [authorinfo, setauthorinfo] = useState([]);
    const [following, setfollowign] = useState();

    const authorid = props.authorid;
    console.log(authorid)



    //geting the info of the user that have uploaded it
    useEffect(() => {

        Axios.get(`http://localhost:3001/user/${props.authorid}`).then((response) => {
            console.log('resp2' + JSON.stringify(response.data))
            const responsedata = (response.data);
            setauthorinfo(responsedata[0])

        });
    }, [props]);
    //////////////////////////////////////////////////////////////////////////*/







    //checking if the user have saved this
    useEffect(() => {
        Axios.get(`http://localhost:3001/follow/${authorid}/${sessionStorage.getItem("userid")}`).then((response) => {
            if (response.data == "not-empty") {
                console.log(`user with id : ${sessionStorage.getItem("userid")} have followed user with id  ${authorid} `)
                setfollowign(true);
            }
            else {
                console.log(`user with id : ${sessionStorage.getItem("userid")} didnt follow ${authorid} `)
                setfollowign(false);

            }
        });
    }, [following, authorinfo]);


    const follow = () => {

        Axios.post(`http://localhost:3001/follow/${authorid}/${sessionStorage.getItem("userid")}`).then((response) => {
            console.log(response);
            setfollowign(true);
        });
    };


    const unfollow = () => {
        Axios.post(`http://localhost:3001/follow/delete/${authorid}/${sessionStorage.getItem("userid")}`).then((response) => {
            console.log(response);
            setfollowign(false);
        });
    };






    return (
        <div className="authorinfocon">
            {( authorid != sessionStorage.getItem("userid") ) ?
                <>
                    {authorinfo === undefined ? <h1>one sec</h1> :
                        <div className="authorinfo">
                            <div className="main">
                            <Link to={`/visetuser/${authorinfo.id}`}>   <Image cloudName="djwvq9dfp" publicId={authorinfo.pic} className="userpic" /> </Link>
                            <h4 >{authorinfo.Name}  </h4>
                            </div>
                            {following ?
                                <button className="unfollow  overlaybutton" onClick={unfollow}>unfollow</button> :
                                <button className="follow overlaybutton" onClick={follow}>follow</button>}
                            <></>
                        </div>
                    }
                </>
                :
                <div className="authorinfo">
                    {authorinfo === undefined ? <h1>one sec</h1> :
                        <div className="authorinfo">
                            <Link to={`/visetuser/${authorinfo.id}`}>   <Image cloudName="djwvq9dfp" publicId={authorinfo.pic} className="userpic" /> </Link>
                            <h4 >{authorinfo.Name}  </h4>
                           {/* <h7> Its  you 🤪</h7> */}
                        </div>
                    }
                </div>
            }
        </div>

    );
}