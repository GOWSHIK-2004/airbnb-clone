import { useEffect, useState } from "react";
import Gallery from "../galleryComponents/Gallery";
import PhotosGrid from "../galleryComponents/PhotosGrid";
import { useLocation } from "react-router-dom";
import { format, set } from "date-fns";
import GmapEmbed from "../GmapEmbed";
import Rating from "./Rating";

export default function BookingPage() {
    const [showPhotos, setShowPhotos] = useState(false);
    const [askRating, setAskRating] = useState(false);

    const location = useLocation();
    const { place, booking } = location.state

    if (showPhotos) {
        return (
            <Gallery photos={place.photos} toggle={setShowPhotos} />
        )
    }

    useEffect(() => {
        if (new Date(booking.checkIn) < new Date()) {
            setAskRating(true);
        }
    }, []);

    return (
        <div className="container mx-auto xl:w-4/6 mt-6 px-5">
            <h1 className="text-2xl font-semibold">{place.title}</h1>
            <div className="mt-1 flex gap-1 items-center font-semibold underline">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <a target="_blank" href={`https://maps.google.com/?q=${place.address?.city}`}>{place.address?.city}, {place.address?.country}</a>
            </div>

            <div className="flex flex-col sm:flex-row justify-between bg-gray-100 rounded-2xl p-5 mt-5 mb-3">
                <div>
                    <p className="font-medium text-lg mb-3">Your booking information:</p>
                    <div className="flex items-center gap-2 mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        <p>{format(new Date(booking.checkIn), "dd-MM-yyyy")} - {format(new Date(booking.checkOut), "dd-MM-yyyy")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                        </svg>
                        <p>{booking.nights} nights</p>
                    </div>
                </div>
                <div className="mt-5 sm:mt-0 bg-primary text-white rounded-2xl text-center flex flex-col justify-center px-5 py-3">
                    <p>Total price</p>
                    <p className="font-medium text-2xl relative right-0.5"><i className='bx bx-rupee relative top-0.5 left-0.5'></i>{booking.price}</p>
                </div>
            </div>

            {/* rating */}
            {askRating == true &&
                <Rating place={place} />
            }

            <PhotosGrid photos={place.photos} toggle={setShowPhotos} />

            {/* Google map embedded component */}
            <div className="my-12">
                <h2 className="text-xl font-semibold mb-5">Find your way</h2>
                <GmapEmbed address={place.address} />
            </div>
        </div>
    )
}