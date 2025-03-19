import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { useContext, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { api } from "@/helpers/api";
import { toast } from "react-toastify";
import { AuthContext } from "./auth/AuthContext";

export default function SollutionDialog({ contestId }: { contestId: string }) {
  const [link, setLink] = useState<string>("");
  const {loadUser} = useContext(AuthContext);
  const add = async () => {
    if (!link) {
      toast.error("Link is required");
      return;
    }
    api
      .post("/contests/solution", { contestId, solution_link: link })
      .then((res) => {
        if (res.data.ok) {
          toast.success("Link added successfully");
          loadUser();
        } else {
          console.error(res.data.message);
          toast.error("Failed to add link");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to add link");
      });
  };

  return (
    <Dialog>
      <DialogTrigger className="py-1 px-3 border bg-green-400 hover:scale-105 transition-all active:scale-95 cursor-pointer rounded-xl">
        Add Solution
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add the sollution Link!!!</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Input
          onChange={(e) => {
            setLink(e.target.value);
          }}
        />
        <DialogFooter>
          <Button onClick={add}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
