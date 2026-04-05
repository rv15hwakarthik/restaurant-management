import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-zinc-50 px-4 py-10 dark:bg-zinc-950">
      <Suspense fallback={<div className="text-sm text-zinc-500">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
