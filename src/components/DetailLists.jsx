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
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  setDoc,
} from "firebase/firestore";
import { TablePagination } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faSpinner,
  faXmark,
  faMinus,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";

const AddUser = ({ reloadList }) => {
  const auth = getAuth();
  const [isOpen, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const handleCreateUser = (e) => {
    e.preventDefault();
    if (
      email.trim() === "" ||
      password.trim() === "" ||
      displayName.trim() === ""
    ) {
      alert("Điền đẩy đủ thông tin!");
      return;
    }
    if (!/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(email)) {
      alert("Hãy điền email đúng format!");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const addInit = async () => {
          await setDoc(
            doc(db, "users", userCredential.user.email),
            {
              displayName,
              role: 1,
              list: [],
            },
            {
              merge: true,
            }
          );
        };
        addInit().then(() => {
          updateProfile(userCredential.user, {
            displayName,
          }).then(() => {
            setOpen(false);
            reloadList();
          });
        });
      })
      .catch((err) => {
        if (err.code === "auth/email-already-in-use") {
          alert("Email đã tồn tại");
          return;
        }
      });
  };
  return (
    <>
      {!isOpen && (
        <div className="flex items-center justify-end mt-4">
          <div
            className="flex items-center justify-center group cursor-pointer space-x-2"
            onClick={() => setOpen(!isOpen)}
          >
            <span>Thêm thành viên</span>
            <FontAwesomeIcon
              className="group-hover:text-[#389ca0] group-hover:scale-125 transition-all"
              icon={faPlusCircle}
            />
          </div>
        </div>
      )}
      {isOpen && (
        <div>
          <form action="" className="flex flex-col gap-5 mt-5 items-end">
            <div className="flex gap-5">
              <div className="flex items-start flex-col gap-2 w-56">
                <label htmlFor="">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-2 w-full py-2 border-2 border-[#389ca0] rounded-md"
                  type="text"
                  placeholder="email"
                />
              </div>
              <div className="flex items-start flex-col gap-2 w-56">
                <label htmlFor="">Mật khẩu</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-2 w-full py-2 border-2 border-[#389ca0] rounded-md"
                  type="password"
                  placeholder=""
                />
              </div>
            </div>
            <div className="flex items-end gap-5">
              <div className="flex items-start flex-col gap-2 w-56">
                <label htmlFor="">Tên hiển thị</label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="p-2 w-full py-2 border-2 border-[#389ca0] rounded-md"
                  type="text"
                  placeholder="VD: Quyên Trương"
                />
              </div>
              <div className="w-56 flex justify-around">
                <input
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                  }}
                  type="submit"
                  value={"Huỷ bỏ"}
                  className="px-4 py-2 border-2 border-red-400  text-red-400 font-semibold rounded-md cursor-pointer hover:opacity-60 transition-all"
                />
                <input
                  onClick={(e) => handleCreateUser(e)}
                  type="submit"
                  value={"Đồng ý"}
                  className="px-4 py-2 border-2 border-[#389ca0] bg-[#389ca0] text-white font-semibold rounded-md cursor-pointer hover:opacity-60 transition-all"
                />
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

const AddCalendar = ({ email, getListData }) => {
  const auth = getAuth();
  const [isOpen, setOpen] = React.useState(false);
  const [selectedArea, setSelectedArea] = React.useState("Hà Nội");
  const [selectedField, setSelectedField] = React.useState("Thần kinh");
  const [selectedDoctor, setSelectedDoctor] = React.useState("Adam Taylor");
  const [selectedDate, setSelectedDate] = React.useState("");

  const userDocRef = doc(db, "users", email);

  const handleChangeArea = (e) => {
    setSelectedArea(e.target.value);
  };

  const handleChangeField = (e) => {
    setSelectedField(e.target.value);
  };

  const handleChangeDoctor = (e) => {
    setSelectedDoctor(e.target.value);
  };

  const handleChangeDate = (e) => {
    setSelectedDate(e.target.value);
  };

  const getListDoctor = () => {
    const doctors = {
      "Thần kinh": ["Adam Taylor"],

      "Tâm lí": ["Alice Grue"],

      "Tim mạch": ["Joseph Murphy", "Alison Davis"],
    };

    return doctors[selectedField];
  };

  const setMinSelectedDate = () => {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow = tomorrow.toISOString().slice(0, 16);
    return tomorrow;
  };

  const handleCreateCalendar = async (e) => {
    e.preventDefault();
    // console.log(selectedArea);
    // console.log(selectedField);
    // console.log(selectedDoctor);
    // console.log(selectedDate);
    if (selectedDate === "") {
      alert("Hãy chọn ngày giờ");
      return;
    }
    const updateDocList = async () => {
      await updateDoc(userDocRef, {
        list: arrayUnion({
          uid: new Date().toISOString(),
          time: selectedDate,
          area: selectedArea,
          field: selectedField,
          doctors: selectedDoctor,
        }),
      });
    };
    await updateDocList();
    getListData();
  };
  return (
    <>
      {!isOpen && (
        <div className="flex items-center justify-end mt-4">
          <div
            className="flex items-center justify-center group cursor-pointer space-x-2"
            onClick={() => setOpen(!isOpen)}
          >
            <span>Thêm lịch</span>
            <FontAwesomeIcon
              className="group-hover:text-[#389ca0] group-hover:scale-125 transition-all"
              icon={faPlusCircle}
            />
          </div>
        </div>
      )}
      {isOpen && (
        <div>
          <form
            action=""
            className="flex flex-col gap-4 mt-5 items-end justify-end"
          >
            <div className="flex items-center gap-4">
              {/* time  */}
              <div className="flex items-start flex-col gap-2 w-56">
                <label htmlFor="">Thời gian</label>
                <input
                  value={selectedDate}
                  onChange={handleChangeDate}
                  min={setMinSelectedDate()}
                  className="p-2 py-2 border-2 border-[#389ca0] w-full rounded-md"
                  type="datetime-local"
                />
              </div>

              {/* area  */}
              <div className="flex items-start flex-col gap-2 w-56">
                <label>Khu vực</label>
                <select
                  // defaultValue={selectedArea}
                  value={selectedArea}
                  onChange={handleChangeArea}
                  className="border-2 w-full border-[#389ca0] rounded-md h-[42px] p-2"
                >
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TPHCM">TPHCM</option>
                  <option value="Thái Nguyên">Thái Nguyên</option>
                  <option value="Lào Cai">Lào Cai</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* field  */}
              <div className="flex items-start flex-col gap-2 w-56">
                <label>Chuyên khoa</label>
                <select
                  // defaultValue={selectedField}
                  value={selectedField}
                  onChange={handleChangeField}
                  className="border-2 border-[#389ca0] w-full rounded-md p-2"
                >
                  <option value="Thần kinh">Thần kinh</option>
                  <option value="Tâm lí">Tâm lí</option>
                  <option value="Tim mạch">Tim mạch</option>
                </select>
              </div>

              {/* doctor */}
              <div className="flex items-start flex-col gap-2 w-56">
                <label>Bác sĩ</label>
                <select
                  // defaultValue={selectedDoctor}
                  value={selectedDoctor}
                  onChange={handleChangeDoctor}
                  className="border-2 border-[#389ca0] w-full rounded-md p-2"
                >
                  {getListDoctor().map((item) => {
                    return (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div>
              <input
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                }}
                type="submit"
                value={"Huỷ bỏ"}
                className="px-4 py-2 border-2 border-red-400  text-red-400 font-semibold rounded-md cursor-pointer hover:opacity-60 transition-all ml-5"
              />
              <input
                onClick={(e) => handleCreateCalendar(e)}
                type="submit"
                value={"Đồng ý"}
                className="px-4 py-2 border-2 border-[#389ca0] bg-[#389ca0] text-white font-semibold rounded-md cursor-pointer hover:opacity-60 transition-all ml-5"
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

function Row(props) {
  const { row, handleDeleteUser, handleDeleteUserList, getListData } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        {/* <TableCell sx={{ width: 50 }}>
          <FontAwesomeIcon
            size="lg"
            color="red"
            className="mr-4 cursor-pointer hover:scale-110 hover:opacity-60 transition-all"
            icon={faXmark}
            onClick={handleDeleteUser}
          />
        </TableCell> */}
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
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
                    <TableCell></TableCell>
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
                    <TableRow key={list.uid}>
                      <TableCell>
                        <FontAwesomeIcon
                          size="lg"
                          color="red"
                          className="mr-4 cursor-pointer hover:scale-110 hover:opacity-60 transition-all"
                          icon={faMinus}
                          onClick={() => handleDeleteUserList(row.email, list)}
                        />
                      </TableCell>
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
              <AddCalendar email={row.email} getListData={getListData} />
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

  const handleDeleteUser = async (email) => {
    let text = "Bạn có đồng ý xoá người dùng?";
    if (window.confirm(text) === true) {
      await deleteDoc(doc(db, "users", email));
      await getListData();
    } else return;
  };

  const handleDeleteUserList = async (email, listItem) => {
    let text = "Bạn có đồng ý xoá lịch này?";
    if (window.confirm(text) === true) {
      const listItemRef = doc(db, "users", email);
      await updateDoc(listItemRef, {
        list: arrayRemove(listItem),
      });
      await getListData();
    } else return;
  };

  const getListData = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    setLoading(false);
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

    setFinalList(finalUserList);
  };
  React.useEffect(() => {
    getListData();
  }, []);

  return isLoading ? (
    <div className="w-full h-screen bg-white">
      <FontAwesomeIcon
        size="lg"
        icon={faSpinner}
        color="#4accd1"
        className="ml-10 animate-spin mx-auto mt-20"
      />
    </div>
  ) : (
    <Paper
      sx={{
        padding: "20px",
        width: "100%",
        overflowY: "scroll",
        height: "100vh",
      }}
    >
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              {/* <TableCell /> */}
              <TableCell />

              <TableCell>Người dùng</TableCell>
              <TableCell align="right">Tên hiển thị</TableCell>
              <TableCell align="right">Số lượng</TableCell>
              {/* <TableCell align="right"></TableCell> */}
              {/* <TableCell align="right"></TableCell>  */}
            </TableRow>
          </TableHead>
          <TableBody>
            {finalList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <Row
                  key={row.email}
                  row={row}
                  handleDeleteUser={() => handleDeleteUser(row.email)}
                  handleDeleteUserList={handleDeleteUserList}
                  getListData={getListData}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddUser reloadList={getListData} />
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
