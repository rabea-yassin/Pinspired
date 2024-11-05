import React, { useEffect, useState } from "react";
import './PostDetails.css';
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { Image } from "cloudinary-react";
import { GridContaner } from "../../components/GridContainer/GridContaner";
import { ProfileCard } from "../../components/ProfileCard/ProfileCard";
import { Comments } from "../../components/Comments/Comments";
import { Link } from "react-router-dom";
import { AuthorInfo } from "../AuthorInfo/AuthorInfo";

export function PostDetails() {
	const { postid } = useParams();
	const [postinfo, setpostinfo] = useState([]);
	const [realateduploads, setrealateduploads] = useState([]);
	const [usersLikedThisPost, setusersLikedThisPost] = useState([]); // Define usersLikedThisPost
	let navigate = useNavigate();

	useEffect(() => {
		Axios.get(`http://localhost:3001/upload/postinfo/${postid}`).then((response) => {
			const responsedata = response.data;
			setpostinfo(responsedata[0]);
		});
	}, [postid]);

	useEffect(() => {
		if (postinfo && postinfo.categname) {
			Axios.get(`http://localhost:3001/Related/${postinfo.categname}/${postinfo.postedby}/${postid}`).then((response) => {
				setrealateduploads(response.data);
			});
		}
	}, [postinfo, postid]);

	const [saved, setsaved] = useState();
	const [liked, setliked] = useState();
	const [likesSum, setlikesSum] = useState(0);

	useEffect(() => {
		Axios.get(`http://localhost:3001/save/${postid}/${sessionStorage.getItem("userid")}`).then((response) => {
			setsaved(response.data === "not-empty");
		});
	}, [postid, saved]);

	useEffect(() => {
		Axios.get(`http://localhost:3001/like/${postid}/${sessionStorage.getItem("userid")}`).then((response) => {
			setliked(response.data === "not-empty");
		});
	}, [postid, liked]);

	useEffect(() => {
		Axios.get(`http://localhost:3001/like/count/likes/${postid}`).then((response) => {
			setlikesSum(response.data[0]['COUNT(userId)']);
		});
	}, [liked, postid]);

	const save = () => {
		Axios.post(`http://localhost:3001/save/${postid}/${sessionStorage.getItem("userid")}`).then(() => {
			setsaved(true);
		});
	};

	const unsave = () => {
		Axios.post(`http://localhost:3001/save/delete/${postid}/${sessionStorage.getItem("userid")}`).then(() => {
			setsaved(false);
		});
	};

	const like = () => {
		Axios.post(`http://localhost:3001/like/${postid}/${sessionStorage.getItem("userid")}`).then(() => {
			setliked(true);
		});
	};

	const unlike = () => {
		Axios.post(`http://localhost:3001/like/delete/${postid}/${sessionStorage.getItem("userid")}`).then(() => {
			setliked(false);
		});
	};

	function userslikedthispost() {
		Axios.get(`http://localhost:3001/like/${postinfo.picpath}`).then((response) => {
			setusersLikedThisPost(response.data); // Update the state with fetched data
		});
	}

	const [areYouSure, setareYouSure] = useState(0);
	function DeleteThisPost() {
		if (areYouSure === 0) {
			alert("Are you sure you want to delete this post? Click delete again if yes.");
			setareYouSure(1);
			setTimeout(() => { setareYouSure(0); }, 1800);
		} else {
			Axios.delete(`http://localhost:3001/upload/${postid}`).then(() => {
				alert("Post has been deleted");
				navigate(`/home`);
			});
		}
	}

	return (
		<>
			{postinfo ? (
				<div className="container">
					<Navbar />
					<ProfileCard array={usersLikedThisPost} />
					{sessionStorage.getItem("loggedin") === "true" ? (
						<div className="PostDetailsCon">
							<div className="PostDetails">
								<Image cloudName="djwvq9dfp" publicId={postinfo.picpath} className="postimg" />
								<div className="details">
									<div className="SnLndelete">
										<div className="saveNlike">
											{saved ? (
												<button className="unsave overlaybutton" onClick={unsave}>Unsave</button>
											) : (
												<button className="save overlaybutton" onClick={save}>Save</button>
											)}
											{liked ? (
												<Image cloudName="djwvq9dfp" publicId="heartcolored2_eu2aha" className="likebtn" onClick={unlike} />
											) : (
												<Image cloudName="djwvq9dfp" publicId="heart_fq2sre" className="likebtn" onClick={like} />
											)}
											<h4 onClick={userslikedthispost} className="likes">{likesSum} likes</h4>
										</div>
										{postinfo.postedby === sessionStorage.getItem("userid") && (
											<button className="overlaybutton" onClick={DeleteThisPost}>Delete</button>
										)}
									</div>
									{postinfo.postedby && <AuthorInfo authorid={postinfo.postedby} />}
									<div className="titleNdescription">
										<h3>Title: {postinfo.title}</h3>
										{postinfo.description && <h3>Description: {postinfo.description}</h3>}
										{postinfo.link && (
											<div className="source">
												<a href={postinfo.link} target="_blank" rel="noopener noreferrer">{postinfo.link}</a>
											</div>
										)}
									</div>
									<Comments postid={postinfo.picpath} />
								</div>
							</div>
							<div className="viewingcateg">
								<h1>More Like This</h1>
							</div>
							<GridContaner array={realateduploads} />
						</div>
					) : (
						<h1>Please sign in first</h1>
					)}
				</div>
			) : (
				<div className="notfound">
					<Link to='/Home'>Return home</Link>
					<h1>This post is not found 😢</h1>
				</div>
			)}
		</>
	);
}
