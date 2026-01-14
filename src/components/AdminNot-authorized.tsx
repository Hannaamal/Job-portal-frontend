export default function AdminNotAuthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-4xl font-bold text-red-600">403</h1>
        <h2 className="mt-2 text-xl font-semibold text-gray-800">
          Access Denied
        </h2>
        <p className="mt-3 text-gray-600">
          You don’t have permission to view this page.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <a
            href="/admin/dashboard"
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
