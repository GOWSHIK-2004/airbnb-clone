import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios";
import { UserContext } from "../UserContext";
import FetchingSkeleton from "./skeletons/FetchingSkeleton";

export default function Favourites() {
    const [fullFav, setFullFav] = useState([]);
    const { fav, setFav } = useContext(UserContext);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get("/user/favourites");
                setFullFav(res.data);
                setLoading(false);
            } catch (e) {
                if (e.response.status >= 400) {
                    alert(e.response.data.message);
                }
            }
        }
        fetchData();
    }, [fav])

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

    if (loading)
        return <FetchingSkeleton text={"Fetching your favourites"} />

    return (
        <div className="container mx-auto px-5">
            <div className={`gap-6 my-10 ${fullFav.length > 0 ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : ""}`}>
                {fullFav.length > 0 && fullFav.map((place, index) => (
                    <div key={index} className="relative rounded-2xl overflow-hidden hover:scale-105 hover:translate-y-[-5px] hover:shadow-md transition-transform duration-300 ease-in-out">
                        <Link to={`/place/${place._id}`}>
                            <img
                                className="aspect-video sm:aspect-square rounded-xl object-cover"
                                src={place.photos[0]}
                                alt={place.title}
                            />
                            <div className="p-2">
                                <h3 className="font-medium ">{place.address.city}, {place.address.country}</h3>
                                <p className="text-sm text-gray-500">{place.title}</p>
                                <p className="flex font-medium mt-1 relative right-1"><i className='bx bx-rupee text-lg'></i>{place.price}<span className="font-normal">&nbsp;per night</span></p>
                            </div>
                        </Link>
                        <button onClick={(e) => updateFav(e, place._id)} className={`absolute top-1 right-1 text-white ${fav?.includes(place._id) ? "bg-primary" : "bg-black"} hover:bg-primary hover:opacity-100 opacity-50 rounded-xl p-2 m-1`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        </button>

                    </div>
                ))}
                {fullFav.length == 0 &&
                    <div className="border rounded-2xl text-center p-5 w-2/3 mx-auto">
                        You have not added any place to favourites
                    </div>
                }
            </div>
        </div>
    )
}