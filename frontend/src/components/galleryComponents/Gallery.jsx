export default function Gallery({ photos, toggle }) {
    return (
        <div className="absolute bg-white min-w-full min-h-screen overflow-y-scroll">
            <button onClick={(e) => { e.preventDefault(); toggle(false) }} className="m-5 fixed flex items-center rounded-full border p-2 hover:scale-105 hover:shadow-sm transition-transform duration-300 ease-in-out">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
            <div className="container mx-auto w-4/6 mt-6 flex flex-wrap gap-4">
                {photos.length >= 0 && photos.map((photo, index) => (
                    <div key={index}>
                        <img
                            className="rounded-2xl"
                            src={photo}
                            alt={photo}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}