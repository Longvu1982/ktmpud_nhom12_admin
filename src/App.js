import "./App.css";
import Login from "./pages/Login";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { login, logout, selectUser } from "./features/userSlice";
import { useEffect, useLayoutEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Main from "./pages/Main";

function App() {
	const user = useSelector(selectUser);
	const dispatch = useDispatch();

	useLayoutEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user?.email) dispatch(login({ email: user.email, uid: user.uid }));
			else dispatch(logout());
		});

		return unsubscribe;
		// eslint-disable-next-line
	}, []);

	return (
		<Router>
			<div className="App">
				{user ? (
					<Routes>
						<Route path="/" element={<Main />} />
						<Route path="*" element={<Navigate to="/" />} />

						{/* <Route path="/register" element={<div>abc</div>} /> */}
					</Routes>
				) : (
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<div>abc</div>} />
						<Route path="*" element={<Navigate to="/login" />} />
					</Routes>
				)}
			</div>
		</Router>
	);
}

export default App;
