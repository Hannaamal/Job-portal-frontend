export default function JobStatsChart({ data }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-semibold mb-4">Job Stats</h3>

      <div className="grid grid-cols-7 gap-4 items-end h-40">
        {data.map((h: number, i: number) => (
          <div
            key={i}
            className="bg-blue-500 rounded-md"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>
    </div>
  );
}
