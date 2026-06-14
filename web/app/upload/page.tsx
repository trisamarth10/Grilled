import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BackgroundSystem } from "@/components/background/BackgroundSystem";
import { Navbar } from "@/components/layout/Navbar";
import { UploadScreen } from "@/components/upload/UploadScreen";

export default async function UploadPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  return (
    <>
      <BackgroundSystem />
      <Navbar />
      <UploadScreen userId={user.id} />
    </>
  );
}
