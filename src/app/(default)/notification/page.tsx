import { redirect } from "next/navigation";

async function page() {
  redirect(`/notification/all`);
}

export default page;
