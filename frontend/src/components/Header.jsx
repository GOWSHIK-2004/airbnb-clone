import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

function Header() {
    const { userName, profile, searchQuery, setSearchQuery, guestCount, setGuestCount } = useContext(UserContext);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [typedSearch, setTypedSearch] = useState('');
    const [typedCount, setTypedCount] = useState('');

    const inputRef = useRef(null);

    function searchBar(e) {
        e.preventDefault();
        setIsSearchFocused(false);
        setSearchQuery(typedSearch);
        setGuestCount(typedCount);
    }

    return (
        <div>
            <div onClick={(e) => { setIsSearchFocused(false) }} className={`${isSearchFocused ? "hidden md:block" : "hidden"} fixed inset-0 bg-black bg-opacity-30 z-10`}></div>

            <div className={`fixed top-0 left-0 w-full bg-white z-50 transition-all duration-300 ease-in-out ${isSearchFocused ? "md:h-48" : "md:h-[86px]"}`} style={{ boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.2)' }}>
                <div className="flex items-center justify-between p-4 container mx-auto">
                    <Link to="/" onClick={(e) => { setSearchQuery(""); setTypedSearch(""); setGuestCount(''); setTypedCount(''); }} className="text-primary">
                        <div className="items-center gap-1 flex">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 -rotate-90">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                            <span className="font-semibold text-2xl">airbnb</span>
                        </div>
                    </Link>

                    {/* displayed when search bar expanded */}
                    <div className={`hidden ${isSearchFocused ? "md:flex gap-8" : ""} transition-all duration-300 ease-in-out`}>
                        <p className="font-medium text-lg">Homes</p>
                        <p className="text-lg text-gray-600">Experiences</p>
                    </div>

                    {/* search bar for large screens */}
                    <div onClick={(e) => { setIsSearchFocused(true); setTimeout(() => { inputRef.current.focus() }, 100); }}
                        className={`hidden md:flex relative  items-center gap-4 shadow shadow-gray-200 border border-gray-300 rounded-full py-2 ps-6 pe-2 hover:shadow-md cursor-pointer ${isSearchFocused ? "md:hidden" : "md:flex"} transition-all duration-300 ease-in-out`}>

                        <div className="font-semibold w-[82px] overflow-hidden">{searchQuery.trim() == "" ? "Anywhere" : searchQuery}</div>
                        <div className="border-l border-gray-300 h-6"></div>
                        <div className="font-semibold">Any week</div>
                        <div className="border-l border-gray-300 h-6"></div>
                        <div className={`${guestCount != "" ? "w-14" : ""}`}>{guestCount == "" ? "Add guests" : guestCount}</div>
                        <button className="border bg-primary text-white p-2 border-gray-300 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </button>
                    </div>

                    <Link to={userName ? "/profile" : "/login"}>
                        <div className="flex items-center shadow shadow-gray-200 gap-4 border border-gray-300 rounded-full py-2 ps-2 md:ps-4 pe-2 hover:bg-gray-100">
                            <div className="ps-2 md:ps-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            </div>
                            {(profile != undefined && profile != '') &&
                                <div className="w-9 rounded-full overflow-hidden">
                                    <img src={profile}
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
                            {userName != undefined && userName != "" ? (
                                <div className="pe-2 hidden md:block">
                                    {userName}
                                </div>
                            ) : (
                                <div className="pe-2 hidden md:block font-semibold">
                                    Login
                                </div>
                            )}
                        </div>
                    </Link>
                </div>

                {/* search bar for small screens */}
                <div className="container mx-auto px-4">
                <div className="relative overflow-hidden flex mb-5 justify-between md:hidden items-center gap-4 shadow shadow-gray-200 border border-gray-300 rounded-full py-2 ps-6 hover:shadow-md">
                    <i className="bx bx-search absolute left-4 text-lg"></i>
                    <input className="ms-5 focus:outline-none placeholder-black"
                        placeholder="Start your search"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                </div>

                {/* search bar expansion */}
                <form onSubmit={(e) => searchBar(e)}
                    className={`hidden md:flex border rounded-full py-2 ps-8 pe-3 w-fit mx-auto items-center ${isSearchFocused ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-[-50%] invisible"} transition-all duration-300 ease-in-out`} style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)' }}>
                    <div className={`flex-col flex border-e hover:bg-gray-100 me-6 ${isSearchFocused ? "lg:w-60" : "w-10"} transition-all duration-300 ease-in-out`}>
                        Where
                        <input className="focus:outline-none placeholder-gray-500"
                            placeholder="Search destinations"
                            type="text"
                            ref={inputRef}
                            value={typedSearch}
                            onChange={(e) => setTypedSearch(e.target.value)} />
                    </div>

                    <div className={`flex flex-col border-e me-6 ${isSearchFocused ? "lg:w-36 w-28" : "w-10"} transition-all duration-300 ease-in-out`}>
                        Check in
                        <label className="text-gray-500">Add Dates</label>
                    </div>

                    <div className={`flex flex-col border-e me-6 ${isSearchFocused ? "lg:w-36 w-28" : "w-10"} transition-all duration-300 ease-in-out`}>
                        Check out
                        <label className="text-gray-500">Add Dates</label>
                    </div>

                    <div className={`flex flex-col ${isSearchFocused ? "lg:w-60 w-36" : "w-10"} transition-all duration-300 ease-in-out`}>
                        Who
                        <input className="focus:outline-none placeholder-gray-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            placeholder="Add guests"
                            type="number"
                            value={typedCount}
                            onChange={(e) => setTypedCount(e.target.value)} />
                    </div>

                    <button className="border bg-primary text-white p-2 border-gray-300 rounded-full w-14 h-14" type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 relative left-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Header;