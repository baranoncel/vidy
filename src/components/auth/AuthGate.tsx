"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient, useSession } from "@/lib/auth-client";

type Ctx = {
  requireAuth: <T>(action: () => Promise<T> | T) => Promise<T | undefined>;
  openLogin: (afterLogin?: () => void) => void;
  isAuthed: boolean;
  isLoading: boolean;
};

const AuthGateContext = createContext<Ctx | null>(null);

export function useAuthGate() {
  const ctx = useContext(AuthGateContext);
  if (!ctx) throw new Error("useAuthGate must be used within <AuthGateProvider>");
  return ctx;
}

export function AuthGateProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const pendingActionRef = useRef<(() => unknown) | null>(null);

  const isAuthed = !!session?.user;

  const requireAuth = useCallback<Ctx["requireAuth"]>(
    async (action) => {
      if (isAuthed) {
        return await action();
      }
      pendingActionRef.current = action as () => unknown;
      setOpen(true);
      return undefined;
    },
    [isAuthed],
  );

  const openLogin = useCallback((afterLogin?: () => void) => {
    pendingActionRef.current = afterLogin ?? null;
    setOpen(true);
  }, []);

  // Close modal once authed; auto-run pending action.
  useEffect(() => {
    if (open && isAuthed) {
      setOpen(false);
      const cb = pendingActionRef.current;
      pendingActionRef.current = null;
      if (cb) Promise.resolve().then(() => cb());
    }
  }, [open, isAuthed]);

  return (
    <AuthGateContext.Provider value={{ requireAuth, openLogin, isAuthed, isLoading: isPending }}>
      {children}
      {open && <LoginModal onClose={() => setOpen(false)} />}
    </AuthGateContext.Provider>
  );
}

function LoginModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function withGoogle() {
    setBusy(true);
    try {
      await authClient.signIn.social({ provider: "google", callbackURL: window.location.href });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  async function withEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "signup") {
        const r = await authClient.signUp.email({ name, email, password });
        if (r.error) throw new Error(r.error.message || "Sign-up failed");
      }
      const r2 = await authClient.signIn.email({ email, password });
      if (r2.error) throw new Error(r2.error.message || "Sign-in failed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-950 p-6 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-3 top-3 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white">
          <X className="h-4 w-4" />
        </button>
        <div className="mb-1 text-xs uppercase tracking-wider text-violet-400">{mode === "signin" ? "Welcome back" : "Get 500 coins free"}</div>
        <h3 className="mb-1 text-2xl font-semibold">{mode === "signin" ? "Sign in to continue" : "Create your Vidy account"}</h3>
        <p className="mb-6 text-sm text-neutral-400">
          {mode === "signin"
            ? "Sign in to generate, edit, and run agent workflows."
            : "Sign up — 500 Computational Coins on the house, no card required."}
        </p>

        <Button onClick={withGoogle} disabled={busy} variant="outline" className="mb-4 w-full">
          Continue with Google
        </Button>

        <div className="mb-4 flex items-center gap-3 text-xs text-neutral-500">
          <span className="h-px flex-1 bg-neutral-800" />
          OR
          <span className="h-px flex-1 bg-neutral-800" />
        </div>

        <form onSubmit={withEmail} className="space-y-3">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-violet-500"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-violet-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={mode === "signup" ? 8 : 1}
            required
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-violet-500"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" disabled={busy} className="w-full gap-2">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-neutral-500">
          {mode === "signin" ? (
            <>
              Don&apos;t have an account?{" "}
              <button onClick={() => setMode("signup")} className="font-medium text-violet-400 hover:underline">
                Create one
              </button>
            </>
          ) : (
            <>
              Already a user?{" "}
              <button onClick={() => setMode("signin")} className="font-medium text-violet-400 hover:underline">
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
