"use client";

import { LiveblocksProvider } from "@liveblocks/react/suspense";

const LiveBlocksProvider = ({ children }: { children: React.ReactNode }) => {
  if (!process.env.NEXT_PUBLIC_LIVEELOCKS_PUBLIC_KEY) {
  }

  return (
    <LiveblocksProvider throttle={16} authEndpoint={"/auth-endpoint"}>
      {children}
    </LiveblocksProvider>
  );
};

export default LiveBlocksProvider;
