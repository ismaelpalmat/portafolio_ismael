export default function PlaceholderArt({
  etiqueta,
  titulo,
  className
}: {
  etiqueta: string;
  titulo: string;
  className?: string;
}) {
  let h = 0;
  for (let i = 0; i < etiqueta.length; i++) {
    h = (h * 31 + etiqueta.charCodeAt(i)) % 360;
  }
  return (
    <div
      role="img"
      aria-label={titulo}
      className={className ? `placeholder ${className}` : "placeholder"}
      style={{
        background: `linear-gradient(135deg, hsl(${h} 40% 84%), hsl(${(h + 40) % 360} 45% 66%))`
      }}
    >
      <span className="placeholder-etiqueta">{etiqueta}</span>
    </div>
  );
}
