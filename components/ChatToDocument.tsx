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
import { Input } from "./ui/input";
import * as Y from "yjs";
import { BotIcon, MessageCircleCode } from "lucide-react";
import Markdown from "react-markdown";
import { toast } from "sonner";

const ChatToDocument = ({ doc }: { doc: Y.Doc }) => {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");

  const handleAskQuestion = async (e: FormEvent) => {
    e.preventDefault();

    setQuestion(input);

    startTransition(async () => {
      const documentData = doc.get("document-store").toJSON();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/chatToDocument`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentData,
            question: input,
          }),
        }
      );
      if (res.ok) {
        const { message } = await res.json();

        setInput("");
        setSummary(message);

        toast.success("Question asked successfully");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button className=" text-black rounded shadow-md hover:bg-gray-200 transition disabled:bg-gray-300/90">
        <DialogTrigger>
          <MessageCircleCode className="mr-2" />
          Chat to Document
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat to the Document!</DialogTitle>
          <DialogDescription>
            Ask a quesiton and chat to the document with AI.
          </DialogDescription>
          <hr className="mt-5 " />
          {question && <p className="mt-5 text-gray-500">Q: {question}</p>}
        </DialogHeader>

        {summary && (
          <div className="flex flex-col items-center max-h-96 overflow-scroll gap-2 p-5 bg-gray-100">
            <div className="flex">
              <BotIcon className="w-10 flex-shrink-0" />
              <p className="font-bold">
                GPT{isPending ? "is thinking..." : "Says: "}
              </p>
            </div>
            <p>{isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}</p>
          </div>
        )}

        <form className="flex gap-2" onSubmit={handleAskQuestion}>
          <Input
            type="text"
            placeholder="i.e what is this about"
            className="rounded border-spacing-1 w-full"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            className="bg-black text-white px-4 py-2 rounded shadow-md hover:bg-gray-600 transition disabled:bg-gray-300"
            type="submit"
            disabled={!input || isPending}
          >
            {isPending ? "Asking..." : "Ask"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatToDocument;
