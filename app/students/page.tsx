import { validatePermission } from "@/app/lib/auth/authHelpers";
import StudentsPageClient from "./client";

async function StudentsPage() {

  await validatePermission("view:students");


  return <StudentsPageClient />;
}

export default StudentsPage;
