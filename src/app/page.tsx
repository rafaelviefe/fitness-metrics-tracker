'use client';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
      <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">
        Fitness Metrics Tracker
      </h1>
      <p className="text-neutral-500">
        System Status: <span className="text-green-600 font-semibold">Online</span>
      </p>
    </main>
  );
}