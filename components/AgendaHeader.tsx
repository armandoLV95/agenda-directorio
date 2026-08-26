import Link from "next/link";
import { toYMD, sumarDias, nombreMes } from "@/lib/fechas";

const VISTAS = [
  { valor: "dia", label: "Día" },
  { valor: "semana", label: "Semana" },
  { valor: "mes", label: "Mes" },
] as const;

function pasoNavegacion(vista: string): number {
  if (vista === "dia") return 1;
  if (vista === "mes") return 30;
  return 7;
}

export default function AgendaHeader({
  vista,
  fecha,
  titulo,
}: {
  vista: string;
  fecha: Date;
  titulo: string;
}) {
  const paso = pasoNavegacion(vista);
  const anterior = toYMD(sumarDias(fecha, -paso));
  const siguiente = toYMD(sumarDias(fecha, paso));
  const hoy = toYMD(new Date());

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold text-teal-900 capitalize whitespace-nowrap">
          {titulo}
        </h1>
        <span className="text-slate-400 text-sm">· {nombreMes(fecha)} {fecha.getFullYear()}</span>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center rounded-md border border-slate-300 overflow-hidden text-sm">
          <Link href={`/agenda?vista=${vista}&fecha=${anterior}`} className="px-3 py-1.5 hover:bg-slate-100">
            ‹
          </Link>
          <Link
            href={`/agenda?vista=${vista}&fecha=${hoy}`}
            className="px-3 py-1.5 border-x border-slate-300 hover:bg-slate-100"
          >
            Hoy
          </Link>
          <Link href={`/agenda?vista=${vista}&fecha=${siguiente}`} className="px-3 py-1.5 hover:bg-slate-100">
            ›
          </Link>
        </div>

        <div className="flex items-center rounded-md border border-slate-300 overflow-hidden text-sm">
          {VISTAS.map((v) => (
            <Link
              key={v.valor}
              href={`/agenda?vista=${v.valor}&fecha=${toYMD(fecha)}`}
              className={`px-3 py-1.5 ${
                vista === v.valor ? "bg-teal-800 text-white" : "hover:bg-slate-100"
              }`}
            >
              {v.label}
            </Link>
          ))}
        </div>

        <Link
          href={`/agenda/nueva?fecha=${toYMD(fecha)}`}
          className="rounded-md bg-teal-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-900"
        >
          + Nueva cita
        </Link>
      </div>
    </div>
  );
}
