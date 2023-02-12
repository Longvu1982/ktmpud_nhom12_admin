import React from "react";
import Nav from "../components/Nav";
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
