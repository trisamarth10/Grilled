import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BackgroundSystem } from "@/components/background/BackgroundSystem";
import { CountdownScreen } from "@/components/countdown/CountdownScreen";

export default async function CountdownPage({
  searchParams,
}: {
  searchParams: Promise<{ sessionId?: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/");

  const { sessionId } = await searchParams;
  if (!sessionId) redirect("/upload");

  return (
    <>
      <BackgroundSystem />
      <CountdownScreen sessionId={sessionId} />
    </>
  );
}
