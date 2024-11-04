import React, { useEffect, useState } from "react";
import './PostDetails.css';
import Axios from "axios";
import { useHistory } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { Image } from "cloudinary-react";
import { Gridcontaner } from "../../components/Gridcontaner/Gridcontaner";
import { ProfileCard } from "../../components/ProfileCard/ProfileCard";
import { Comments } from "../../components/Comments/Comments";
import { Link } from "react-router-dom";
import { Authorinfo } from "../Authorinfo/Authorinfo";




export function PostDetails({ match }) {


	const [postinfo, setpostinfo] = useState([]);
	const [realateduploads, setrealateduploads] = useState([]);
	let history = useHistory();

	const postid = match.params.postid


	//geting the info of the post 
	useEffect(async () => {
		Axios.get(`http://localhost:3001/upload/postinfo/${postid}`).then((response) => {
			console.log('resp' + JSON.stringify(response.data))
			const responsedata = (response.data);
			setpostinfo(responsedata[0])



		});
	}, []);


	//getting related uploads (from the same author or the sane categoriy )
	useEffect(() => {
		if (postinfo != undefined) {
			if (postinfo.categname != undefined) {
				Axios.get(`http://localhost:3001/Related/${postinfo.categname}/${postinfo.postedby}/${postid}`).then((response) => {
					setrealateduploads(response.data);
					console.log("user uplouds fetched")
				});
			}
		}


	}, [postinfo]);






	//////////////////////////////////////////////////////////////////////////*/

	const [saved, setsaved] = useState();
	const [liked, setliked] = useState();
	const [likesSum, setlikesSum] = useState(0);






	//checking if the user have saved this 
	useEffect(() => {
		Axios.get(`http://localhost:3001/save/${postid}/${sessionStorage.getItem("userid")}`).then((response) => {
			if (response.data == "not-empty") {
				console.log(`user with id : ${sessionStorage.getItem("userid")} have saved post with picpath ${postid} `)
				setsaved(true);
			}
			else {
				console.log(`user with id : ${sessionStorage.getItem("userid")} didnt save ${postid} `)
				setsaved(false);

			}
		});
	}, [saved]);


	//checking if the user have liked this 
	useEffect(() => {
		Axios.get(`http://localhost:3001/like/${postid}/${sessionStorage.getItem("userid")}`).then((response) => {
			if (response.data == "not-empty") {
				console.log(`user with id : ${sessionStorage.getItem("userid")} have saved post with picpath ${postid} `)
				setliked(true);
			}
			else {
				console.log(`user with id : ${sessionStorage.getItem("userid")} didnt save ${postid} `)
				setliked(false);

			}
		});
	}, [liked]);


	//getting the number of likes on this post
	useEffect(() => {
		Axios.get(`http://localhost:3001/like/count/likes/${postid}`).then((response) => {
			setlikesSum(response.data[0]['COUNT(userId)']);
		});
	}, [liked]);




	const save = () => {
		console.log("picpath" + postid);
		console.log("userid" + sessionStorage.getItem("userid"));
		Axios.post(`http://localhost:3001/save/${postid}/${sessionStorage.getItem("userid")}`).then((response) => {
			console.log(response);
			setsaved(true);
		});
	};


	const unsave = () => {
		Axios.post(`http://localhost:3001/save/delete/${postid}/${sessionStorage.getItem("userid")}`).then((response) => {
			console.log(response);
			setsaved(false);
		});
	};


	const like = () => {
		console.log("picpath" + postid);
		console.log("userid" + sessionStorage.getItem("userid"));
		Axios.post(`http://localhost:3001/like/${postid}/${sessionStorage.getItem("userid")}`).then((response) => {
			console.log(response);
			setliked(true);
		});
	};


	const unlike = () => {
		Axios.post(`http://localhost:3001/like/delete/${postid}/${sessionStorage.getItem("userid")}`).then((response) => {
			console.log(response);
			setliked(false);
		});
	};
	/******************************************************************** */
	function qs(whichElems) {
		return document.querySelector(whichElems);
	}




	const [usersLikedThisPost, setusersLikedThisPost] = useState([]);

	function userslikedthispost() {
		console.log("clicked");
		//change the plane we are gonna present them in the same page
		//first we need to get the info of the people that liked this 
		Axios.get(`http://localhost:3001/like/${postinfo.picpath}`).then((response) => {
			setusersLikedThisPost(response.data);
			console.log(usersLikedThisPost)
			console.log(JSON.stringify(usersLikedThisPost))
			console.log("users liked this post  ")
		});
		qs("#overlay").classList.add('active')
		qs("#userslist").classList.add('active')

	}
	////////////////////////////////////////////////////////////////////////
	const [areYouSure, setareYouSure] = useState(0);


	function DeleteThisPost() {
		if (areYouSure === 0) {
			alert("are you sure you want to delete this post! if yes click delete again")
			setareYouSure(1)
			setTimeout(() => { setareYouSure(0); }, 1800);
		}
		else {
			Axios.delete(`http://localhost:3001/upload/${postid}`).then((response) => {
				console.log(response);
				alert("post have been deleted")
				history.push(`/home`);
			});
		}
	}



	return (
		<>
			{postinfo != undefined ?
				<div className="container">
					<Navbar></Navbar>
					<ProfileCard array={usersLikedThisPost}></ProfileCard>
					{sessionStorage.getItem("loggedin") == "true" ?
						<div className="PostDetailsCon">
							<div className="PostDetails">
								<Image cloudName="djwvq9dfp" publicId={postinfo.picpath} className="postimg" />
								{/* <div className="justForSpace"></div> */}
								<div className="details">
									<div className="SnLndelete">
										<div className="saveNlike">
											{saved ? <button className="unsave  overlaybutton" onClick={unsave}>unsave</button> : <button className="save overlaybutton" onClick={save}>save</button>}
											{liked ? <Image cloudName="djwvq9dfp" publicId="heartcolored2_eu2aha" className="likebtn" onClick={unlike} /> : <Image cloudName="djwvq9dfp" publicId="heart_fq2sre" className="likebtn" onClick={like} />}
											<h4 onClick={userslikedthispost} className="likes">{likesSum} likes</h4>
										</div>
										{(postinfo.postedby != sessionStorage.getItem("userid")) ?
											<></> :
											<button className="overlaybutton" onClick={DeleteThisPost}  >Delete</button>}
									</div>
									{postinfo.postedby !=undefined?
									<Authorinfo authorid={postinfo.postedby} ></Authorinfo>:
									<h1>one sec</h1>
									}
									<div className="titleNdescription">
										<p><h3>Title :  {postinfo.title}</h3>    </p>
										{postinfo.description == '' ? <div></div> : <p><h3>Description : {postinfo.description}</h3>   </p>}
										<></>
										{postinfo.link == '' ? <div></div> : <div className="source">
											<div className="link">  <a href={postinfo.link} target="_blank">{postinfo.link}</a> </div>
										</div>}
									</div>
									<Comments postid={postinfo.picpath}></Comments>

								</div>

							</div>
							<div className="viewingcateg">
								<h1>More Like This</h1>
							</div>
							<Gridcontaner array={realateduploads}></Gridcontaner>
						</div>
						:

						<h1>please signin first</h1>

					}
				</div>
				: < div className="notfound">
					<div className="btns">
						<Link to='/Home'>return home</Link>
					</div>
					<h1 > this post is not found 😢</h1>
				</div>
			}

		</>


	);
}