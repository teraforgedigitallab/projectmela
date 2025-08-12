import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc, collection } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Link } from "react-router-dom";
import StatusBadge from '../../ui/StatusBadge';
import { RxCross2 } from "react-icons/rx";

const SavedJobs = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookmarksWithStatus, setBookmarksWithStatus] = useState([]);

    // Fetch bookmarks
    useEffect(() => {
        const fetchBookmarks = async () => {
            setLoading(true);
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
                setBookmarks([]);
                setBookmarksWithStatus([]);
                setLoading(false);
                return;
            }
            const userDocRef = doc(db, "Users", user.email);
            const userDoc = await getDoc(userDocRef);
            let bookmarksArr = [];
            if (userDoc.exists() && userDoc.data().bookmarks) {
                bookmarksArr = userDoc.data().bookmarks;
                setBookmarks(bookmarksArr);
            } else {
                setBookmarks([]);
            }

            // Fetch status for each bookmarked job
            const jobsWithStatus = await Promise.all(
                bookmarksArr.map(async (job) => {
                    try {
                        const projectDoc = await getDoc(doc(db, "Projects", job.jobID));
                        return {
                            ...job,
                            status: projectDoc.exists() ? projectDoc.data().status : "Unknown",
                        };
                    } catch {
                        return { ...job, status: "Unknown" };
                    }
                })
            );
            setBookmarksWithStatus(jobsWithStatus);
            setLoading(false);
        };
        fetchBookmarks();
    }, []);

    // Remove bookmark handler
    const handleRemoveBookmark = async (jobID) => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;
        const userDocRef = doc(db, "Users", user.email);
        const userDoc = await getDoc(userDocRef);
        let bookmarksArr = userDoc.exists() && userDoc.data().bookmarks ? userDoc.data().bookmarks : [];
        bookmarksArr = bookmarksArr.filter(b => b.jobID !== jobID);
        await updateDoc(userDocRef, { bookmarks: bookmarksArr });
        setBookmarks(bookmarksArr);
    };

    return (
        <div className="bg-white rounded-sm shadow p-4 md:p-8">
            <h2 className="font-bold text-xl mb-4">Bookmarked Projects</h2>
            {loading ? (
                <div className="text-gray-500 py-8 text-center">Loading...</div>
            ) : bookmarks.length === 0 ? (
                <div className="text-gray-500 py-8 text-center">
                    You have no bookmarked projects yet.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <ul className="divide-y divide-gray-400">
                        {bookmarksWithStatus.map((job) => (
                            <li
                                key={job.jobID}
                                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-base md:text-lg text-primary">
                                        {job.jobTitle}
                                    </div>
                                    <div className="text-xs text-gray-500 mb-1">
                                        {job.companyName || ""}
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-1 items-center">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                                            {job.projectType}
                                        </span>
                                        <StatusBadge status={job.status || "Unknown"} />
                                    </div>
                                </div>
                                <div className="flex-shrink-0 mt-2 md:mt-0 flex items-center gap-6">

                                    <Link
                                        to={`/project-detail/${job.jobID}`}
                                        className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded transition font-semibold text-sm"
                                    >
                                        Visit
                                    </Link>

                                    <button
                                        onClick={() => handleRemoveBookmark(job.jobID)}
                                        className="text-primary hover:text-red-500 transition cursor-pointer"
                                        title="Remove Bookmark"
                                    >
                                        <RxCross2 size={20} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SavedJobs;