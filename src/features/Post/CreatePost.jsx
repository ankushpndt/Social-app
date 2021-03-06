import "./Post.css";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PostBtn } from "./postSlice";
import axios from "axios";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
import { LoadUsers } from "../User/userSlice";
export const CreatePost = () => {
	const [postData, setpostData] = useState("");
	const [status, setStatus] = useState(false);
	const [imgUrl, setUrl] = useState("");
	const auth = useSelector((state) => state?.auth?.login);
	const users = useSelector((state) => state?.user?.users?.user);
	const { userId } = auth;

	const dispatch = useDispatch();
	const postHandler = async () => {
		setStatus(true);
		dispatch(PostBtn({ postData, imgUrl, userId, setStatus }));
		setpostData("");
	};
	// upload image
	const uploadImage = async (e) => {
		const files = e.target.files;
		const data = new FormData();
		data.append("file", files[0]);
		data.append("upload_preset", "e2pkko9m");
		data.append("cloud_name", "dzvkso0q0");
		try {
			const response = await axios.post(
				"https://api.cloudinary.com/v1_1/dzvkso0q0/image/upload",
				data
			);

			setUrl(response.data.url);
		} catch (error) {
			toast.dark(error?.response?.data?.message);
		}
	};
	useEffect(() => {
		dispatch(LoadUsers());
	}, [dispatch]);
	return (
		<div className="create__post">
			<div className="create__post__user__profile">
				{users?.map(
					(user) =>
						user?._id === auth?.userId && (
							<NavLink
								key={uuidv4()}
								to={`/account/${auth?.userId}`}
								style={{
									textDecoration: "none",
									color: "black",
									height: "50px",
									marginTop: "0.6rem",
								}}
							>
								{" "}
								<div className="user__details">
									<img
										src={user.image}
										alt=""
										width="30px"
										height="30px"
										style={{ borderRadius: "80%" }}
									/>
								</div>
							</NavLink>
						)
				)}

				<textarea
					name=""
					id=""
					cols="40"
					rows="2"
					placeholder="What's happening?"
					onChange={(e) => {
						setpostData(e.target.value);
					}}
					value={postData}
					style={{
						border: "none",
						resize: "none",
						padding: "0.5rem 0 0.5rem 0.5rem",
						minHeight: "45px",
						lineHeight: "37px",
					}}
				/>
			</div>
			{/* show uploaded img here*/}
			{imgUrl ? (
				<div className="createpost__uploaded__img__div">
					<img
						className="createpost__img__show"
						src={imgUrl}
						width="300px"
						alt="userpic"
					/>
				</div>
			) : (
				<div> </div>
			)}
			<div className="create__post__btn">
				<label htmlFor="upload__btn">
					<input
						type="file"
						id="upload__btn"
						hidden
						onChange={uploadImage}
						accept="image/*"
					/>
					<IconButton
						color="primary"
						aria-label="upload picture"
						component="span"
						id="btn__outlined"
					>
						<PhotoCamera />
					</IconButton>
				</label>
				<span style={{ cursor: "not-allowed" }}>
					<Button
						variant="outlined"
						id="btn__outlined"
						disabled={!postData}
						onClick={postHandler}
						style={{ marginLeft: "0.2rem" }}
					>
						{status ? "Posting..." : "Post"}
					</Button>
				</span>
			</div>
		</div>
	);
};
