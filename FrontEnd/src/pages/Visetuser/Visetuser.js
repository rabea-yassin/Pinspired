import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Image } from "cloudinary-react";
import "./Visetuser.css";
import Navbar from "../../components/Navbar/Navbar";
import {Gridcontaner} from "../../components/Gridcontaner/Gridcontaner";
import { useHistory } from "react-router-dom";
import { ProfileCard } from "../../components/ProfileCard/ProfileCard";
import { Link } from "react-router-dom";




export function Visetuser({ match }) {
  let history = useHistory();

  const [msg, setmsg] = useState('');
  const [userinfo, setuserinfo] = useState([]);
  const [userUploads, setuserUploads] = useState([]);
  const userid = match.params.userid
  const [following, setfollowign] = useState();



//getting the user details
  useEffect(() => {
    Axios.get(`http://localhost:3001/user/${userid}`).then((response) => {
      setuserinfo(response.data[0]);
      console.log("used detailes fetched")
    });
  }, []);


  //getting the uploads that user have uploaded
  useEffect(() => {
    Axios.get(`http://localhost:3001/upload/byUser/${userid}`).then((response) => {
        setuserUploads(response.data);
      console.log("user uplouds fetched")
    });
  }, []);


    //checking if the user have followed this author
    useEffect(() => {
        Axios.get(`http://localhost:3001/follow/${userid}/${sessionStorage.getItem("userid")}`).then((response) => {
            if (response.data == "not-empty") {
                console.log(`user with id : ${sessionStorage.getItem("userid")} have followed user with id  ${userid} `)
                setfollowign(true);
            }
            else {
                console.log(`user with id : ${sessionStorage.getItem("userid")} didnt follow ${userid} `)
                setfollowign(false);

            }
        });
    }, [following, userid]);


    const follow = () => {

        Axios.post(`http://localhost:3001/follow/${userid}/${sessionStorage.getItem("userid")}`).then((response) => {
            console.log(response);
            setfollowign(true);
        });
    };


    const unfollow = () => {
        Axios.post(`http://localhost:3001/follow/delete/${userid}/${sessionStorage.getItem("userid")}`).then((response) => {
            console.log(response);
            setfollowign(false);
        });
    };



    const [followingcount, setfollowingcount] = useState(0);
    const [followerscount, setfollowerscount] = useState(0);

//getting the number of pepole user is follwing
useEffect(() => {
    Axios.get(`http://localhost:3001/follow/count/following/${userid}`).then((response) => {
        setfollowingcount(response.data[0]['COUNT(following)']);
    });
  },[following, userid]);

//getting the number of followers of this user
useEffect(() => {
    Axios.get(`http://localhost:3001/follow/count/followers/${userid}`).then((response) => {
        setfollowerscount(response.data[0]['COUNT(follower)']);
    });
  },[following, userid]);

/******************************************************* */
const [ArrayOfUsersToDisplay, setArrayOfUsersToDisplay] = useState([]);

function qs(whichElems) {
  return document.querySelector(whichElems);
}

function usersFollowThisUser() {
  console.log("clicked");
  //get the users that follow this user
  Axios.get(`http://localhost:3001/user/followers/${userid}`).then((response) => {
    setArrayOfUsersToDisplay(response.data);
    console.log(ArrayOfUsersToDisplay)
  });
  qs("#overlay").classList.add('active')
  qs("#userslist").classList.add('active')
}

function usersThisUserIsFollowing(){
  console.log("clicked");
  //getting the users that this user follow
  Axios.get(`http://localhost:3001/user/following/${userid}`).then((response) => {
    setArrayOfUsersToDisplay(response.data);
    console.log(ArrayOfUsersToDisplay)
  });
  qs("#overlay").classList.add('active')
  qs("#userslist").classList.add('active')
}

  console.log(userUploads)

  return (
<>
{userinfo != undefined ?
 <div className="Visetuser">

      <Navbar></Navbar>
			<ProfileCard array={ArrayOfUsersToDisplay}></ProfileCard>
      {msg === "" ? null : <p id="msg">
        {msg}
      </p>}
      {sessionStorage.getItem("loggedin") == "true" ?
        <div>
          <div className='profileinfo'>

            <div className="profilepic">
              <Image cloudName="djwvq9dfp" publicId={userinfo.pic} className="card-img" />  
              </div>

            <div className='accountinfoilement'>
              <h1>{userinfo.Name}</h1>
            </div>
            <div className='accountinfoilement'>
              <span>{userinfo.email}</span>
            </div>
            <div className='accountinfoilement nf'>
              <span> {followerscount} <span className='clickable' onClick={usersFollowThisUser}> followers </span> . {followingcount}<span className='clickable'  onClick={usersThisUserIsFollowing}> following </span> </span>
            </div>
            {( userinfo.id != sessionStorage.getItem("userid") ) ?

            <div className='accountinfoilement'>
            {following ?
                                <button className="unfollow  overlaybutton" onClick={unfollow}>unfollow</button> :
                                <button className="follow overlaybutton" onClick={follow}>follow</button>}
            </div>:<></>}
          </div>
          <div className="viewingcateg"> 
           <h1>uploads</h1>
              </div>
              <Gridcontaner  array={userUploads}></Gridcontaner>
        </div>


        :
        <h1>please signin first</h1>}

    </div>
    :< div className="notfound">
    <div className="btns">
      <Link to='/Home'>return home</Link>
    </div>
    <h1 > this user is not found 😢</h1>
  </div>}
</>
   
  );
}


