"use client";

import { db } from "@/firebase";
import { doc } from "firebase/firestore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDocumentData } from "react-firebase-hooks/firestore";
import LoadingSpinner from "@/components/LoadingSpinner";

interface SidebarOptionProps {
  href: string;
  id: string;
}

function SidebarOption({ href, id }: SidebarOptionProps) {
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const pathname = usePathname();
  const isActive = href.includes(pathname) && pathname !== "/";

  if (loading) return <LoadingSpinner />; // Show a loading spinner
  if (error) return <p>Error loading document.</p>; // Show error message
  if (!data) return null;

  return (
    <Link
      href={href}
      className={`border p-2 rounded ${
        isActive ? "bg-gray-300 font-bold border-black" : "border-gray-400"
      }`}
    >
      <p className="truncate">{data.title}</p>
    </Link>
  );
}

export default SidebarOption;
