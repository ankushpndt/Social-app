import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router";
import axios from "axios";
import { API_URL } from "../../utils/API_URL";
import { Post } from "../Post/Post";
import { Button } from "@mui/material";
import "./User.css";
export const User = () => {
	const { userId } = useParams();
	console.log(userId);
	const user = useSelector((state) => state.user.users.user);
	console.log(user);
	const CurrentUser = user?.find((user) => user._id === userId);
	console.log(CurrentUser);

	const [specificUserPost, setSpecificUserPost] = useState([]);
	useEffect(() => {
		(async () => {
			const response = await axios.get(`${API_URL}/post/${userId}`);
			setSpecificUserPost(response.data.userPosts);
		})();
	}, [setSpecificUserPost]);
	console.log(specificUserPost);
	return (
		<div style={{ margin: "1rem" }}>
			<div className="user__container">
				<img
					src={CurrentUser?.image}
					width="100px"
					height="100px"
					style={{ borderRadius: "80%" }}
				/>
				<p>Name: {CurrentUser?.name}</p>
				<p>Email: {CurrentUser?.email} </p>
				<p>Bio: {CurrentUser?.bio}</p>
			</div>
			<div
				style={{
					display: "flex",
					gap: "1rem",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<NavLink
					to={`/user/${CurrentUser?._id}/editprofile`}
					style={{
						textDecoration: "none",
						color: "black",
					}}
				>
					<Button size="small" variant="contained" id="btn__contained">
						Edit Profile
					</Button>
				</NavLink>
				<NavLink
					to={`/user/${CurrentUser?._id}/followers`}
					style={{
						textDecoration: "none",
						color: "black",
					}}
				>
					<Button size="small" variant="contained" id="btn__contained">
						Followers {CurrentUser?.followers.length}
					</Button>
				</NavLink>
				<NavLink
					to={`/user/${CurrentUser?._id}/following`}
					style={{
						textDecoration: "none",
						color: "black",
					}}
				>
					<Button size="small" variant="contained" id="btn__contained">
						Following {CurrentUser?.following.length}
					</Button>
				</NavLink>
			</div>
			<div className="userPosts">
				<h4>{CurrentUser?.name}'s Posts</h4>
				{specificUserPost.map((post, i) => {
					return (
						<div key={i}>
							<Post postItem={post} />
						</div>
					);
				})}
			</div>
		</div>
	);
};
