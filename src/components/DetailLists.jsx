import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { TablePagination } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faXmark } from "@fortawesome/free-solid-svg-icons";

function createData(name, calories, price) {
	return {
		name,
		calories,
		price,
		history: [
			{
				date: "2020-01-05",
				customerId: "11091700",
				amount: 3,
			},
			{
				date: "2020-01-02",
				customerId: "Anonymous",
				amount: 1,
			},
		],
	};
}

function Row(props) {
	const { row } = props;
	const [open, setOpen] = React.useState(false);

	return (
		<React.Fragment>
			<TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
				<TableCell>
					<FontAwesomeIcon icon = {faXmark} />
				</TableCell>
				<TableCell>
					<IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">
					{row.email}
				</TableCell>
				<TableCell align="right">{row.displayName}</TableCell>
				<TableCell align="right">{row.count}</TableCell>
				{/* <TableCell align="right">{row.fat}</TableCell> */}
				{/* <TableCell align="right">{row.carbs}</TableCell> */}
				{/* <TableCell align="right">{row.protein}</TableCell> */}
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Typography variant="h6" gutterBottom component="div">
								Danh sách đặt lịch
							</Typography>
							<Table size="small" aria-label="purchases">
								<TableHead>
									<TableRow>
										<TableCell sx={{ fontWeight: "bold" }} size="medium">
											Khu vực
										</TableCell>
										<TableCell sx={{ fontWeight: "bold" }}>Bác sĩ</TableCell>
										<TableCell sx={{ fontWeight: "bold" }} align="right">
											Chuyên khoa
										</TableCell>
										<TableCell sx={{ fontWeight: "bold" }} align="right">
											Thời gian
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{row.list.map((list) => (
										<TableRow key={list.time}>
											<TableCell size="medium" component="th" scope="row">
												{list.area}
											</TableCell>
											<TableCell size="medium">{list.doctors}</TableCell>
											<TableCell size="medium" align="right">
												{list.field}
											</TableCell>
											<TableCell size="medium" align="right">
												{list.time.replace("T", " - ")}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

// Row.propTypes = {
// 	row: PropTypes.shape({
// 		calories: PropTypes.number.isRequired,
// 		carbs: PropTypes.number.isRequired,
// 		fat: PropTypes.number.isRequired,
// 		history: PropTypes.arrayOf(
// 			PropTypes.shape({
// 				amount: PropTypes.number.isRequired,
// 				customerId: PropTypes.string.isRequired,
// 				date: PropTypes.string.isRequired,
// 			})
// 		).isRequired,
// 		name: PropTypes.string.isRequired,
// 		price: PropTypes.number.isRequired,
// 		protein: PropTypes.number.isRequired,
// 	}).isRequired,
// };

const rows = [
	createData("Frozen yoghurt", 159, 3.99),
	createData("Ice cream sandwich", 237, 4.99),
	createData("Eclair", 262, 3.79),
	createData("Cupcake", 305, 2.5),
	createData("Gingerbread", 356, 1.5),
];

export default function CollapsibleTable() {
	const [finalList, setFinalList] = React.useState([]);
	const [isLoading, setLoading] = React.useState(true);

	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	React.useEffect(() => {
		const getListData = async () => {
			const querySnapshot = await getDocs(collection(db, "users"));
			setLoading(false);
			console.log("querySnapshot :", querySnapshot.docs);
			const finalUserList = querySnapshot.docs
				.filter((doc) => doc.data().role === 1)
				.map((finalDoc) => {
					return {
						email: finalDoc.id,
						displayName: finalDoc.data().displayName,
						count: finalDoc.data().list.length,
						list: finalDoc.data().list,
					};
				});

			console.log("finalUserList :", finalUserList);
			setFinalList(finalUserList);
		};
		getListData();
	}, []);

	console.log("finalList", finalList);
	return isLoading ? (
		<div className="w-full h-screen bg-white">
			<FontAwesomeIcon size="lg" icon={faSpinner} color="#4accd1" className="ml-10 animate-spin mx-auto mt-20" />
		</div>
	) : (
		<Paper sx={{ padding: "20px", width: "100%", overflowY: "scroll", height: "100vh" }}>
			<TableContainer component={Paper}>
				<Table aria-label="collapsible table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell />
							
							<TableCell>Người dùng</TableCell>
							<TableCell align="right">Tên hiển thị</TableCell>
							<TableCell align="right">Số lượng</TableCell>
							{/* <TableCell align="right"></TableCell> */}
							{/* <TableCell align="right"></TableCell>  */}
						</TableRow>
					</TableHead>
					<TableBody>
						{finalList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
							<Row key={row.email} row={row} />
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[5, 10, 20]}
				// title="âfaff"
				component="div"
				labelRowsPerPage="Số hàng"
				labelDisplayedRows={({ from, to, count }) => {
					return `${from}–${to} / ${count !== -1 ? count : `hơn ${to}`}`;
				}}
				count={finalList.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}
