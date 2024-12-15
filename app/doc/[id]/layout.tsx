import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";

const DocLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params; // Unwrap the params Promise

  auth.protect(); // Call your authentication logic

  return <RoomProvider roomId={id}>{children}</RoomProvider>;
};

export default DocLayout;

