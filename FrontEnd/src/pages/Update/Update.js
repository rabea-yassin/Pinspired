import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Image } from "cloudinary-react";
import "./Update.css";
import Navbar from "../../components/Navbar/Navbar";
import { useHistory } from "react-router-dom";



export function Update() {


    const [Error, setError] = useState('');
    const [msg, setmsg] = useState('');
    const [userinfo, setuserinfo] = useState([]);
    const [image, setImage] = useState([]);
    const [NewName, setNewName] = useState("");
    const [CurrPass, setCurrPass] = useState("");
    const [NewPass, setNewPass] = useState("");
    /*************************************************** */
    let history = useHistory();



    useEffect(() => {
        Axios.get(`http://localhost:3001/user/${sessionStorage.getItem("userid")}`).then((response) => {
            setuserinfo(response.data[0]);
            console.log("used detailes fetched")
        });
    }, []);

    const Update = () => {
        setmsg('');
        if (NewPass === '' && NewName === "" && image[0] === undefined) { setError("🚫 Nothing has been received") }
        else {
            setmsg('one sec please 😀⏳ ')
            if (NewPass !== '') {
                //update the password to this user
                Axios.put("http://localhost:3001/Update/password", {
                    NewPass: NewPass,
                    userid: sessionStorage.getItem("userid"),
                    CurrPass: CurrPass,
                }).then((results) => {
                    console.log(JSON.stringify(results))
                    if (results.data.msg == undefined) {
                        setError(results.data.err)
                    }
                    else {
                        setmsg(msg + results.data.msg)
                    }
                    setmsg('one sec please 😀⏳ ')
                });
            }


            if (NewName !== "") {
                //update the username to this user
                Axios.put("http://localhost:3001/Update/username", {
                    NewName: NewName,
                    userid: sessionStorage.getItem("userid"),
                }).then((results) => {
                    console.log(JSON.stringify(results))
                    setmsg(`${msg} username  have been updated succesfuly✅      `)
                    setTimeout(() => {
                        setmsg('one sec please 😀⏳ ')
                    }, 1000);
                });

            }
            if (image[0] !== undefined) {
                setmsg('one sec please 😀⏳ ')
                //uploading the img to cludinary 
                const formData = new FormData();
                formData.append("file", image[0]);
                formData.append("upload_preset", "lguymv3o");
                Axios.post(
                    `https://api.cloudinary.com/v1_1/djwvq9dfp/image/upload`,
                    formData
                    // puting the new pic patth in the database
                ).then((response) => {
                    const fileName = response.data.public_id;
                    Axios.put("http://localhost:3001/Update/ProfilePic", {
                        picpath: fileName,
                        userid: sessionStorage.getItem("userid"),
                    }).then((results) => {
                        console.log(JSON.stringify(results))
                        setmsg(`${msg}pic have been updated succesfuly✅      `)
                        window.location.reload();
                    });
                })
            }
            if (image[0] == undefined) {
                window.location.reload();
            }
        }
        // window.location.reload();
    }
    ////////////////////////////////////////////////////////////////////////
    const [areYouSure, setareYouSure] = useState(0);
    const [yourUploads, setYourUploads] = useState([]);


    function DeleteThisUser() {
        if (areYouSure === 0) {
            alert("are you sure you want to delete your account!!🤔 all your actvites will vanish  if yes click delete again")
            setareYouSure(1)
            setTimeout(() => { setareYouSure(0); }, 1800);
        }
        else {
            let index
            //first we have to delete all the posts this user have uploaded
            Axios.get(`http://localhost:3001/upload/byUser/${userinfo.id}`).then((response) => {
                setYourUploads(response.data);
                for (index = 0; index < yourUploads.length; index++) {
                    Axios.delete(`http://localhost:3001/upload/${yourUploads[index].picpath}`)
                }
                if (index == yourUploads.length) {
                    Axios.delete(`http://localhost:3001/user/${userinfo.id}`).then((response) => {
                        console.log(response);
                        alert("user account have been deleted")
                        sessionStorage.setItem("loggedin", false);
                        sessionStorage.setItem("userid", null);
                        history.push(`/home`);
                    });
                }
            });

            // Axios.delete(`http://localhost:3001/upload/${userinfo.id}`).then((response) => {
            // 	console.log(response);
            // 	alert("post have been deleted")
            // 	history.push(`/home`);
            // });
        }


    }


    return (

        <div className="Update">
            <Navbar></Navbar>

            {sessionStorage.getItem("loggedin") == "true" ?
                <div>
                    <div className='Updateinfo'>
                        <div className="profilepic">
                            <Image cloudName="djwvq9dfp" publicId={userinfo.pic} />
                        </div>
                        <div className='accountinfoilement'>
                            <h1>{userinfo.Name}</h1>
                        </div>
                        <div className='accountinfoilement'>
                            <span>{userinfo.email}</span>
                        </div>
                    </div>
                    <div className="dashedline"> </div>
                    <div className="update-contaner">

                        <h3> Chosee your new profile pic  </h3>
                        <input type="file" onChange={(e) => setImage(e.target.files)} accept="image/*" />
                        <h3> new User name  </h3>
                        <input
                            type="text"
                            placeholder={userinfo.Name}
                            onChange={(event) => {
                                setNewName(event.target.value);
                            }}
                        />
                        <h2> new password,Enter your current password first  </h2>
                        <input
                            type="password"
                            placeholder="current password"
                            onChange={(event) => {
                                setCurrPass(event.target.value);
                            }}
                        />
                        <input
                            type="password"
                            placeholder="new password"
                            onChange={(event) => {
                                setNewPass(event.target.value);
                            }}
                        />
                        {Error === "" ? null : <h3 id="Errors">
                            {Error}
                        </h3>}
                        <button className="btn" onClick={Update}>Update info</button>
                        {msg === "" ? null : <p id="msg">
                            {msg}
                        </p>}

                        <button className=" delete" onClick={DeleteThisUser}  >Delete my account</button>
                    </div>
                </div>
                :
                <h1>please signin first</h1>}
        </div>
    );
}


