import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuitcaseMedical } from "@fortawesome/free-solid-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import { logout } from "../features/userSlice";
import { useDispatch } from "react-redux";
import { auth } from "../firebase";
const Nav = () => {
	const dispatch = useDispatch();
	const handleSignOut = async () =>
		signOut(auth)
			.then(() => {
				dispatch(logout());
			})
			.catch((error) => {
				// An error happened.
			});
	return (
		<div className="h-screen w-72 bg-[#389ca0] flex flex-col justify-between">
			<div>
				<div className="py-10 border-b-2 border-white flex items-center justify-center">
					<FontAwesomeIcon color="#fff" icon={faSuitcaseMedical} className="mr-4" />
					<span className="font-semibold text-white text-lg">NHOM12 ADMIN</span>
				</div>
				<div className="mt-10 text-white">
					<p className="mb-4 py-3 bg-[#6bc5c8c1] hover:opacity-60 cursor-pointer">Thông tin khách hàng</p>
					{/* <p className="mb-4 py-3 hover:opacity-60 hover:bg-[#6bc5c85d] cursor-pointer">Thông tin khách hàng</p> */}
					{/* <p className="mb-4 py-3 hover:opacity-60 hover:bg-[#6bc5c85d] cursor-pointer">Thông tin khách hàng</p> */}
				</div>
			</div>
			<div
				onClick={handleSignOut}
				className="mb-10 cursor-pointer hover:opacity-60 hover:bg-[#6bc5c85d] py-3 text-white flex justify-center items-center"
			>
				<FontAwesomeIcon color="#fff" icon={faRightFromBracket} className="mr-4" />
				<p>Đăng xuất</p>
			</div>
		</div>
	);
};

export default Nav;
