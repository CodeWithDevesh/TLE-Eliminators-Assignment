import { api } from "@/helpers/api";
import {
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "./auth/AuthContext";

interface Contest {
  _id: string;
  name: string;
  platform: string;
  url: string;
  start_time: Date;
  end_time: Date;
  solution_link?: string;
  bookmarked?: boolean;
}

function UpcommingContests({ filters, search }: { filters: string[], search: string }) {
  const [upcommingContests, setUpcommingContests] = useState<Contest[]>([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const { loadUser, user } = useContext(AuthContext);

  useEffect(() => {
    const platformQuery = filters.join(",");
    let url = `/contests?&startDate=${new Date().toUTCString()}&page=${page}&sort=start_time&search=${search}`;
    if (platformQuery) {
      url += `&platform=${platformQuery}`;
    }
    api
      .get(url)
      .then((res) => {
        if (res.data.ok) {
          setUpcommingContests(res.data.data);
          setMaxPage(res.data.pagination.totalPages);

          if (user) {
            const bookmarkedContests = user.bookmarks.map((bookmark : Contest) => bookmark._id);
            setUpcommingContests((prev) => {
              return prev.map((contest) => {
                return {
                  ...contest,
                  bookmarked: bookmarkedContests.includes(contest._id),
                };
              });
            });
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [filters, page, user, search]);

  const bookmark = (contestId: string) => {
    api
      .post("/user/bookmark", { contestId })
      .then((res) => {
        if (res.data.ok) {
          loadUser();
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to bookmark contest");
      });
  };

  return (
    <div className="mt-5 max-w-5xl m-auto">
      <ul className="mt-4 space-y-4">
        {upcommingContests.map((contest) => {
          return (
            <li
              key={contest._id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between"
            >
              <div>
                <a
                  href={contest.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  {contest.name}
                </a>
                <p className="text-sm text-gray-500">
                  Platform: {contest.platform}
                </p>
                <p className="text-sm text-gray-500">
                  Start: {new Date(contest.start_time).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Duration:{" "}
                  {(() => {
                    const duration =
                      new Date(contest.end_time).getTime() -
                      new Date(contest.start_time).getTime();
                    const hours = Math.floor(duration / (1000 * 60 * 60));
                    const minutes = Math.floor(
                      (duration % (1000 * 60 * 60)) / (1000 * 60)
                    );
                    return `${hours}h ${minutes}m`;
                  })()}
                </p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <div>
                  {user && (
                    <button
                      className="cursor-pointer"
                      onClick={() => {
                        bookmark(contest._id);
                      }}
                    >
                      {contest.bookmarked ? (
                        <BookmarkCheck size={20} />
                      ) : (
                        <Bookmark size={20} />
                      )}
                    </button>
                  )}
                </div>
                <p className="text-base text-black">
                  Starts in:{" "}
                  {(() => {
                    const now = new Date().getTime();
                    const startTime = new Date(contest.start_time).getTime();
                    const diff = startTime - now;

                    if (diff <= 0) return "Started";

                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor(
                      (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                    );
                    const minutes =
                      Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)) + 1;

                    return `${
                      days > 0 ? `${days}d ` : ""
                    }${hours}h ${minutes}m`;
                  })()}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex justify-end items-center mt-4 space-x-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 border rounded ${
            page === 1
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-white hover:bg-gray-300"
          }`}
        >
          <ChevronLeft size={20} />
        </button>
        <span className="px-2 py-1 border rounded text-sm bg-white">
          Page {page} of {maxPage}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, maxPage))}
          disabled={page === maxPage}
          className={`px-4 py-2 border rounded ${
            page === maxPage
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-white hover:bg-gray-300"
          }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default UpcommingContests;
