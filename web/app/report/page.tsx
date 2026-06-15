import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { BackgroundSystem } from "@/components/background/BackgroundSystem";
import { ReportScreen } from "@/components/report/ReportScreen";
import { ReportLoading } from "@/components/report/ReportLoading";
import { getSession } from "@/lib/actions/get-session";
import { generateReport } from "@/lib/report/generate";
import type { SessionData, SessionReport } from "@/lib/actions/get-session";
import { createServerClient } from "@/lib/supabase/server";

async function getTranscript(sessionId: string): Promise<{ role: string; content: string }[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("sessions")
    .select("transcript")
    .eq("id", sessionId)
    .single();
  return (data?.transcript as { role: string; content: string }[] | null) ?? [];
}

async function ReportContent({ sessionId }: { sessionId: string }) {
  const session = await getSession(sessionId);
  if (!session) notFound();

  // If report already generated, render it directly
  let report: SessionReport | null = session.report;

  if (!report) {
    const transcript = await getTranscript(sessionId);
    report = await generateReport(session, transcript);
  }

  return <ReportScreen session={session} report={report} />;
}

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ sessionId?: string }>;
}) {
  const { sessionId } = await searchParams;
  if (!sessionId) redirect("/dashboard");

  return (
    <>
      <BackgroundSystem />
      <Suspense fallback={<ReportLoading />}>
        <ReportContent sessionId={sessionId} />
      </Suspense>
    </>
  );
}
