"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/src/backend/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full py-4 bg-surface-container-highest text-primary font-bold text-sm uppercase tracking-widest hover:bg-error hover:text-on-error transition-all rounded-md"
    >
      Sign Out
    </button>
  );
}
