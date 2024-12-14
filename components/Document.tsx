"use client";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Editor from "./Editor";

const Document = ({ id }: { id: string }) => {
  const [input, setInput] = useState("");
  const [isUpdate, setTransition] = useTransition();
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));

  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  const updateTitle = (e: FormEvent) => {
    e.preventDefault();

    if (input.trim()) {
      setTransition(async () => {
        await updateDoc(doc(db, "documents", id), {
          title: input,
        });
      });
    }
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading document: {error.message}</div>;

  return (
    <div>
      <div className="flex max-w-3xl mx-auto justify-between pb-5">
        <form className="flex flex-1 space-x-2" onSubmit={updateTitle}>
          {/* Search by title*/}
          <Input
            className="rounded border-spacing-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            className="bg-black text-white px-4 py-2 rounded shadow-md hover:bg-gray-600 transition disabled:bg-gray-300"
            type="submit"
            disabled={isUpdate}
          >
            {isUpdate ? "Updating..." : "Update"}
          </Button>

          <hr className="pb-10" />
          {/* Collaborative Editor*/}
        </form>
      </div>
      <Editor />
    </div>
  );
};

export default Document;
