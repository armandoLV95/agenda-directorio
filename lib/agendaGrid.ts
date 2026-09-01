// Constantes compartidas de la cuadrícula por horas de la vista de día. El rango
// (8:00–19:00) es el horario de atención del negocio; ajustar aquí si cambia.
export const HORA_INICIO_GRID = 8;
export const HORA_FIN_GRID = 19;
export const PX_POR_HORA = 64;
export const PX_POR_MINUTO = PX_POR_HORA / 60;
export const MINUTO_INICIO_GRID = HORA_INICIO_GRID * 60;
export const ALTURA_GRID = (HORA_FIN_GRID - HORA_INICIO_GRID) * PX_POR_HORA;
