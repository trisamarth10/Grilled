import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BackgroundSystem } from "@/components/background/BackgroundSystem";
import { Navbar } from "@/components/layout/Navbar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { syncUser } from "@/lib/actions/sync-user";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  await syncUser({
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress ?? "",
    name: user.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : null,
    avatarUrl: user.imageUrl ?? null,
  });

  return (
    <>
      <BackgroundSystem />
      <Navbar />
      <Dashboard
        name={user.firstName ?? user.emailAddresses[0]?.emailAddress ?? "there"}
      />
    </>
  );
}
