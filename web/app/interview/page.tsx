import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BackgroundSystem } from "@/components/background/BackgroundSystem";
import { InterviewScreen } from "@/components/interview/InterviewScreen";
import { getSession } from "@/lib/actions/get-session";

export default async function InterviewPage({
  searchParams,
}: {
  searchParams: Promise<{ sessionId?: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/");

  const { sessionId } = await searchParams;
  if (!sessionId) redirect("/upload");

  const session = await getSession(sessionId);
  if (!session) redirect("/upload");

  return (
    <>
      <BackgroundSystem />
      <InterviewScreen session={session} />
    </>
  );
}
