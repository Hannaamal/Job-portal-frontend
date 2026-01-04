function ApplicationRow({ title, received, hold, rejected }: any) {
  return (
    <div>
      <p className="font-medium">{title}</p>
      <div className="flex gap-4 text-sm text-gray-600 mt-1">
        <span>{received} Received</span>
        <span>{hold} On hold</span>
        <span>{rejected} Rejected</span>
      </div>
    </div>
  );
}

export default function ApplicationsCard({ data }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-semibold mb-4">Applications</h3>

      <div className="space-y-4">
        {data.map((item: any, i: number) => (
          <ApplicationRow key={i} {...item} />
        ))}
      </div>
    </div>
  );
}
