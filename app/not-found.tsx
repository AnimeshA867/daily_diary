import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Go Home
          </Link>
          <Link
            href="/diary"
            className="px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
          >
            Go to Diary
          </Link>
        </div>

        <div className="pt-6">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <Link href="/support" className="text-accent hover:underline">
              Visit our support page
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
