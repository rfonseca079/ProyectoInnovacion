import { FormEvent, useRef, useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { TeacherProfile } from "../services/authService";

export type PlanDraft = {
  cycle: string;
  gradeLevel: string;
  subject: string;
  modality: string;
  schoolYear: string;
  month: string;
  schoolName: string;
  regionalDirectorate: string;
  teacherName: string;
  section: string;
  studentCount: string;
  weeklyLessons: string;
};

const emptySelects = {
  cycle: "",
  gradeLevel: "",
  subject: "",
  modality: "",
  schoolYear: "",
  month: "",
  section: "",
  studentCount: "",
  weeklyLessons: "",
};

const grades: Record<string, number[]> = {
  I_II: [1, 2, 3, 4, 5, 6],
  III: [7, 8, 9],
  DIVERSIFIED: [10, 11],
};

export function isPlanDraftValid(draft: PlanDraft): boolean {
  const grade = Number(draft.gradeLevel);
  const students = Number(draft.studentCount);
  const lessons = Number(draft.weeklyLessons);
  const month = Number(draft.month);
  const year = Number(draft.schoolYear);
  const gradeOk = grades[draft.cycle]?.includes(grade) ?? false;
  return (
    gradeOk &&
    draft.subject !== "" &&
    draft.modality !== "" &&
    Number.isInteger(year) &&
    year > 0 &&
    month >= 1 &&
    month <= 12 &&
    draft.schoolName.trim() !== "" &&
    draft.regionalDirectorate.trim() !== "" &&
    draft.teacherName.trim() !== "" &&
    draft.section.trim() !== "" &&
    Number.isInteger(students) &&
    students > 0 &&
    Number.isInteger(lessons) &&
    lessons > 0
  );
}

export function PlanConfigPage({
  teacher,
  onLogout,
  onCreate,
}: {
  teacher: TeacherProfile;
  onLogout: () => void;
  onCreate: (draft: PlanDraft) => Promise<void>;
}) {
  const [draft, setDraft] = useState<PlanDraft>({
    ...emptySelects,
    schoolName: teacher.schoolName,
    regionalDirectorate: teacher.regionalDirectorate,
    teacherName: teacher.fullName,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const valid = isPlanDraftValid(draft);
  const cycleMessage =
    draft.cycle !== "" && draft.gradeLevel !== "" && !(grades[draft.cycle]?.includes(Number(draft.gradeLevel)) ?? false)
      ? "Seleccione un nivel del ciclo elegido."
      : "";

  function setField(field: keyof PlanDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!valid || submittingRef.current) {
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    setError("");
    try {
      await onCreate(draft);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo crear el planeamiento.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  const chips = [
    draft.subject && { MATH: "Matemática", SPANISH: "Español", SCIENCE: "Ciencias", SOCIAL_STUDIES: "Estudios Sociales" }[draft.subject],
    draft.gradeLevel && `${draft.gradeLevel}.° año`,
    draft.month &&
      ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"][
        Number(draft.month)
      ],
    draft.section,
  ].filter((chip): chip is string => Boolean(chip));

  return (
    <>
      <AppHeader teacherName={teacher.fullName} onLogout={onLogout} />
      <main className="page">
        <h2>Nuevo planeamiento</h2>
        <p>Defina el contexto curricular. La IA usará estos datos para sugerir el resto.</p>
        <form onSubmit={handleSubmit} className="config-form">
          <div className="config-columns">
            <fieldset>
              <legend>Contexto curricular</legend>
              <label className="field">
                <span>Ciclo</span>
                <select aria-label="Ciclo" value={draft.cycle} onChange={(event) => setField("cycle", event.target.value)}>
                  <option value="">Seleccione</option>
                  <option value="I_II">I y II Ciclos</option>
                  <option value="III">III Ciclo</option>
                  <option value="DIVERSIFIED">Educación Diversificada</option>
                </select>
              </label>
              <label className="field">
                <span>Nivel</span>
                <select aria-label="Nivel" value={draft.gradeLevel} onChange={(event) => setField("gradeLevel", event.target.value)}>
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
                <select aria-label="Asignatura" value={draft.subject} onChange={(event) => setField("subject", event.target.value)}>
                  <option value="">Seleccione</option>
                  <option value="MATH">Matemática</option>
                  <option value="SPANISH">Español</option>
                  <option value="SCIENCE">Ciencias</option>
                  <option value="SOCIAL_STUDIES">Estudios Sociales</option>
                </select>
              </label>
              <label className="field">
                <span>Modalidad</span>
                <select aria-label="Modalidad" value={draft.modality} onChange={(event) => setField("modality", event.target.value)}>
                  <option value="">Seleccione</option>
                  <option value="IN_PERSON">Presencial</option>
                  <option value="VIRTUAL">Virtual</option>
                  <option value="HYBRID">Híbrida</option>
                </select>
              </label>
              <label className="field">
                <span>Curso lectivo</span>
                <input aria-label="Curso lectivo" value={draft.schoolYear} onChange={(event) => setField("schoolYear", event.target.value)} />
              </label>
              <label className="field">
                <span>Mes</span>
                <select aria-label="Mes" value={draft.month} onChange={(event) => setField("month", event.target.value)}>
                  <option value="">Seleccione</option>
                  {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"].map(
                    (name, index) => (
                      <option key={name} value={index + 1}>
                        {name}
                      </option>
                    ),
                  )}
                </select>
              </label>
            </fieldset>
            <fieldset>
              <legend>Datos del grupo</legend>
              <label className="field">
                <span>Centro educativo</span>
                <input aria-label="Centro educativo" value={draft.schoolName} onChange={(event) => setField("schoolName", event.target.value)} />
              </label>
              <label className="field">
                <span>Dirección regional</span>
                <input
                  aria-label="Dirección regional"
                  value={draft.regionalDirectorate}
                  onChange={(event) => setField("regionalDirectorate", event.target.value)}
                />
              </label>
              <label className="field">
                <span>Nombre docente</span>
                <input aria-label="Nombre docente" value={draft.teacherName} onChange={(event) => setField("teacherName", event.target.value)} />
              </label>
              <label className="field">
                <span>Sección o grupo</span>
                <input aria-label="Sección o grupo" value={draft.section} onChange={(event) => setField("section", event.target.value)} />
              </label>
              <label className="field">
                <span>Cantidad de estudiantes</span>
                <input
                  aria-label="Cantidad de estudiantes"
                  value={draft.studentCount}
                  onChange={(event) => setField("studentCount", event.target.value)}
                />
              </label>
              <label className="field">
                <span>Lecciones semanales</span>
                <input
                  aria-label="Lecciones semanales"
                  value={draft.weeklyLessons}
                  onChange={(event) => setField("weeklyLessons", event.target.value)}
                />
              </label>
            </fieldset>
          </div>
          <section className="config-summary">
            <h3>Resumen listo para iniciar</h3>
            <ul className="chips">
              {chips.map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>
          </section>
          {cycleMessage ? <p role="alert">{cycleMessage}</p> : null}
          {error ? <p role="alert">{error}</p> : null}
          <button className="primary" type="submit" disabled={!valid || submitting}>
            Iniciar planeamiento con IA
          </button>
        </form>
      </main>
    </>
  );
}
