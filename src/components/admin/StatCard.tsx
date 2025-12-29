export default function StatCard({
  title,
  value,
  percent,
  icon,
}: {
  title: string;
  value: string;
  percent: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow flex justify-between items-center">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-3xl font-bold">{value}</h2>
        <p className="text-green-500 text-sm">{percent}</p>
      </div>
      <div className="text-blue-600">{icon}</div>
    </div>
  );
}
