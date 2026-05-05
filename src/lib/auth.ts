import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";

const getBaseURL = () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  return `http://localhost:${process.env.PORT || 3000}`;
};

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  baseURL: getBaseURL(),
  secret: process.env.BETTER_AUTH_SECRET || "dev-secret-change-me",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      mapProfileToUser: (profile) => ({
        email: profile.email,
        name: profile.name,
        image: profile.picture,
        emailVerified: profile.email_verified || false,
      }),
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "credential"],
    },
  },
  user: {
    additionalFields: {
      plan: { type: "string", defaultValue: "free", required: false },
      stripeCustomerId: { type: "string", required: false },
      shareOptIn: { type: "boolean", defaultValue: false, required: false },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },
  trustedOrigins: [
    "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ],
  advanced: {
    cookiePrefix: "vidy",
    database: { generateId: () => crypto.randomUUID() },
  },
});

export type Session = typeof auth.$Infer.Session;

export async function requireSession(headers: Headers) {
  const session = await auth.api.getSession({ headers });
  if (!session?.user) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return session;
}
