// Constantes compartidas de la cuadrícula por horas de la vista de día. El rango
// (7:00–21:00) es un valor por defecto razonable para un consultorio; ajustar aquí
// si el negocio maneja otro horario.
export const HORA_INICIO_GRID = 7;
export const HORA_FIN_GRID = 21;
export const PX_POR_HORA = 64;
export const PX_POR_MINUTO = PX_POR_HORA / 60;
export const MINUTO_INICIO_GRID = HORA_INICIO_GRID * 60;
export const ALTURA_GRID = (HORA_FIN_GRID - HORA_INICIO_GRID) * PX_POR_HORA;
