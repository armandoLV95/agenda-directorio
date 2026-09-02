import Link from "next/link";
import { requireSession } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import AgendaHeader from "@/components/AgendaHeader";
import AgendaGridDia from "@/components/AgendaGridDia";
import AgendaGridSemana from "@/components/AgendaGridSemana";
import {
  fromYMD,
  toYMD,
  sumarDias,
  inicioSemana,
  inicioCuadriculaMes,
  esMismoDia,
  esMismoMes,
  formatoFechaLarga,
  conMayusculaInicial,
  diaDelMes,
} from "@/lib/fechas";

type Vista = "dia" | "semana" | "mes";

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ vista?: string; fecha?: string }>;
}) {
  await requireSession();
  const params = await searchParams;
  const vista: Vista =
    params.vista === "dia" ? "dia" : params.vista === "mes" ? "mes" : "semana";
  const fecha = params.fecha ? fromYMD(params.fecha) : new Date();

  if (vista === "dia") return <VistaDia fecha={fecha} />;
  if (vista === "mes") return <VistaMes fecha={fecha} />;
  return <VistaSemana fecha={fecha} />;
}

async function VistaDia({ fecha }: { fecha: Date }) {
  const inicio = fromYMD(toYMD(fecha));
  const fin = sumarDias(inicio, 1);
  const citas = await prisma.cita.findMany({
    where: { fechaInicio: { gte: inicio, lt: fin } },
    include: { contacto: true },
    orderBy: { fechaInicio: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8 space-y-6">
      <AgendaHeader vista="dia" fecha={fecha} titulo={conMayusculaInicial(formatoFechaLarga(fecha))} />
      <AgendaGridDia fecha={fecha} citas={citas} />
    </div>
  );
}

async function VistaSemana({ fecha }: { fecha: Date }) {
  const inicio = inicioSemana(fecha);
  const fin = sumarDias(inicio, 7);
  const citas = await prisma.cita.findMany({
    where: { fechaInicio: { gte: inicio, lt: fin } },
    include: { contacto: true },
    orderBy: { fechaInicio: "asc" },
  });

  const dias = Array.from({ length: 7 }, (_, i) => sumarDias(inicio, i));

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-8 space-y-6">
      <AgendaHeader
        vista="semana"
        fecha={fecha}
        titulo={`${diaDelMes(dias[0])} – ${diaDelMes(dias[6])}`}
      />
      <AgendaGridSemana dias={dias} citas={citas} />
    </div>
  );
}

async function VistaMes({ fecha }: { fecha: Date }) {
  const inicioGrid = inicioCuadriculaMes(fecha);
  const finGrid = sumarDias(inicioGrid, 42);
  const citas = await prisma.cita.findMany({
    where: { fechaInicio: { gte: inicioGrid, lt: finGrid } },
    include: { contacto: true },
    orderBy: { fechaInicio: "asc" },
  });

  const dias = Array.from({ length: 42 }, (_, i) => sumarDias(inicioGrid, i));
  const hoy = new Date();

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-8 space-y-6">
      <AgendaHeader vista="mes" fecha={fecha} titulo="Mes" />
      <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-md overflow-hidden border border-slate-200">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
          <div key={d} className="bg-slate-100 text-center text-xs font-medium text-slate-500 py-1.5">
            {d}
          </div>
        ))}
        {dias.map((dia) => {
          const citasDia = citas.filter((c) => esMismoDia(c.fechaInicio, dia));
          const enMes = esMismoMes(dia, fecha);
          const esHoy = esMismoDia(dia, hoy);
          return (
            <Link
              key={toYMD(dia)}
              href={`/agenda?vista=dia&fecha=${toYMD(dia)}`}
              className={`bg-white min-h-[6rem] p-1.5 space-y-1 hover:bg-teal-50/50 ${
                enMes ? "" : "bg-slate-50 text-slate-400"
              }`}
            >
              <span
                className={`text-xs inline-flex items-center justify-center w-5 h-5 rounded-full ${
                  esHoy ? "bg-teal-800 text-white" : ""
                }`}
              >
                {diaDelMes(dia)}
              </span>
              <div className="space-y-0.5">
                {citasDia.slice(0, 3).map((cita) => (
                  <p key={cita.id} className="text-[10px] truncate rounded bg-teal-100 text-teal-800 px-1">
                    {cita.titulo}
                  </p>
                ))}
                {citasDia.length > 3 && (
                  <p className="text-[10px] text-slate-400">+{citasDia.length - 3} más</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
