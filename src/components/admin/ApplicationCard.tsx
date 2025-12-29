function ApplicationRow({
  title,
  received,
  hold,
  rejected,
}: any) {
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

export default function ApplicationsCard() {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-semibold mb-4">Applications</h3>

      <div className="space-y-4">
        <ApplicationRow
          title="Design"
          received="05"
          hold="01"
          rejected="03"
        />
        <ApplicationRow
          title="React JS"
          received="25"
          hold="03"
          rejected="06"
        />
      </div>
    </div>
  );
}
