import React, { useEffect, useState } from "react";
import './Home.css';
import Axios from "axios";
import { useHistory } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import {Gridcontaner} from "../../components/Gridcontaner/Gridcontaner";




export function Home() {

	const [uploads, setUploads] = useState([]);

	useEffect(() => {
		if (!localStorage.getItem("loggedIn")) {
			localStorage.setItem("loggedIn", false);
		}
	}, []);

	useEffect(() => {
		Axios.get("http://localhost:3001/upload").then((response) => {
			console.log(response);
			console.log(response.data)
			setUploads(response.data);
			
		});
	}, []);

	console.log( uploads)
	
	return (
		<div className="Home">
			<Navbar></Navbar>
			{sessionStorage.getItem("loggedin") == "true" ?
				<Gridcontaner  array={uploads}></Gridcontaner>
				:
				<h1>please signin first</h1>}


		</div>

	);
}