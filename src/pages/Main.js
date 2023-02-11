import React from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { logout } from "../features/userSlice";
import { useDispatch } from "react-redux";
import Nav from "../components/Nav";
import DetailLists from "../components/DetailLists";
import ColumnGroupingTable from "../components/DetailLists";

const Main = () => {

	return (
		<div className="flex">
			<Nav />
			<ColumnGroupingTable />
		</div>
	);
};

export default Main;
