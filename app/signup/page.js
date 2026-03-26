"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/backend/lib/supabase/client";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Create profile
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: fullName,
        email,
        role: "user",
      });
    }

    router.push("/join");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <nav className="w-full z-50 glass-nav">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
          <Link href="/">
            <span className="font-headline font-black tracking-tighter text-xl text-black uppercase">
              KINETIC
            </span>
          </Link>
          <Link
            href="/login"
            className="text-secondary font-bold text-xs tracking-widest uppercase hover:text-primary transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <span className="text-secondary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
              Begin Your Journey
            </span>
            <h1 className="font-headline font-black text-5xl tracking-tighter text-primary mb-4">
              JOIN THE
              <br />
              MOVEMENT.
            </h1>
            <p className="text-on-surface-variant">
              Create your account and start making every swing count.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <div className="bg-error-container text-on-error-container px-4 py-3 text-sm rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-on-surface-variant mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-transparent border-0 border-b-2 border-outline-variant/40 py-3 focus:ring-0 focus:border-secondary transition-all font-body text-lg placeholder:text-outline/40"
                placeholder="Marcus Chen"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-on-surface-variant mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-0 border-b-2 border-outline-variant/40 py-3 focus:ring-0 focus:border-secondary transition-all font-body text-lg placeholder:text-outline/40"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-on-surface-variant mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-0 border-b-2 border-outline-variant/40 py-3 focus:ring-0 focus:border-secondary transition-all font-body text-lg placeholder:text-outline/40"
                placeholder="Min 6 characters"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-4 font-bold tracking-widest uppercase text-sm hover:bg-secondary transition-all duration-300 rounded-md disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-on-surface-variant">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-secondary font-bold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
