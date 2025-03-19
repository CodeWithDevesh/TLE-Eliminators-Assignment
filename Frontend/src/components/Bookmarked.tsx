import { api } from "@/helpers/api";
import { BookmarkCheck } from "lucide-react";
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

function BookmarkedContests({
  filters,
  search,
}: {
  filters: string[];
  search: string;
}) {
  const [upcommingContests, setUpcommingContests] = useState<Contest[]>([]);

  const { loadUser, user } = useContext(AuthContext);

  useEffect(() => {
    const data = user?.bookmarks;
    if (data) {
      const filteredData = data.filter((contest: Contest) =>
        filters.length > 0 ? filters.includes(contest.platform) : true
      );
      const searchedData = filteredData.filter((contest: Contest) =>
        contest.name.toLowerCase().includes(search.toLowerCase())
      );
      setUpcommingContests(searchedData);
    }
  }, [filters, user, search]);

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
                      <BookmarkCheck size={20} />
                    </button>
                  )}
                </div>
                {contest.solution_link ? (
                  <a
                    href={contest.solution_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Solution
                  </a>
                ) : (
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
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default BookmarkedContests;
