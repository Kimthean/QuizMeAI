import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/nextauth";
import QuizzCard from "@/components/dashboard/QuizzCard";
import HistoryCard from "@/components/dashboard/History";
import Activity from "@/components/dashboard/Activity";
import HotTopic from "@/components/dashboard/HotTopic";

type Props = {};

export const metadata = {
  title: "Dashboard | QuizzMeAi",
};
const page = async ({}: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  return (
    <main className="p-8 mx-auto max-w-7xl">
      <div className="flex items-center">
        <h2 className="text-3xl mr-2 font-bold tracking-right">Dashboard</h2>
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <QuizzCard />
        <HistoryCard />
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
        <HotTopic />
        <Activity />
      </div>
    </main>
  );
};
export default page;
