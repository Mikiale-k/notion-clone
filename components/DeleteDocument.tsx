"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { deleteDocument } from "@/actions/actions";
import { toast } from "sonner";

const DeleteDocument = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();

  const handleDelete = async () => {
    const roomId = pathname.split("/").pop();
    if (!roomId) return;

    startTransition(async () => {
      try {
        const { success } = await deleteDocument(roomId);

        if (success) {
          setIsOpen(false);
          router.replace("/");
          toast.success("Room Deleted Successfully!");
        } else {
          toast.error("Failed to delete room!");
        }
      } catch (error) {
        toast.error("An unexpected error occurred!");
        console.error("Delete error:", error);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button className="bg-red-500 px-3 text-white rounded shadow-md hover:bg-red-600 transition disabled:bg-red-300/90">
        <DialogTrigger>Delete</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end gap-2">
          <Button
            type="button"
            
            
            className="bg-red-500 px-3 text-white rounded shadow-md hover:bg-red-600 transition disabled:bg-red-300/90"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
          <DialogClose>
            <Button
              type="button"
              className="rounded shadow-md hover:bg-gray-200"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDocument;
