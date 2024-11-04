import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Image } from "cloudinary-react";
import "./Profile.css";
import Navbar from "../../components/Navbar/Navbar";
import { Gridcontaner } from "../../components/Gridcontaner/Gridcontaner";
import { useHistory } from "react-router-dom";
import { ProfileCard } from "../../components/ProfileCard/ProfileCard";




export function Profile() {
  let history = useHistory();

  const [msg, setmsg] = useState('');
  const [userinfo, setuserinfo] = useState([]);
  const [yourUploads, setYourUploads] = useState([]);


  useEffect(() => {
    Axios.get(`http://localhost:3001/user/${sessionStorage.getItem("userid")}`).then((response) => {
      setuserinfo(response.data[0]);
      console.log("used detailes fetched")
    });
  }, []);

  useEffect(() => {
    Axios.get(`http://localhost:3001/upload/byUser/${sessionStorage.getItem("userid")}`).then((response) => {
      setYourUploads(response.data);
      console.log("user uplouds fetched")
    });
  }, []);


  const [followingcount, setfollowingcount] = useState(0);
  const [followerscount, setfollowerscount] = useState(0);

  //getting the number of pepole user is follwing
  useEffect(() => {
    Axios.get(`http://localhost:3001/follow/count/following/${sessionStorage.getItem("userid")}`).then((response) => {
      setfollowingcount(response.data[0]['COUNT(following)']);
    });
  }, []);

  //getting the number of followers of this user
  useEffect(() => {
    Axios.get(`http://localhost:3001/follow/count/followers/${sessionStorage.getItem("userid")}`).then((response) => {
      setfollowerscount(response.data[0]['COUNT(follower)']);
    });
  }, []);



  function logout() {
    // a msg of come back soon 
    setmsg(' come back soon 😜 ')
    //after 1.5sec  will be dircted to the form page
    setTimeout(function () { history.push("/"); }, 1000);
    //deleting the user info 
    sessionStorage.setItem("loggedin", false);
    sessionStorage.setItem("userid", null);
  }

  /******************************************************* */
  const [ArrayOfUsersToDisplay, setArrayOfUsersToDisplay] = useState([]);

  function qs(whichElems) {
    return document.querySelector(whichElems);
  }

  function usersFollowThisUser() {
    console.log("clicked");
    //get the users that follow this user
    Axios.get(`http://localhost:3001/user/followers/${sessionStorage.getItem("userid")}`).then((response) => {
      setArrayOfUsersToDisplay(response.data);
      console.log(ArrayOfUsersToDisplay)
    });
    qs("#overlay").classList.add('active')
    qs("#userslist").classList.add('active')
  }

  function usersThisUserIsFollowing() {
    console.log("clicked");
    //getting the users that this user follow
    Axios.get(`http://localhost:3001/user/following/${sessionStorage.getItem("userid")}`).then((response) => {
      setArrayOfUsersToDisplay(response.data);
      console.log(ArrayOfUsersToDisplay)
    });
    qs("#overlay").classList.add('active')
    qs("#userslist").classList.add('active')
  }


  console.log(yourUploads)

  return (

    <div className="Profile">

      <Navbar></Navbar>
      <ProfileCard array={ArrayOfUsersToDisplay}></ProfileCard>
      {msg === "" ? null : <p id="msg">
        {msg}
      </p>}
      {sessionStorage.getItem("loggedin") == "true" ?
        <div>
          <div className='profileinfo'>

            <div className="profilepic">
              <Image cloudName="djwvq9dfp" publicId={userinfo.pic} />
            </div>

            <div className='accountinfoilement'>
              <h1>{userinfo.Name}</h1>
            </div>
            <div className='accountinfoilement'>
              <span>{userinfo.email}</span>
            </div>
            <div className='accountinfoilement nf'>
              <span> {followerscount} <span className='clickable' onClick={usersFollowThisUser}> followers </span> . {followingcount}<span className='clickable' onClick={usersThisUserIsFollowing}> following </span> </span>
            </div>
            <div className='accountinfoilement'>
              <button className="profbtn" onClick={logout}>logout</button><button className="profbtn" onClick={() => { history.push("/Update"); }}>update</button>
            </div>
          </div>
          <div className="viewingcateg">
            <button className="profbtn selected" onClick={() => { history.push("/profile"); }}> my Uploads </button>
            <button className="profbtn" onClick={() => { history.push("/Profile/saved"); }}> saved </button>
            <button className="profbtn" onClick={() => { history.push("/Profile/liked"); }}> liked </button>

          </div>
          <Gridcontaner array={yourUploads}></Gridcontaner>
        </div>


        :
        <h1>please signin first</h1>}

    </div>
  );
}


