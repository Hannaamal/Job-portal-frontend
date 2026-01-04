export default function ResourceStatusCard({ data }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center">
      <h3 className="font-semibold mb-4">Resource Status</h3>

      <div className="relative w-40 h-40 rounded-full border-8 border-blue-500 flex items-center justify-center">
        <span className="text-2xl font-bold">{data.total}</span>
      </div>

      <div className="mt-4 text-sm space-y-1">
        <p>Present: <b>{data.present}</b></p>
        <p>Remote: <b>{data.remote}</b></p>
        <p>Absent: <b>{data.absent}</b></p>
      </div>
    </div>
  );
}
