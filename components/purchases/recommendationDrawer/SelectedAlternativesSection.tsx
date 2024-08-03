// SelectedAlternativesSection.tsx
import { TrashIcon } from "@heroicons/react/24/outline";

const selectedAlternatives = [
  {
    id: 4,
    name: "Erdnüsse",
    category: "Nüsse",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 5,
    name: "Haselnüsse",
    category: "Nüsse",
    image: "https://via.placeholder.com/150",
  },
];

export default function SelectedAlternativesSection() {
  return (
    <div className="space-y-4 overflow-y-scroll p-4 pr-4 border-r mr-4">
      <h3 className="block text-md font-base text-gray-500">
        Selektierte alternative Artikel
      </h3>
      {selectedAlternatives.map((product) => (
        <div
          key={product.id}
          className="flex items-center space-x-4 justify-between"
        >
          <div className="flex items-center space-x-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 rounded-md"
            />
            <div>
              <h4 className="text-gray-900 font-semibold">{product.name}</h4>
              <p className="text-gray-500">{product.category}</p>
            </div>
          </div>
          <TrashIcon className="h-6 w-6 text-gray-500 hover:text-red-500 cursor-pointer" />
        </div>
      ))}
    </div>
  );
}
