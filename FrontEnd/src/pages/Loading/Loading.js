import React, { useEffect, useState } from "react";
import './Loading.css';
import { useHistory } from "react-router-dom";





export function Loading({ match }) {
	const postid = match.params.postid
	let history = useHistory();
	console.log(`${postid}`)
	setTimeout(function () { history.push(`/post/${postid}`); }, 500);

	return (
		<div className="con">
			<div class="loader"></div>

		</div>


	);
}