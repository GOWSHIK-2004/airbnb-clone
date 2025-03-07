export default function PhotosGrid({ photos, toggle }) {

    return (
        <>
            {photos?.length >= 5 && (
                <div className="w-full mx-auto my-5 relative">
                    {/* For medium and large screens */}
                    <div className="hidden md:grid md:grid-cols-2 md:gap-2 rounded-2xl overflow-hidden">
                        <div>
                            <img
                                onClick={(e) => toggle(true)}
                                className="aspect-square object-cover cursor-pointer"
                                src={photos[0]}
                                alt={photos[0]}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <img
                                onClick={(e) => toggle(true)}
                                className="aspect-square object-cover cursor-pointer"
                                src={photos[1]}
                                alt={photos[1]}
                            />
                            <img
                                onClick={(e) => toggle(true)}
                                className="aspect-square object-cover cursor-pointer"
                                src={photos[2]}
                                alt={photos[2]}
                            />
                            <img
                                onClick={(e) => toggle(true)}
                                className="aspect-square object-cover cursor-pointer"
                                src={photos[3]}
                                alt={photos[3]}
                            />
                            <img
                                onClick={(e) => toggle(true)}
                                className="aspect-square object-cover cursor-pointer"
                                src={photos[4]}
                                alt={photos[4]}
                            />
                        </div>
                    </div>

                    {/* For small screens */}
                    <div className="md:hidden rounded-2xl overflow-hidden">
                        <img
                            onClick={(e) => toggle(true)}
                            className="aspect-video object-cover cursor-pointer"
                            src={photos[0]}
                            alt={photos[0]}
                        />
                    </div>

                    <div onClick={(e) => toggle(true)} className="absolute right-0 bottom-0 flex mb-6 me-5 bg-white rounded-lg py-1 ps-2 pe-3 gap-2 cursor-pointer hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        Show all photos
                    </div>
                </div>
            )
            }
        </>
    )
}