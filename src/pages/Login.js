import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
// import { auth } from "../firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { db } from "../firebase";
import "./Login.css";
import { login } from "../features/userSlice";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
	const [isLoading, setLoading] = useState(false);
	// input binding
	const [adminName, setAdminName] = useState("");
	const [password, setPassword] = useState("");

	// firebase auth
	const auth = getAuth();

	// redux dispatch
	const dispatch = useDispatch();

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		const userDocRef = doc(db, "users", adminName);
		const docSnap = await getDoc(userDocRef);
		if (docSnap?.data()?.role === 2) {
			signInWithEmailAndPassword(auth, adminName, password)
				.then((user) => dispatch(login({ email: user.user.email, uid: user.user.uid })))
				.catch((e) => {
					if (e.code === "auth/wrong-password") {
						setLoading(false);
						alert("Sai tài khoản / mật khẩu");
						return;
					}
				});
		} else {
			setLoading(false);
			alert("Sai tài khoản / mật khẩu");
			return;
		}
	};

	return (
		<div className="login-container">
			<div className="screen">
				<div className="screen__content">
					<form className="login">
						<p style={{ marginBottom: 30, fontSize: 28, fontWeight: "bold", color: "#389ca0" }}>Nhóm 12 - Admin</p>
						<div className="login__field">
							<div>
								<FontAwesomeIcon icon={faUser} color="#4accd1" />
							</div>
							<input
								value={adminName}
								onChange={(e) => {
									setAdminName(e.target.value);
								}}
								type="text"
								className="login__input"
								placeholder="Tài khoản"
							></input>
						</div>
						<div className="login__field">
							<div>
								<FontAwesomeIcon icon={faChevronCircleRight} color="#4accd1" />
							</div>
							<input
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
								}}
								type="password"
								className="login__input"
								placeholder="Mật khẩu"
							></input>
						</div>
						<button
							className="button login__submit flex items-center justify-start"
							onClick={(e) => {
								handleLogin(e);
							}}
						>
							<span className="button__text">Đăng nhập NGAY</span>
							{isLoading && <FontAwesomeIcon size="lg" icon={faSpinner} className="ml-10 animate-spin" />}
						</button>
					</form>
				</div>
				<div className="screen__background">
					<span className="screen__background__shape screen__background__shape4"></span>
					<span className="screen__background__shape screen__background__shape3"></span>
					<span className="screen__background__shape screen__background__shape2"></span>
					<span className="screen__background__shape screen__background__shape1"></span>
				</div>
			</div>
		</div>
	);
};

export default Login;
