import { getServerAuthSession } from "@/auth";
import { redirect } from "next/navigation";
import StudentsPageClient from "./client";

async function StudentsPage() {
  // Server-side validation: only teacher/admin can access
  const session = await getServerAuthSession();
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const role = session.user.role ?? "student";
  
  if (role === "student") {
    redirect("/");
  }

  // If authorized, render the client component
  return <StudentsPageClient />;
}

export default StudentsPage;
