import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { storage } from "../../firebaseConfig";
import { ref, deleteObject } from "firebase/storage";
import FetchingSkeleton from "./skeletons/FetchingSkeleton";

export default function Accommodation() {
    const [userPlaces, setUserPlaces] = useState([]);

    const [loading, setLoading] = useState(true);
    const [delLoading, setDelLoading] = useState(false);
    const [delId, setDelId] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get("/place/my-places");
                setUserPlaces(res.data);
                setLoading(false);
            } catch (e) {
                if (e.response.status >= 400) {
                    alert(e.response.data.message);
                }
            }
        }
        fetchData();
    }, [])

    async function removePlace(e, place) {
        e.preventDefault();

        const isConfirmed = confirm("Do you want to delete?");
        if (isConfirmed) {
            setDelLoading(true);
            setDelId(place._id);
            try {
                const res = await axios.post(`/place/delete/${place._id}`)
                setUserPlaces(userPlaces.filter(item => item != place));
                setDelLoading(false);
                setDelId("");

                const photos = res.data.photos;
                for (const url of photos) {
                    // Extract the file path from the URL
                    const filePath = url.split("/o/")[1].split("?")[0];
                    const decodedPath = decodeURIComponent(filePath);

                    const storageRef = ref(storage, decodedPath);
                    await deleteObject(storageRef);
                }

            } catch (e) {
                if (e.response.status >= 400) {
                    alert(e.response.data.message);
                }
                setDelLoading(false);
                setDelId("");
            }
        }
    }

    return (
        <div className="container mx-auto p-5">
            <div className="text-center my-3">
                <Link to="/profile/accommodations/new" className="inline-flex gap-2 bg-primary text-white py-2 px-3 rounded-full shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add new place
                </Link>
            </div>
            {loading && (<FetchingSkeleton text={"Fetching your accommodations"} />)}
            {!loading && (
                <div className="mt-8">
                    {userPlaces.length > 0 &&
                        userPlaces.map(place => (
                            <div key={place._id} className="relative">
                                {/* loading overlay */}
                                {delLoading && delId == place._id && (
                                    <div className="absolute w-full h-full rounded-2xl bg-gray-200 z-10 animate-pulse"></div>
                                )}

                                <Link to={`/place/${place._id}`} className="flex border rounded-2xl my-3 overflow-hidden gap-5 bg-gray-100 w-full">
                                    <div className="h-32 w-32 border-e flex-shrink-0">
                                        <img
                                            className="aspect-square object-cover"
                                            src={place.photos[0]}
                                            alt={place.photos[0]}
                                        />
                                    </div>
                                    <div className="flex flex-col justify-between my-2 me-5 flex-grow">
                                        <div className="max-h-20 max-w-full overflow-hidden">
                                            <h3 className="text-xl truncate w-11/12 lg:w-full">{place.title}</h3>
                                            <p className="text-gray-500 mt-2 text-justify hidden md:block">{place.description}</p>
                                        </div>
                                        <div className="flex gap-1 items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                            </svg>
                                            <p>{place.address.city}, {place.address.country}</p>
                                        </div>
                                    </div>
                                </Link>
                                <div className="flex gap-2 mt-2 md:mt-0 absolute top-9 left-36 md:right-5 md:top-3 md:left-auto">
                                    <Link to={"/profile/accommodations/" + place._id} className="py-2 md:py-0 flex gap-1 items-center border border-gray-400 hover:bg-gray-400 hover:text-white rounded-2xl px-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                        <span className="hidden md:block">Edit</span>
                                    </Link>
                                    <button onClick={(e) => removePlace(e, place)} className="py-2 md:py-0 flex gap-1 items-center border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl px-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                        <span className="hidden md:block">Delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    {userPlaces.length == 0 &&
                        <div className="border rounded-2xl text-center p-5 w-2/3 mx-auto">
                            You have not listed any Accommodation
                        </div>
                    }
                </div>
            )}
        </div>
    )
}