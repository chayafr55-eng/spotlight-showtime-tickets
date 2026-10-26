import type { ReactNode } from "react";

export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="glass w-full max-w-md rounded-3xl p-8 md:p-10">
        <h1 className="text-4xl">{title}</h1>
        <p className="mb-8 mt-2 text-muted-foreground">{subtitle}</p>
        {children}
      </div>
    </main>
  );
}
