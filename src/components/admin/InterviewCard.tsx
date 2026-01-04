function InterviewItem({ name, role, time }: any) {
  return (
    <div className="flex justify-between items-center mb-3">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-xs text-gray-500">{role}</p>
      </div>
      <span className="text-sm text-gray-400">{time}</span>
    </div>
  );
}

export default function InterviewsCard({ data }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-semibold mb-4">Interviews</h3>

      {data.map((item: any, i: number) => (
        <InterviewItem key={i} {...item} />
      ))}

      <button className="w-full mt-4 py-2 rounded-lg border text-blue-600">
        + Add Interview
      </button>
    </div>
  );
}
