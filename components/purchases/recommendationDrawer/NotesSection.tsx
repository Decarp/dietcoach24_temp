// NotesSection.tsx
export default function NotesSection({
  notes,
  setNotes,
}: {
  notes: string;
  setNotes: (notes: string) => void;
}) {
  return (
    <section className="mt-8">
      <h2 className="block text-xl font-medium leading-6 text-gray-900">
        Weitere Notizen hinzufügen (optional)
      </h2>
      <div className="mt-4">
        <textarea
          id="comment"
          name="comment"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="block w-full rounded-md py-1.5 text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>
    </section>
  );
}
