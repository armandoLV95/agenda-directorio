// Respalda la base de datos de produccion (Turso) a un archivo .sql con el
// esquema y todos los datos. Requiere TURSO_DATABASE_URL y TURSO_AUTH_TOKEN
// en el entorno (ver .env.backup, que no se sube al repositorio).
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

function cargarEnvBackup() {
  const ruta = new URL("../.env.backup", import.meta.url);
  if (!existsSync(ruta)) return;
  for (const linea of readFileSync(ruta, "utf8").split("\n")) {
    const m = linea.match(/^([A-Z_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2].trim().replace(/^"|"$/g, "");
  }
}
cargarEnvBackup();

const dbUrl = process.env.TURSO_DATABASE_URL?.replace("libsql://", "https://");
const token = process.env.TURSO_AUTH_TOKEN;
if (!dbUrl || !token) {
  console.error("Falta TURSO_DATABASE_URL o TURSO_AUTH_TOKEN (revisa .env.backup)");
  process.exit(1);
}

async function ejecutar(sql) {
  const res = await fetch(`${dbUrl}/v2/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ requests: [{ type: "execute", stmt: { sql } }, { type: "close" }] }),
  });
  const body = await res.json();
  const resultado = body.results[0];
  if (resultado.type === "error") throw new Error(resultado.error.message);
  return resultado.response.result;
}

function valorSql(valor) {
  if (valor === null) return "NULL";
  if (valor.type === "null") return "NULL";
  if (valor.type === "integer" || valor.type === "float") return String(valor.value);
  return `'${String(valor.value).replace(/'/g, "''")}'`;
}

const TABLAS = ["Usuario", "Contacto", "Cita"];
let sqlSalida = `-- Respaldo generado ${new Date().toISOString()}\n\n`;

const esquema = await ejecutar(
  `SELECT sql FROM sqlite_master WHERE type IN ('table','index') AND name NOT LIKE 'sqlite_%' AND sql IS NOT NULL;`
);
for (const fila of esquema.rows) {
  sqlSalida += `${fila[0].value};\n`;
}
sqlSalida += "\n";

for (const tabla of TABLAS) {
  const datos = await ejecutar(`SELECT * FROM "${tabla}";`);
  const columnas = datos.cols.map((c) => `"${c.name}"`).join(", ");
  for (const fila of datos.rows) {
    const valores = fila.map(valorSql).join(", ");
    sqlSalida += `INSERT INTO "${tabla}" (${columnas}) VALUES (${valores});\n`;
  }
  console.log(`${tabla}: ${datos.rows.length} filas`);
}

const carpetaBackups = fileURLToPath(new URL("../backups/", import.meta.url));
mkdirSync(carpetaBackups, { recursive: true });
const fecha = new Date().toISOString().slice(0, 10);
const destino = path.join(carpetaBackups, `backup-${fecha}.sql`);
writeFileSync(destino, sqlSalida, "utf8");
console.log("Guardado en", destino);
