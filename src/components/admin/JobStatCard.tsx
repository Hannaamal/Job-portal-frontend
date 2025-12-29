export default function JobStatsChart() {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-semibold mb-4">Job Stats</h3>

      <div className="grid grid-cols-7 gap-4 items-end h-40">
        {[60, 80, 40, 90, 120, 70, 50].map((h, i) => (
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
