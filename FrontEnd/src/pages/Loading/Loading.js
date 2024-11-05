import React, { useEffect } from "react";
import './Loading.css';
import { useNavigate, useParams } from "react-router-dom"; // Add useParams

export function Loading() {
	const { postid } = useParams(); // Use useParams to get postid
	let navigate = useNavigate();
	console.log(`${postid}`);
	setTimeout(function () { navigate(`/post/${postid}`); }, 500);

	return (
		<div className="con">
			<div class="loader"></div>
		</div>
	);
}
