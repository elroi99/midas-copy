import SpendAdvisor from "@/src/components/v0/SpendAdvisor";

export default function V0Page() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white">v0 Spend Advisor</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Per-spend route optimizer — developer &amp; user views
          </p>
        </div>
        <SpendAdvisor />
      </div>
    </main>
  );
}
