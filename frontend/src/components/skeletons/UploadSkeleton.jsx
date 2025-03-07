export default function UploadSkeleton() {
    return (
        <div className="relative">
            <div className="absolute w-full h-full z-10 bg-gray-200 animate-pulse rounded-2xl"></div>
            <label className="flex gap-1 justify-center p-5 items-center border rounded-2xl text-lg h-32 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                </svg>
                Upload from device
            </label>
        </div>

    )
}