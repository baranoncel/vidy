"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";

type PendingResolver = {
  run: () => Promise<unknown>;
  resolve: (v: unknown) => void;
  reject: (e: unknown) => void;
};

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
  const pendingRef = useRef<PendingResolver | null>(null);

  const isAuthed = !!session?.user;

  // Properly awaitable: if not authed, open modal and keep promise pending
  // until user signs in (then run action) or closes modal (reject).
  const requireAuth = useCallback<Ctx["requireAuth"]>(
    (action) => {
      if (isAuthed) return Promise.resolve(action()) as Promise<ReturnType<typeof action>>;
      return new Promise((resolve, reject) => {
        pendingRef.current = {
          run: async () => action(),
          resolve: resolve as (v: unknown) => void,
          reject,
        };
        setOpen(true);
      }) as Promise<ReturnType<typeof action>>;
    },
    [isAuthed],
  );

  const openLogin = useCallback((afterLogin?: () => void) => {
    if (afterLogin) {
      pendingRef.current = {
        run: async () => afterLogin(),
        resolve: () => {},
        reject: () => {},
      };
    }
    setOpen(true);
  }, []);

  // When modal becomes auth'd, run the pending action and resolve its promise.
  useEffect(() => {
    if (open && isAuthed) {
      setOpen(false);
      const p = pendingRef.current;
      pendingRef.current = null;
      if (p) {
        Promise.resolve()
          .then(() => p.run())
          .then((v) => p.resolve(v))
          .catch((e) => p.reject(e));
      }
    }
  }, [open, isAuthed]);

  // If user dismisses without signing in, reject any pending promise so
  // calling code can show an error / cancel.
  const handleClose = useCallback(() => {
    setOpen(false);
    const p = pendingRef.current;
    pendingRef.current = null;
    if (p) p.reject(new Error("Cancelled — sign-in required"));
  }, []);

  return (
    <AuthGateContext.Provider value={{ requireAuth, openLogin, isAuthed, isLoading: isPending }}>
      {children}
      {open && <LoginModal onClose={handleClose} />}
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
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[400px] rounded-3xl border border-white/20 bg-white/85 p-7 shadow-2xl shadow-black/15 ring-1 ring-black/5 backdrop-blur-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full p-1.5 text-gray-500 hover:bg-black/5 hover:text-gray-900"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="mb-1 text-[22px] font-semibold tracking-tight text-gray-900">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h3>
        <p className="mb-6 text-sm text-gray-500">
          {mode === "signin"
            ? "Sign in to generate, edit, and run agent workflows."
            : "Get 500 Computational Coins free, no card required."}
        </p>

        <button
          onClick={withGoogle}
          disabled={busy}
          className="mb-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
        >
          <GoogleIcon className="h-4 w-4" />
          Continue with Google
        </button>

        <div className="mb-4 flex items-center gap-3 text-[11px] uppercase tracking-wider text-gray-400">
          <span className="h-px flex-1 bg-black/10" />
          or
          <span className="h-px flex-1 bg-black/10" />
        </div>

        <form onSubmit={withEmail} className="space-y-2.5">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={mode === "signup" ? 8 : 1}
            required
            className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
          />
          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 text-sm font-medium text-white shadow-sm transition hover:bg-black disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-gray-500">
          {mode === "signin" ? (
            <>
              New here?{" "}
              <button onClick={() => setMode("signup")} className="font-medium text-gray-900 underline-offset-2 hover:underline">
                Create account
              </button>
            </>
          ) : (
            <>
              Already have one?{" "}
              <button onClick={() => setMode("signin")} className="font-medium text-gray-900 underline-offset-2 hover:underline">
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.5 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.58c2.09-1.93 3.21-4.77 3.21-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.99 7.28-2.66l-3.58-2.75c-.99.66-2.26 1.06-3.7 1.06-2.84 0-5.25-1.92-6.11-4.5H2.18v2.84A10.99 10.99 0 0 0 12 23z" fill="#34A853" />
      <path d="M5.89 14.15A6.6 6.6 0 0 1 5.5 12c0-.75.13-1.47.36-2.15V7.01H2.18A10.99 10.99 0 0 0 1 12c0 1.78.43 3.46 1.18 4.99l3.71-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.16-3.16C17.45 1.99 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.01l3.71 2.84C6.75 7.3 9.16 5.38 12 5.38z" fill="#EA4335" />
    </svg>
  );
}
