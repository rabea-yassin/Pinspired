import React, { useEffect, useState } from "react";
import './Friends.css';
import Axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import { GridContaner } from "../../components/GridContainer/GridContaner";





export function Friendspost() {

	const [friendspost, setfriendspost] = useState([]);

	useEffect(() => {
		if (!localStorage.getItem("loggedIn")) {
			localStorage.setItem("loggedIn", false);
		}
	}, []);

	useEffect(() => {
		Axios.get(`http://localhost:3001/upload/${sessionStorage.getItem("userid")}`).then((response) => {
			console.log(response);
			console.log(response.data)
			setfriendspost(response.data);

		});
	}, []);
	
	console.log(friendspost)

	return (
		<div className="friendsposts">
			<Navbar></Navbar>
			<div>
				{sessionStorage.getItem("loggedin") == "true" ?
					<GridContaner array={friendspost}></GridContaner>
					:
					<h1>please signin first</h1>}
			</div>
			<div className="note">
			<h2>that is all the posts your friends have posted 😄 for more follow more Users and explore the world 🌍  </h2>
			</div>
			
		</div>
	);
}