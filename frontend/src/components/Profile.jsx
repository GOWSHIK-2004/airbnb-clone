import { useContext, useState } from "react"
import { UserContext } from "../UserContext"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { storage } from "../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import axios from "axios";

export default function Profile() {
    const [loggedOut, setLoggedOut] = useState(false);

    const { ready, userName, userEmail, setUserName, setUserEmail, profile, setProfile, old, setOld, fav, setFav } = useContext(UserContext);
    const navigate = useNavigate();

    const [remProfLoad, setRemProf] = useState(false);
    const [chgProfLoad, setchgProf] = useState(false);
    const [logoutLoad, setLogoutLoad] = useState(false);

    if (!ready) {
        return <div>Loading...</div>;
    }

    if (!loggedOut && ready && userName === "") {
        return <Navigate to="/login" />;
    }

    async function setProfilePic(e) {
        const file = e.target.files[0];
        if (!file) return;

        setchgProf(true);
        try {
            const storageRef = ref(storage, `profile/${file.name}`);
            const snapshot = await uploadBytesResumable(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            const res = await axios.post('/user/set-profile-pic', {
                profileUrl: url
            });
            setProfile(res.data.img);
            setchgProf(false);

        } catch (e) {
            if (e.response.status >= 400) {
                alert(e.response.data.message);
            }
            setchgProf(false);
        }
    }

    async function removeProfilePic(e) {
        e.preventDefault();
        setRemProf(true);

        try {
            // Extract the file path from the URL
            const filePath = profile.split("/o/")[1].split("?")[0];
            const decodedPath = decodeURIComponent(filePath);

            const storageRef = ref(storage, decodedPath);
            await deleteObject(storageRef);

            const res = await axios.post('/user/set-profile-pic', {
                profileUrl: ""
            });
            setProfile(res.data.img);
            setRemProf(false);
        } catch (e) {
            if (e.response.status >= 400) {
                alert(e.response.data.message);
            }
            setRemProf(false);
        }
    }

    async function logout(e) {
        setLogoutLoad(true);
        try {
            await axios.post("/user/logout");
            setLoggedOut(true);
            setUserName("");
            setUserEmail("");
            setProfile("");
            setOld("");
            setFav([]);
            setLogoutLoad(false);
            navigate("/");
        } catch (e) {
            if (e.response.status >= 400) {
                alert(e.response.data.message);
            }
            setLogoutLoad(false);
        }
    }

    return (
        <div className="container mx-auto xl:w-4/6 mt-10 px-5 flex flex-col items-center md:items-start md:flex-row gap-20">

            <div className="w-full md:max-w-80 rounded-2xl py-10 px-10 flex flex-col items-center" style={{ boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)' }}>
                {(profile != undefined && profile != '') &&
                    <div className="w-52 rounded-full overflow-hidden">
                        <img src={profile}
                            className="aspect-square object-cover" />
                    </div>
                }
                {(profile == undefined || profile == '') &&
                    <div className="w-52 h-52 rounded-full border border-gray-500 bg-gray-500 text-white p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-44 mx-auto relative top-3">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                        </svg>
                    </div>
                }

                <p className="font-semibold text-2xl mt-5">{userName}</p>
                <p className="mt-1">{old} of hosting</p>

                <div className="flex gap-2 mt-5 w-full px-2">
                    <button onClick={(e) => logout(e)} className={`${logoutLoad ? "hidden" : ""}  w-full rounded-2xl bg-primary text-white px-4 py-2 hover:scale-105 hover:shadow-md transition-transform duration-300 ease-in-out`}>
                        Logout</button>
                    <div className={`${logoutLoad ? "" : "hidden"} text-center w-full rounded-2xl bg-primary text-white px-4 py-2 animate-pulse`}>
                        Logout</div>
                    <button onClick={(e) => { navigate("/update", { state: { from: "profile", to: "/profile" } }) }} className="w-full rounded-2xl bg-primary text-white px-4 py-2 hover:scale-105 hover:shadow-md transition-transform duration-300 ease-in-out">
                        Update</button>
                </div>
            </div>

            <div className="flex flex-col gap-4 grow">
                <div className="text-center border w-full rounded-xl mx-auto p-5">
                    <p>Logged in as {userName} ({userEmail})</p>

                    <div className="flex flex-col lg:flex-row justify-center gap-2 mt-5">
                        <label className={`${chgProfLoad ? "hidden" : ""} border cursor-pointer rounded-xl bg-primary text-white px-4 py-2 hover:shadow-md`}>
                            <input type="file" onChange={(e) => setProfilePic(e)} className="hidden" />
                            {(profile != undefined && profile != '') ? "Update" : "Set"} Profile Picture
                        </label>
                        <label className={`${chgProfLoad ? "" : "hidden"} border cursor-pointer rounded-xl bg-primary text-white px-4 py-2 hover:shadow-md animate-pulse`}>
                            {(profile != undefined && profile != '') ? "Updating" : "Setting"} Profile Picture...
                        </label>
                        {(profile != undefined && profile != '') &&
                            <>
                                <label className={`${remProfLoad ? "hidden" : ""}  border cursor-pointer rounded-xl bg-primary text-white px-4 py-2 hover:shadow-md`}>
                                    <button onClick={(e) => removeProfilePic(e)} className="hidden" />
                                    Remove Profile Picture
                                </label>
                                <label className={`${remProfLoad ? "" : "hidden"} border cursor-pointer rounded-xl bg-primary text-white px-4 py-2 hover:shadow-md animate-pulse`}>Removing profile picture...</label>
                            </>
                        }
                        <Link to="/profile/changePassword" state={{ status: "loggedIn" }} className="flex justify-around items-center border cursor-pointer rounded-xl bg-primary text-white px-4 py-2 hover:shadow-md">
                            Change Password
                        </Link>
                    </div>
                </div>

                <Link to="/profile/favourites" className="flex justify-between border w-full rounded-xl p-5 hover:bg-gray-100">
                    <p>Go to Favourites</p>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </div>
                </Link  >

            </div>

        </div>
    );
}