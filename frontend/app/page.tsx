import DashboardContainerPage from "@/src/components/pages/Dashboard/page"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "",
  description:
    "",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <DashboardContainerPage />
  )
}
