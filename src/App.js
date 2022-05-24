import React, { useEffect, useState } from "react";
import "./App.css";
import "./style.css";
import { Route, Routes, useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import { Home } from "./features/Home/Home";
import { User } from "./features/User/User";
import { EditProfile } from "./features/User/EditProfile";
import { Followers } from "./features/User/Followers";
import { Following } from "./features/User/Following";
import { LoadPosts } from "./features/Post/postSlice";
import { LoadUsers } from "./features/User/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Login } from "./features/Auth/Login";
import { SignUp } from "./features/Auth/SignUp";
import { PrivateRoute } from "./PrivateRoute";
import { logoutBtnPressed } from "./features/Auth/AuthSlice";
import { Notification } from "./features/Notification/Notification";
import { Account } from "./features/User/Account";
import { io } from "socket.io-client";
import { SearchBar } from "./Components/SearchBar";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { API_URL } from "./utils/API_URL";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PageNotFound } from "./Components/PageNotFound";
import { SpecificPost } from "./features/Post/SpecificPost";
const App = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const auth = useSelector((state) => state.auth.login);
	const [socket, setSocket] = useState(null);

	// useEffect(() => {
	// 	setSocket(io(`${API_URL}`));
	// }, []);
	const { userId, isUserLoggedIn, token } = auth;
	const notifications = useSelector(
		(state) => state.notification.notifications
	);

	useEffect(() => {
		if (token) {
			dispatch(LoadPosts({ userId }));
			dispatch(LoadUsers());
		}
	}, [token, dispatch, userId]);

	useEffect(() => {
		socket?.emit("addUser", userId);
	}, [socket, userId]);
	const logoutHandler = () => {
		dispatch(logoutBtnPressed());
		navigate("/");
		setHome(false);
		setAccount(false);
	};
	//noti toggle
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const [home, setHome] = useState(false);
	const [account, setAccount] = useState(false);
	return (
		<div className="App">
			<div className="navbar">
				<div className="icon">
					<NavLink
						to={token ? "/home" : "/"}
						style={{ color: "white", textDecoration: "none" }}
					>
						Ligma Social
					</NavLink>
				</div>
				<SearchBar />
				<div className="icons">
					{token && (
						<div
							className="icon"
							id="basic-button"
							aria-controls={open ? "basic-menu" : undefined}
							aria-haspopup="true"
							aria-expanded={open ? "true" : undefined}
							onClick={handleClick}
						>
							{open ? <NotificationsIcon /> : <NotificationsNoneOutlinedIcon />}
							{notifications.length > 0 && (
								<div className="counter">{notifications.length}</div>
							)}
						</div>
					)}
					{token && (
						<div className="icon">
							<NavLink
								to="/home"
								style={{ color: "white" }}
								onClick={() => {
									setHome(true);
									setAccount(false);
								}}
							>
								{" "}
								{home ? <HomeIcon /> : <HomeOutlinedIcon />}
							</NavLink>
						</div>
					)}
					{token && (
						<div className="icon">
							<NavLink
								to={`/account/${userId}`}
								style={{ color: "white" }}
								onClick={() => {
									setHome(false);
									setAccount(true);
								}}
							>
								{account ? (
									<AccountCircleIcon />
								) : (
									<AccountCircleOutlinedIcon />
								)}
							</NavLink>
						</div>
					)}
					{!token && (
						<div className="icon">
							<NavLink to="/" style={{ color: "white" }}>
								<LoginIcon />
							</NavLink>
						</div>
					)}
					{!token && (
						<div className="icon">
							<NavLink to="/signup" style={{ color: "white" }}>
								<PersonAddAlt1Icon />
							</NavLink>
						</div>
					)}
					{token && (
						<div className="icon">
							{isUserLoggedIn && (
								<div onClick={logoutHandler}>
									<LogoutIcon />
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			<Notification
				socket={socket}
				open={open}
				anchorEl={anchorEl}
				handleClose={handleClose}
			/>

			<Routes>
				<Route path="/" element={<Login socket={socket} />} />
				<Route path="/signup" element={<SignUp />} />
				<Route
					path="/home"
					element={
						<PrivateRoute>
							<Home socket={socket} />
						</PrivateRoute>
					}
				/>
				<Route
					path="/post/:postId"
					element={<SpecificPost socket={socket} />}
				/>
				<Route path="/user/:userId/editprofile" element={<EditProfile />} />
				<Route path="/user/:userId/followers" element={<Followers />} />
				<Route path="/user/:userId/following" element={<Following />} />
				<Route
					path="/account/:userId"
					element={
						<PrivateRoute>
							<Account socket={socket} />
						</PrivateRoute>
					}
				/>
				<Route
					path="/user/:userId"
					element={
						<PrivateRoute>
							<User socket={socket} />
						</PrivateRoute>
					}
				/>
				<Route path="*" element={<PageNotFound />} />
			</Routes>

			<ToastContainer
				position="bottom-center"
				autoClose={3000}
				hideProgressBar={true}
				transition={Slide}
				theme="dark"
			/>
		</div>
	);
};

export default App;
