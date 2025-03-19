import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";

function SearchBar({ onSearch }: { onSearch: (searchParams: string) => void }) {
  const [inputValue, setInputValue] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(inputValue);
      }}
      className="max-w-sm w-[80%]"
    >
      <div className="flex items-center border-2 border-black px-2 py-0.5 rounded-2xl">
        <Search size={25} />
        <Input
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          className="border-none outline-none focus-visible:ring-0"
        />
        <Button type="submit" className="ml-2">
          Search
        </Button>
      </div>
    </form>
  );
}

export default SearchBar;
