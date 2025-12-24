type SuggestionListProps = {
  list: string[];
  onSelect: (value: string) => void;
};

const SuggestionList = ({ list, onSelect }: SuggestionListProps) => {
  return (
    <ul className="absolute z-20 bg-white border rounded shadow w-full max-h-48 overflow-auto">
      {list.map((item, index) => (
        <li
          key={index}
          onClick={() => onSelect(item)}
          className="p-2 cursor-pointer hover:bg-gray-100"
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

export default SuggestionList;
