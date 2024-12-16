"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormEvent, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { deleteDocument, InviteUserToDocument } from "@/actions/actions";
import { toast } from "sonner";
import { Input } from "./ui/input";

const InviteUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();

    const roomId = pathname.split("/").pop();
    if (!roomId)  return;

    startTransition(async () => {
      const { success } = await InviteUserToDocument(roomId, email);

      if (success) {
        setIsOpen(false);
        setEmail('')
        toast.success("User Adding to Room Successfully!");
      } else {
        toast.error("Failed to add user to room!");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button className=" text-black rounded shadow-md hover:bg-gray-200 transition disabled:bg-gray-300/90">
        <DialogTrigger>Invite</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a User to collaborate!</DialogTitle>
          <DialogDescription>
            Enter the email of user you want to invite
          </DialogDescription>
        </DialogHeader>
        <form className="flex gap-2" onSubmit={handleInvite}>
          <Input
            type="email"
            placeholder="Email"
            className="rounded border-spacing-1 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            className="bg-black text-white px-4 py-2 rounded shadow-md hover:bg-gray-600 transition disabled:bg-gray-300"
            type="submit"
            disabled={!email || isPending}
          >
            {isPending ? "Inviting..." : "Invite"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUser;
