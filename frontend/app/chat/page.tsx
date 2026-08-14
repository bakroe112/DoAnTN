import ChatContainerPage from "@/src/components/pages/Chat/page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "",
  description:
    "",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ChatPage() {
  return <ChatContainerPage />;
}
