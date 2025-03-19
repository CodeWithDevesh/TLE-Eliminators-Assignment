import { useContext, useEffect, useState } from "react";
import PastContests from "@/components/Past";
import UpcommingContests from "@/components/Upcomming";
import BookmarkedContests from "@/components/Bookmarked";
import { AuthContext } from "@/components/auth/AuthContext";
import SearchBar from "@/components/Search";

export default function HomePage() {
  const [allSelected, setAllSelected] = useState(true);
  const [codeforcesSelected, setCodeforcesSelected] = useState(false);
  const [leetcodeSelected, setLeetcodeSelected] = useState(false);
  const [codechefSelected, setCodechefSelected] = useState(false);
  const [mode, setMode] = useState("upcomming");

  const [filters, setFilters] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!allSelected) return;
    if (codechefSelected) setCodechefSelected(false);
    if (leetcodeSelected) setLeetcodeSelected(false);
    if (codeforcesSelected) setCodeforcesSelected(false);

    setFilters([]);
  }, [allSelected]);

  useEffect(() => {
    if (!codeforcesSelected && !leetcodeSelected && !codechefSelected)
      setAllSelected(true);
    if (codechefSelected || leetcodeSelected || codeforcesSelected)
      setAllSelected(false);
    if (codechefSelected && leetcodeSelected && codeforcesSelected)
      setAllSelected(true);

    const fil = [];
    if (codeforcesSelected) fil.push("codeforces");
    if (leetcodeSelected) fil.push("leetcode");
    if (codechefSelected) fil.push("codechef");
    setFilters(fil);
  }, [codeforcesSelected, leetcodeSelected, codechefSelected]);

  return (
    <div className="min-h-screen p-6 text-foreground w-[90vw] m-auto overflow-hidden my-[80px]">
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-2xl sm:text-5xl text-center font-bold">TLE Contest Tracker</h1>
      </div>

      <div className="tab-bar mt-5 flex space-x-2 justify-center text-[10px] sm:text-base sm:space-x-4">
        <button
          className={`cursor-pointer px-2 py-1 sm:px-4 sm:py-2 rounded ${
            allSelected ? "bg-gray-300" : "bg-transparent"
          }`}
          onClick={() => setAllSelected(true)}
        >
          All
        </button>

        <button
          className={`cursor-pointer px-4 py-2 rounded ${
            codeforcesSelected ? "bg-gray-300" : "bg-transparent"
          }`}
          onClick={() => setCodeforcesSelected(!codeforcesSelected)}
        >
          Codeforces
        </button>

        <button
          className={`cursor-pointer px-4 py-2 rounded ${
            leetcodeSelected ? "bg-gray-300" : "bg-transparent"
          }`}
          onClick={() => setLeetcodeSelected(!leetcodeSelected)}
        >
          Leetcode
        </button>

        <button
          className={`cursor-pointer px-4 py-2 rounded ${
            codechefSelected ? "bg-gray-300" : "bg-transparent"
          }`}
          onClick={() => setCodechefSelected(!codechefSelected)}
        >
          CodeChef
        </button>
      </div>

      <div className="max-w-5xl m-auto mt-5">
        <div className="flex justify-between items-center flex-col sm:flex-row">
          <div className="flex gap-3">
            <div
              className={`px-2 py-1 cursor-pointer hover:bg-gray-200 ${
                mode === "upcomming" && "font-bold"
              }`}
              onClick={() => {
                setMode("upcomming");
              }}
            >
              UpComming
            </div>
            <div
              className={`px-2 py-1 cursor-pointer hover:bg-gray-200 ${
                mode === "past" && "font-bold"
              }`}
              onClick={() => {
                setMode("past");
              }}
            >
              Past
            </div>
            {user && (
              <div
                className={`px-2 py-1 cursor-pointer hover:bg-gray-200 ${
                  mode === "bookmark" && "font-bold"
                }`}
                onClick={() => {
                  setMode("bookmark");
                }}
              >
                Bookmarked
              </div>
            )}
          </div>

          <SearchBar onSearch={(s) => {setSearch(s)}}/>
        </div>
        {mode == "past" && <PastContests search={search} filters={filters} />}
        {mode == "upcomming" && <UpcommingContests search={search} filters={filters} />}
        {mode == "bookmark" && <BookmarkedContests search={search} filters={filters} />}
      </div>
    </div>
  );
}
