import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container flex min-h-[50vh] items-center justify-center py-16 text-center">
      <section className="mx-auto flex max-w-xl flex-col items-center gap-4">
        <span className="text-foreground block text-8xl font-bold">404</span>
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <div className="text-muted-foreground">
          <p>
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>
        <Link
          href="/"
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-md px-4 py-2 transition"
        >
          Back to home
        </Link>
      </section>
    </main>
  );
}
