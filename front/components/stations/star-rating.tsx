export function StarRating({ value }: { value: number }) {
  const rounded = Math.round(value);
  return (
    <span className="text-base" aria-label={`${value} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rounded ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </span>
  );
}
