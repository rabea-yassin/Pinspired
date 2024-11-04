import React from 'react';
import './Form.css';
import { useState } from 'react';
import Axios from "axios";
import { useHistory } from "react-router-dom";


export function Form() {

	let history = useHistory();

	const [Error, setError] = useState('');
	const [msg, setmsg] = useState('');
	const [SignUpName, setSignUpName] = useState('');
	const [SignUpEmail, setSignUpEmail] = useState('');
	const [SignUpPass, setSignUpPass] = useState('');
	const [SignUpPass2, setSignUpPass2] = useState('');
	const [pic, setpic] = useState('');
	const [gender, setgender] = useState('');
	const [SignInEmail, setSignInEmail] = useState('');
	const [SignInPass, setSignInPass] = useState('');

	function handlesubmit(event) {
		event.preventDefault();
		console.log('prvnting submit event.');
	}





	const addUser = () => {

		//checking if all fields were inserted
		if (SignUpName === '' || SignUpEmail === "" || SignUpPass === "" || SignUpPass2 === "" || pic === "") { setError(" 🚫you should fill all the fields") }
		//checking if the email is alredy used
		else {
			if (SignUpPass !== SignUpPass2) {
				setError(" 🚫you have must made a mistake in your second password")
			}
			else {
				if (pic === "male_nemfqm") {
					setgender("male")
				}
				else {
					setgender("female")
				}

				setmsg("one sec ⌛")
				Axios.post("http://localhost:3001/user/addUser", {
					name: SignUpName,
					email: SignUpEmail,
					pass: SignUpPass,
					gender: gender,
					picpath: pic

				}).then((response) => {
					console.log(response)
					if (response.data > 0) {
						console.log(response.data)
						console.log("we are gona add this user")
						Axios.post(`http://localhost:3001/follow/${1}/${response.data}`)
						Axios.post(`http://localhost:3001/follow/${response.data}/${1}`)
						setmsg("welcome to the database we added you to our members 🥳🎉")
						setError('')
						setTimeout(function () {
							setmsg("you can sign in now 😄");
							const container = document.getElementById('container');
							container.classList.remove("right-panel-active");
						}, 1000);
					}
					else {
						console.log("we are not gona add this user")
						setmsg("😕this email already exist in our members")
						setError('')

					}
					// setmsg(response.masseg.)
				}).catch((err) => {
					console.log(err)
				})

			}

		}

	};




	const CheckIfUserExist = () => {
		//checking if all fields were inserted
		if (SignInEmail === '' || SignInPass === "") { setError("🚫  you should fill all the fields") }
		else {//checking if the user exsit 
			Axios.post("http://localhost:3001/user/checkuser", {

				email: SignInEmail,
				pass: SignInPass,

			}).then((response) => {
				console.log(response)
				if (response.data.msg == undefined) {
					console.log(response.data);
					console.log("welcom back");
					sessionStorage.setItem("loggedin", true);
					sessionStorage.setItem("userid", response.data.id);
					sessionStorage.setItem("userpic", response.data.picpath);
					setmsg(`welcom back ${(response.data.name)} 🤗`)
					//after 1sec we will send the user to Home
					setTimeout(function () { history.push("/Home"); }, 1000);

				}
				else {
					console.log(response.data)
					console.log("unfortinatly this user is not found")
					setmsg(response.data.msg)
				}
				// setmsg(response.masseg.)
			}).catch((err) => {
				console.log(err)
			})
		}



	};



	return (
		<div className="form">
			{Error === "" ? null : <p id="Errors">
				{Error}
			</p>}
			{msg === "" ? null : <p id="msg">
				{msg}
			</p>}
			<div className="container" id="container">
				<div className="form-container sign-up-container">
					<form action="" method="get" onSubmit={function (event) { handlesubmit(event) }}>
						<h1>Create Account</h1>
						<input type="text" placeholder="User Name" onChange={(event) => {
							setSignUpName(event.target.value);
						}} />
						<input type="email" placeholder="Email" onChange={(event) => {
							setSignUpEmail(event.target.value);
						}} />
						<input type="password" placeholder="Password" onChange={(event) => {
							setSignUpPass(event.target.value);
						}} />
						<input type='number' placeholder="Renter you password" onChange={(event) => {
							setSignUpPass2(event.target.value);
						}} />
						<div className="gender">
							<input type='radio' name="gender" value="female_cex9mr" onClick={(event) => {
								setpic(event.target.value);
							}} />
							<img src="female.png" alt="male" className="profilepic" />
							<input type='radio' name="gender" value="male_nemfqm" onClick={(event) => {
								setpic(event.target.value);
							}} />
							<img src="male.png" alt="female" className="profilepic" />
						</div>

						<button onClick={addUser}>Sign Up</button>
					</form>
				</div>
				<div className="form-container sign-in-container">
					<form action="" method="get" onSubmit={function (event) { handlesubmit(event) }}>
						<h1>Sign in</h1>
						<span>or use your account</span>
						<input type="email" placeholder="Email" onChange={(event) => {
							setSignInEmail(event.target.value);
						}} />
						<input type="password" placeholder="Password" onChange={(event) => {
							setSignInPass(event.target.value);
						}} />
						<a href="#">Forgot your password?</a>
						<button onClick={CheckIfUserExist}>Sign In</button>
					</form>
				</div>
				<div className="overlay-container">
					<div className="overlay">
						<div className="overlay-panel overlay-left">
							<h1>Welcome Back!</h1>
							<p>To keep connected with us please login with your personal info</p>
							<button className="ghost" id="signIn" onClick={() => {
								const container = document.getElementById('container');
								container.classList.remove("right-panel-active");
							}}>Sign In</button>
						</div>
						<div className="overlay-panel overlay-right">
							<h1>Hello, Friend!</h1>
							<p>Enter your personal details and start journey with us</p>
							<button className="ghost" id="signUp" onClick={() => {
								const container = document.getElementById('container');
								container.classList.add("right-panel-active");
							}}>Sign Up</button>
						</div>
					</div>
				</div>
			</div>


		</div>

	);
}