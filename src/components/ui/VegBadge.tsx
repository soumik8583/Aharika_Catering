export default function VegBadge({ veg }: { veg: boolean }) {
  return (
    <span
      title={veg ? "Vegetarian" : "Non-Vegetarian"}
      className={`inline-flex h-4 w-4 items-center justify-center rounded-sm border ${
        veg ? "border-green-600" : "border-red-600"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${veg ? "bg-green-600" : "bg-red-600"}`} />
    </span>
  );
}
