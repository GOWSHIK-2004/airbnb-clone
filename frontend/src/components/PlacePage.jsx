import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { perkIconsMap, perkTextMap } from "./formComponents/perkMaps";
import BookingWidget from "./bookingComponents/BookingWidget";
import { UserContext } from "../UserContext";
import Login from "./Login";
import PhotosGrid from "./galleryComponents/PhotosGrid";
import Gallery from "./galleryComponents/Gallery";
import GmapEmbed from "./GmapEmbed";
import PlacePageSkeleton from "./skeletons/PlacePageSkeleton";
import { storage } from "../../firebaseConfig";
import { ref, deleteObject } from "firebase/storage";

export default function PlacePage() {
    const { id } = useParams();
    const [place, setPlace] = useState({});
    const [owner, setOwner] = useState({ name: '', email: '', old: '' });
    const [showPhotos, setShowPhotos] = useState(false);

    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

    const { userName, userEmail, fav, setFav } = useContext(UserContext);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get(`/place/public/${id}`);
                const ownerRes = await axios.get(`/user/${res.data.owner}`)
                setPlace(res.data);
                setOwner(ownerRes.data);
                setLoading(false);
            } catch (e) {
                if (e.response.status >= 400) {
                    alert(e.response.data.message);
                }
            }
        }
        fetchData();
    }, [])

    async function removePlace(e) {
        try {
            e.preventDefault();

            const isConfirmed = confirm("Do you want to delete?");
            if (isConfirmed) {
                const res = await axios.post(`/place/delete/${place._id}`);

                const photos = res.data.photos;
                for (const url of photos) {
                    // Extract the file path from the URL
                    const filePath = url.split("/o/")[1].split("?")[0];
                    const decodedPath = decodeURIComponent(filePath);

                    const storageRef = ref(storage, decodedPath);
                    await deleteObject(storageRef);
                }

                alert("Accommodation deleted");
                navigate("/profile/accommodations");
            }
        } catch (e) {
            if (e.response.status >= 400) {
                alert(e.response.data.message);
            }
        }
    }

    async function updateFav(e, id) {
        try {
            if (!fav?.includes(id)) {
                const { data } = await axios.post("/user/add-to-favourites", { id });
                setFav(data.favourites);
            } else {
                const { data } = await axios.post("/user/remove-from-favourites", { id });
                setFav(data.favourites);
            }
        } catch (e) {
            if (e.response.status >= 400) {
                alert(e.response.data.message);
            }
        }
    }

    if (loading) {
        return <PlacePageSkeleton />
    }

    if (showPhotos) {
        return (
            <Gallery photos={place.photos} toggle={setShowPhotos} />
        )
    }

    return (
        <div className="container mx-auto xl:w-4/6 mt-6 px-5">
            <div className="flex justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">{place.title}</h1>
                    <div className="mt-1 flex gap-1 items-center font-semibold underline">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        <a target="_blank" href={`https://maps.google.com/?q=${place.address?.city}`}>{place.address?.city}, {place.address?.country}</a>
                    </div>
                </div>
                <div className="relative flex gap-2">
                    {userEmail == owner.email &&
                        <div className="flex gap-2">
                            <Link to={"/profile/accommodations/" + place._id} className="flex gap-1 items-center border border-gray-400 hover:bg-gray-400 hover:text-white rounded-2xl px-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                                <span className="hidden md:block">Edit</span>
                            </Link>
                            <button onClick={(e) => removePlace(e)} className="flex gap-1 items-center border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl px-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                <span className="hidden md:block">Delete</span>
                            </button>
                        </div>
                    }
                    <button onClick={(e) => updateFav(e, place._id)} className={`m-0 px-2 md:px-4 text-primary ${fav?.includes(place._id) ? "bg-primary text-white" : ""} hover:bg-primary hover:text-white border border-primary rounded-2xl p-2 m-1`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* photos */}
            <PhotosGrid photos={place.photos} toggle={setShowPhotos} />
            {/* photos ends */}

            <div className="lg:flex justify-between">
                {/* text content */}
                <div className="grow lg:me-20">

                    <div className="flex items-center gap-1 mt-1 mb-6  text-xl font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 relative md:top-0.5">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                        </svg>
                        {place.rating?.length > 0 ? (
                            <div>{place.rating[0].toFixed(1)} <span className="text-2xl">·</span> {place.rating[1]} review{place.rating[1] > 1 ? "s" : ""}</div>
                        ) : (
                            <div>- No ratings yet</div>
                        )
                        }
                    </div>
                    <hr />
                    <h2 className="text-xl font-semibold mt-4">Description</h2>
                    <p className="text-justify mt-3 mb-6 max-h-60 overflow-hidden">{place.description}</p>
                    <hr></hr>
                    <div className="flex items-center gap-4">
                        <div>
                            {(owner.profilePic != undefined && owner.profilePic != '') &&
                                <div className="w-12 rounded-full overflow-hidden">
                                    <img src={owner.profilePic}
                                        className="aspect-square object-cover" />
                                </div>
                            }
                            {(owner.profilePic == undefined || owner.profilePic == '') &&
                                <div className="w-12 h-12 rounded-full border border-gray-500 bg-gray-500 text-white p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-9 mx-auto relative top-0.5">
                                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            }
                        </div>
                        <div className="my-4">
                            <h2 className="text-xl font-semibold">Hosted by {owner.name}</h2>
                            <p>{owner.old} of hosting</p>
                        </div>
                    </div>
                    <hr></hr>
                    {place.perks.length > 0 &&
                        <div>
                            <div className="my-4">
                                <h2 className="text-xl font-semibold">What this place offers</h2>
                                <div className="grid grid-cols-2">
                                    {place.perks?.length > 0 && place.perks.map(perk => (
                                        <div key={perk} className="flex gap-2 mt-4">
                                            {perkIconsMap[perk]}
                                            {perkTextMap[perk]}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <hr></hr>
                        </div>
                    }

                    <div className="mt-4 mb-10">
                        <p><span className="font-semibold">Check-in:</span> {place.checkIn}:00</p>
                        <p><span className="font-semibold">Check-out:</span> {place.checkOut}:00</p>
                        <p><span className="font-semibold">Max number of guests:</span> {place.maxGuests}</p>
                    </div>
                    {place.extraInfo.trim() != "" &&
                        <div className="bg-gray-100 px-8 py-5 lg:mt-3">
                            <p className="text-xl font-semibold">Extra info</p>
                            <p className="text-justify">{place.extraInfo}</p>
                        </div>
                    }
                </div>
                {/* text content ends */}

                {/* Booking component */}
                {userName != "" ? <BookingWidget place={place} owner={owner} /> : <Login from="placePage" to={location.pathname} />}
                {/* Booking component ends */}

            </div>


            {/* Google map embedded component */}
            <div className="my-10">
                <h2 className="text-xl font-semibold mb-5">Location</h2>
                <GmapEmbed address={place.address} />
            </div>

        </div>
    )
}