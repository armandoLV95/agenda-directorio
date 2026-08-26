"use client";

export default function ConfirmarBoton({
  mensaje,
  className,
  children,
}: {
  mensaje: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(mensaje)) e.preventDefault();
      }}
      className={className}
    >
      {children}
    </button>
  );
}
