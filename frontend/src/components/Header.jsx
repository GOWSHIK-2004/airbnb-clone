import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../userContext";

function Header() {
    const { userName, profile } = useContext(UserContext);
    return (
        <div className="fixed top-0 left-0 w-full bg-white z-50 shadow-sm">
            <div className="flex items-center justify-between p-4 container mx-auto">
                <Link to="/" className="text-primary">
                    <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 -rotate-90">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                        <span className="hidden md:block font-bold text-xl">airbnb</span>
                    </div>
                </Link>

                {/* search bar for large screens */}
                <div className="hidden md:flex items-center gap-4 shadow shadow-gray-200 border border-gray-300 rounded-full py-2 ps-6 pe-2 hover:shadow-md">
                    <div className="font-semibold">Anywhere</div>
                    <div className="border-l border-gray-300 h-6"></div>
                    <div className="font-semibold">Any week</div>
                    <div className="border-l border-gray-300 h-6"></div>
                    <div>Add guests </div>
                    <button className="border bg-primary text-white p-2 border-gray-300 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </button>
                </div>

                {/* search bar for small screens */}
                <div className="flex w-full mx-10 justify-between md:hidden items-center gap-4 shadow shadow-gray-200 border border-gray-300 rounded-full py-2 ps-6 pe-2 hover:shadow-md">
                    <div className="">Start your search</div>
                    <button className="border bg-primary text-white p-2 border-gray-300 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </button>
                </div>

                <Link to={userName ? "/profile" : "/login"}>
                    <div className="flex items-center gap-4 border border-gray-300 rounded-full py-2 ps-2 md:ps-4 pe-2 hover:bg-gray-100">
                        <div className="hidden md:block">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="hidden md:block size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </div>
                        {(profile != undefined && profile != '') &&
                            <div className="w-9 rounded-full overflow-hidden">
                                <img src={`${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_PORT}/profile/${profile}`}
                                    className="aspect-square object-cover" />
                            </div>
                        }
                        {(profile == undefined || profile == '') &&
                            <div className="border border-gray-500 rounded-full bg-gray-500 text-white p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                                </svg>
                            </div>
                        }
                        {userName && (
                            <div className="pe-2 hidden md:block">
                                {userName}
                            </div>
                        )}
                    </div>
                </Link>
            </div>
            <hr></hr>
        </div>
    );
}

export default Header;