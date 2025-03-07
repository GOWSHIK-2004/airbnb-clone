import { useState } from "react";
import { storage } from "../../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { useEffect } from "react";
import UploadSkeleton from "../skeletons/UploadSkeleton";

export default function FormPhotos({ photos, setPhotos, photoLink, setPhotoLink }) {
    const [loading, setLoading] = useState(false);
    const [uploads, setUploads] = useState([...photos]);
    const [links, setLinks] = useState([]);

    useEffect(() => { setPhotos([...uploads, ...links]) }, [uploads, links])

    async function addPhotoByLink(e) {
        try {
            e.preventDefault();
            setPhotoLink('');
            setLinks([...links, photoLink])
        } catch (e) {
            if (e.response.status >= 400) {
                alert(e.response.data.message);
            }
        }
    }

    async function uploadFromDevice(e) {
        const selectedFiles = e.target.files;
        if (selectedFiles.length === 0) return;
        setLoading(true);
        const uploadPromises = Array.from(selectedFiles).map(async (file) => {
            const storageRef = ref(storage, `placePhotos/${file.name}`);
            const snapshot = await uploadBytesResumable(storageRef, file);
            return getDownloadURL(snapshot.ref);
        });

        try {
            const uploadedUrls = await Promise.all(uploadPromises);
            setUploads([...uploads, ...uploadedUrls]);
            setLoading(false);
        } catch (e) {
            if (e.response.status >= 400) {
                alert(e.response.data.message);
            }
            setLoading(false);
        }
    }


    async function removePhoto(e, photoUrl) {
        e.preventDefault();
        if (links.includes(photoUrl)) { setLinks(prevPhotos => prevPhotos.filter(photo => photo !== photoUrl)); return }
        try {
            const filePath = photoUrl.split("/o/")[1].split("?")[0];
            const decodedPath = decodeURIComponent(filePath);

            const storageRef = ref(storage, decodedPath);
            await deleteObject(storageRef);

            setUploads(prevPhotos => prevPhotos.filter(photo => photo !== photoUrl))
        } catch (e) {
            if (e.response.status >= 400) {
                alert(e.response.data.message);
            }
        }
    }

    function mainPhoto(e, photo) {
        e.preventDefault();
        setPhotos([photo, ...photos.filter(item => item != photo)]);
    }

    return (
        <div>
            <h2 className="text-2xl mt-4">Photos</h2>
            <p className="text-gray-500 text-sm my-1">More = Better</p>
            <div className="flex gap-2">
                <input type="text"
                    value={photoLink}
                    onChange={(e) => setPhotoLink(e.target.value)}
                    className="border rounded-2xl py-2 px-3 w-full"
                    placeholder="enter resource link of an image to dowload" />
                <button onClick={(e) => addPhotoByLink(e)} className="bg-gray-200 rounded-2xl px-4">Add&nbsp;Photo</button>
            </div>
            <div className="mt-2 flex gap-2 flex-wrap">
                {photos.length > 0 &&
                    photos.map((item, index) => (
                        <div key={index} className="flex relative">
                            <img src={item} className="rounded-2xl h-32" />
                            <button onClick={(e) => removePhoto(e, item)} className="absolute bottom-0 right-0 text-white bg-black opacity-50 rounded-xl p-2 m-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                            <button onClick={(e) => mainPhoto(e, item)} className="absolute top-0 right-0 text-white bg-black bg-opacity-50 rounded-xl p-2 m-1">
                                {item == photos[0] && (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {item != photos[0] && (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    ))
                }
                {!loading ?
                    <label className="flex gap-1 justify-center p-5 items-center border rounded-2xl text-lg h-32 cursor-pointer">
                        <input type="file"
                            multiple
                            onChange={(e) => uploadFromDevice(e)}
                            className="hidden" />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                        </svg>
                        Upload from device
                    </label>
                    :
                    <UploadSkeleton />
                }
            </div>
        </div>
    );
}