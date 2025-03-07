    import axios from "axios";
    import { useEffect, useState } from "react"
    import { useNavigate, useParams } from "react-router-dom";
    import FormPhotos from "./FormPhotos";
    import FormPerks from "./FormPerks";
    import FormAddress from "./FormAddress";
    import EditPlaceSkeleton from "../skeletons/EditPlaceSkeleton";

    export default function AddPlace() {
        const navigate = useNavigate();
        const { id } = useParams();

        const [title, setTitle] = useState('');
        const [address, setAddress] = useState({ street: '', locality: '', city: '', pincode: '', country: '' });
        const [photos, setPhotos] = useState([]);
        const [photoLink, setPhotoLink] = useState('');
        const [description, setDescription] = useState('');
        const [perks, setPerks] = useState([]);
        const [extraInfo, setExtraInfo] = useState('');
        const [checkIn, setCheckIn] = useState('');
        const [checkOut, setCheckOut] = useState('');
        const [maxGuests, setMaxGuests] = useState('');
        const [price, setPrice] = useState('');

        const [loading, setLoading] = useState(false);
        const [saveLoading, setSaveLoading] = useState(false);

        useEffect(() => {
            if (!id) {
                return;
            }
            async function fetchData() {
                try {
                    const res = await axios.get(`/place/public/${id}`);
                    const data = res.data;

                    setTitle(data.title);
                    setAddress(data.address);
                    setPhotos(data.photos);
                    setDescription(data.description);
                    setPerks(data.perks);
                    setExtraInfo(data.extraInfo);
                    setCheckIn(data.checkIn);
                    setCheckOut(data.checkOut);
                    setMaxGuests(data.maxGuests);
                    setPrice(data.price);
                    setLoading(false);
                } catch (e) {
                    if (e.response.status >= 400) {
                        alert(e.response.data.message);
                    }
                    setLoading(false);
                }
            }
            setLoading(true);
            fetchData();
        }, []);

        async function SavePlace(e) {
            e.preventDefault();
            setSaveLoading(true);

            if (!title || !address.street || !address.locality || !address.city || !address.pincode || !address.country || !photos || !description || !checkIn || !checkOut || !maxGuests || !price) {
                alert("Fill all the mandatory fields");
                setSaveLoading(false);
                return;
            }

            if (checkIn > 24 || checkIn < 0 || checkOut < 0 || checkOut > 24 || checkIn <= checkOut) {
                alert("Enter valid checkin & checkout time");
                setSaveLoading(false);
                return;
            }

            if (photos.length < 5) {
                alert("Upload minimum 5 photos");
                setSaveLoading(false);
                return;
            }

            const data = {
                title,
                address,
                photos,
                description,
                perks,
                extraInfo,
                checkIn,
                checkOut,
                maxGuests,
                price
            }
            try {
                if (!id) {
                    const res = await axios.post("/place/add", data);
                    if (res.data.message == "success") {
                        setTitle('');
                        setAddress({ street: '', locality: '', city: '', pincode: '', country: '' });
                        setPhotos([]);
                        setDescription('');
                        setPerks([]);
                        setExtraInfo('');
                        setCheckIn('');
                        setCheckOut('');
                        setMaxGuests('');
                        setPrice('');
                    }
                    else
                        alert(res.data.message);
                } else {
                    await axios.put(`/place/${id}`, data);
                }
                setSaveLoading(false);
                navigate("/profile/accommodations");
            } catch (e) {
                if (e.response.status >= 400) {
                    alert(e.response.data.message);
                }
                setSaveLoading(false);
            }
        }

        if (loading) {
            return <EditPlaceSkeleton />
        }

        return (
            <div className="container mx-auto px-5">
                <form onSubmit={(e) => SavePlace(e)}>
                    <h2 className="text-2xl mt-4">Title</h2>
                    <p className="text-gray-500 text-sm my-1">Title for your place, should be short and catchy as in advertisement</p>
                    <input type="text"
                        id="1"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border rounded-2xl py-2 px-3 w-full"
                        placeholder="example: Cozy Villa Near Eiffel Tower" />

                    <FormAddress address={address} setAddress={setAddress} />

                    <FormPhotos photos={photos} setPhotos={setPhotos} photoLink={photoLink} setPhotoLink={setPhotoLink} />

                    <h2 className="text-2xl mt-4">Description</h2>
                    <p className="text-gray-500 text-sm my-1">Add a detailed description of the place</p>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border rounded-2xl py-2 px-3 w-full"
                        rows={4}
                        placeholder="Structure the descrition as topics for better customer experience" />

                    <FormPerks perks={perks} setPerks={setPerks} />

                    <h2 className="text-2xl mt-4">Extra Info <span className="text-gray-500 text-sm">(Optional)</span></h2>
                    <p className="text-gray-500 text-sm my-1">House rules etc.,</p>
                    <textarea
                        value={extraInfo}
                        onChange={(e) => setExtraInfo(e.target.value)}
                        className="border rounded-2xl py-2 px-3 w-full"
                        rows={3} />

                    <h2 className="text-2xl mt-4">Check in & out times <span className="text-gray-500 text-sm">(in 24hrs format)</span></h2>
                    <p className="text-gray-500 text-sm my-1">Add check in & out times, remember to have some time window for cleaning the room between guests</p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        <div>
                            <h3 className="my-1">Check in time</h3>
                            <input type="text"
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                                className="border rounded-2xl py-2 px-3 w-full"
                                placeholder="13" />
                        </div>
                        <div>
                            <h3 className="my-1">Check out time</h3>
                            <input type="text"
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className="border rounded-2xl py-2 px-3 w-full"
                                placeholder="11" />
                        </div>
                        <div>
                            <h3 className="my-1">Max number of guests</h3>
                            <input type="number"
                                value={maxGuests}
                                onChange={(e) => setMaxGuests(e.target.value)}
                                className="border rounded-2xl py-2 px-3 w-full"
                                placeholder="1" />
                        </div>
                        <div>
                            <h3 className="my-1">Price per night</h3>
                            <input type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="border rounded-2xl py-2 px-3 w-full"
                                placeholder="5000 INR" />
                        </div>
                    </div>

                    <div className="text-center"><button type="submit" className={`${saveLoading ? "hidden" : ""} bg-primary text-white w-1/3 py-2 rounded-full my-5`}>{id ? "Save" : "Add"}</button></div>
                    <div className="text-center"><button type="submit" className={`${saveLoading ? "" : "hidden"} bg-primary text-white w-1/3 py-2 rounded-full my-5 animate-pulse`}>{id ? "Saving" : "Adding"}...</button></div>
                </form>
            </div>
        )
    }