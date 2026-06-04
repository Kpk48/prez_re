export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getRole } from "@/lib/access";

export default async function CompanyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const role = await getRole();

    if (!role || (role !== "company" && role !== "admin")) {
        redirect("/forbidden");
    }

    return <>{children}</>;
}