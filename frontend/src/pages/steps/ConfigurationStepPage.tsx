import { useRef, useState } from "react";
import { PlanDraft } from "../PlanConfigPage";

const grades: Record<string, number[]> = {
  I_II: [1, 2, 3, 4, 5, 6],
  III: [7, 8, 9],
  DIVERSIFIED: [10, 11],
};

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"];

const subjects: Record<string, string> = {
  MATH: "Matemática",
  SPANISH: "Español",
  SCIENCE: "Ciencias",
  SOCIAL_STUDIES: "Estudios Sociales",
};

export type SavedConfiguration = {
  cycle?: string;
  gradeLevel: number;
  subject: string;
  modality?: string;
  schoolYear: number;
  month: number;
  schoolName: string;
  regionalDirectorate?: string;
  teacherName: string;
  section?: string;
  studentCount?: number;
  weeklyLessons?: number;
};

const numericFields = new Set<keyof PlanDraft>(["gradeLevel", "schoolYear", "month", "studentCount", "weeklyLessons"]);

function toDraft(plan: SavedConfiguration): PlanDraft {
  return {
    cycle: plan.cycle ?? "",
    gradeLevel: String(plan.gradeLevel),
    subject: plan.subject,
    modality: plan.modality ?? "",
    schoolYear: String(plan.schoolYear),
    month: String(plan.month),
    schoolName: plan.schoolName,
    regionalDirectorate: plan.regionalDirectorate ?? "",
    teacherName: plan.teacherName,
    section: plan.section ?? "",
    studentCount: plan.studentCount === undefined ? "" : String(plan.studentCount),
    weeklyLessons: plan.weeklyLessons === undefined ? "" : String(plan.weeklyLessons),
  };
}

export function ConfigurationStepPage({
  plan,
  notice = "",
  onSave,
}: {
  plan: SavedConfiguration;
  notice?: string;
  onSave: (patch: Record<string, string | number>) => Promise<void>;
}) {
  const [draft, setDraft] = useState(() => toDraft(plan));
  const draftRef = useRef(draft);

  function setField(field: keyof PlanDraft, value: string) {
    const next = { ...draftRef.current, [field]: value };
    draftRef.current = next;
    setDraft(next);
  }

  function commit(field: keyof PlanDraft) {
    const value = draftRef.current[field];
    void onSave({ [field]: numericFields.has(field) ? Number(value) : value });
  }

  const chips = [
    subjects[draft.subject],
    draft.gradeLevel && `${draft.gradeLevel}.° año`,
    months[Number(draft.month) - 1],
    draft.section,
  ].filter((chip): chip is string => Boolean(chip));

  return (
    <main className="page">
      <h2>Configuración del planeamiento</h2>
      <p>Estos son los datos con los que se armó el planeamiento.</p>
      {notice ? <p>{notice}</p> : null}
      <form className="config-form" onSubmit={(event) => event.preventDefault()}>
        <div className="config-columns">
          <fieldset>
            <legend>Contexto curricular</legend>
            <label className="field">
              <span>Ciclo</span>
              <select aria-label="Ciclo" value={draft.cycle} onChange={(event) => setField("cycle", event.target.value)} onBlur={() => commit("cycle")}>
                <option value="">Seleccione</option>
                <option value="I_II">I y II Ciclos</option>
                <option value="III">III Ciclo</option>
                <option value="DIVERSIFIED">Educación Diversificada</option>
              </select>
            </label>
            <label className="field">
              <span>Nivel</span>
              <select
                aria-label="Nivel"
                value={draft.gradeLevel}
                onChange={(event) => setField("gradeLevel", event.target.value)}
                onBlur={() => commit("gradeLevel")}
              >
                <option value="">Seleccione</option>
                {(grades[draft.cycle] ?? []).map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}.° año
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Asignatura</span>
              <select
                aria-label="Asignatura"
                value={draft.subject}
                onChange={(event) => setField("subject", event.target.value)}
                onBlur={() => commit("subject")}
              >
                <option value="">Seleccione</option>
                <option value="MATH">Matemática</option>
                <option value="SPANISH">Español</option>
                <option value="SCIENCE">Ciencias</option>
                <option value="SOCIAL_STUDIES">Estudios Sociales</option>
              </select>
            </label>
            <label className="field">
              <span>Modalidad</span>
              <select
                aria-label="Modalidad"
                value={draft.modality}
                onChange={(event) => setField("modality", event.target.value)}
                onBlur={() => commit("modality")}
              >
                <option value="">Seleccione</option>
                <option value="IN_PERSON">Presencial</option>
                <option value="VIRTUAL">Virtual</option>
                <option value="HYBRID">Híbrida</option>
              </select>
            </label>
            <label className="field">
              <span>Curso lectivo</span>
              <input
                aria-label="Curso lectivo"
                value={draft.schoolYear}
                onChange={(event) => setField("schoolYear", event.target.value)}
                onBlur={() => commit("schoolYear")}
              />
            </label>
            <label className="field">
              <span>Mes</span>
              <select aria-label="Mes" value={draft.month} onChange={(event) => setField("month", event.target.value)} onBlur={() => commit("month")}>
                <option value="">Seleccione</option>
                {months.map((name, index) => (
                  <option key={name} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          </fieldset>
          <fieldset>
            <legend>Datos del grupo</legend>
            <label className="field">
              <span>Centro educativo</span>
              <input
                aria-label="Centro educativo"
                value={draft.schoolName}
                onChange={(event) => setField("schoolName", event.target.value)}
                onBlur={() => commit("schoolName")}
              />
            </label>
            <label className="field">
              <span>Dirección regional</span>
              <input
                aria-label="Dirección regional"
                value={draft.regionalDirectorate}
                onChange={(event) => setField("regionalDirectorate", event.target.value)}
                onBlur={() => commit("regionalDirectorate")}
              />
            </label>
            <label className="field">
              <span>Nombre docente</span>
              <input
                aria-label="Nombre docente"
                value={draft.teacherName}
                onChange={(event) => setField("teacherName", event.target.value)}
                onBlur={() => commit("teacherName")}
              />
            </label>
            <label className="field">
              <span>Sección o grupo</span>
              <input
                aria-label="Sección o grupo"
                value={draft.section}
                onChange={(event) => setField("section", event.target.value)}
                onBlur={() => commit("section")}
              />
            </label>
            <label className="field">
              <span>Cantidad de estudiantes</span>
              <input
                aria-label="Cantidad de estudiantes"
                value={draft.studentCount}
                onChange={(event) => setField("studentCount", event.target.value)}
                onBlur={() => commit("studentCount")}
              />
            </label>
            <label className="field">
              <span>Lecciones semanales</span>
              <input
                aria-label="Lecciones semanales"
                value={draft.weeklyLessons}
                onChange={(event) => setField("weeklyLessons", event.target.value)}
                onBlur={() => commit("weeklyLessons")}
              />
            </label>
          </fieldset>
        </div>
        <section className="config-summary">
          <h3>Resumen del planeamiento</h3>
          <ul className="chips">
            {chips.map((chip) => (
              <li key={chip}>{chip}</li>
            ))}
          </ul>
        </section>
      </form>
    </main>
  );
}
