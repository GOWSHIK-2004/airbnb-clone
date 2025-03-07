import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import IndexSkeleton from "./skeletons/IndexSkeleton";

function Index() {
    const [places, setPlaces] = useState([]);
    const { fav, setFav, searchQuery, guestCount } = useContext(UserContext)

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                let res = {};
                if (searchQuery == "") {
                    res = await axios.get("/place");
                } else {
                    res = await axios.get(`/place/public/search/${searchQuery}`)
                }

                setPlaces(res.data.filter(place => place.maxGuests >= guestCount));
                setLoading(false);
            } catch (e) {
                if (e.response.status >= 400) {
                    alert(e.response.data.message);
                }
                setLoading(false);
            }
        }
        fetchData();
    }, [searchQuery, guestCount])

    async function updateFav(e, id) {
        try {
            setFav((prevFav) =>
                prevFav.includes(id) ? prevFav.filter((favId) => favId !== id) : [...prevFav, id]
            );

            if (!fav?.includes(id)) {
                const { data } = await axios.post("/user/add-to-favourites", { id });
                setFav(data.favourites);
            } else {
                const { data } = await axios.post("/user/remove-from-favourites", { id });
                setFav(data.favourites);
            }
        } catch (e) {
            setFav((prevFav) =>
                prevFav.includes(id) ? [...prevFav, id] : prevFav.filter((favId) => favId !== id)
            );

            if (e.response?.status >= 400) {
                alert(e.response.data.message);
            }
        }
    }

    if (loading)
        return <IndexSkeleton />

    return (
        <div className="container mx-auto px-5">
            <div className="grid gap-6 my-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {places.length > 0 && places.map((place, index) => (
                    <div key={index} className="relative rounded-2xl overflow-hidden hover:scale-105 hover:translate-y-[-5px] hover:shadow-md transition-transform duration-300 ease-in-out">
                        <Link to={`/place/${place._id}`}>
                            <img
                                className="aspect-video sm:aspect-square rounded-xl object-cover"
                                src={place.photos[0]}
                                alt={place.title}
                            />
                            <div className="p-2">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-medium ">{place.address.city}, {place.address.country}</h3>
                                    <div className="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                        </svg>
                                        {place.rating.length > 0 ? (
                                            <div>{place.rating[0].toFixed(1)}</div>
                                        ) : (
                                            <div>-</div>
                                        )
                                        }
                                    </div>
                                </div>
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
            </div>
        </div>
    );
}

export default Index;