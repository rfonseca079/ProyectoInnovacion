import { ReactNode } from "react";
import { Link } from "react-router-dom";

export function isOpenableWizardStep(step: number, highestVisitedStep: number): boolean {
  return Number.isInteger(step) && step >= 0 && step <= 8 && step <= highestVisitedStep;
}

export const wizardStepLabels = [
  "Configuración",
  "Programa y calendario",
  "Unidades y evaluación",
  "Grupo",
  "Mediación",
  "Evidencias de aprendizaje",
  "Sesiones",
  "Formato MEP / PDF",
  "Ajuste post-clase",
];

export function WizardChrome({
  planId,
  step,
  highestVisitedStep,
  subjectLabel,
  gradeLevel,
  schoolName,
  teacherName,
  onLogout,
  onContinue,
  continueDisabled = false,
  continueMessage,
  children,
}: {
  planId: string;
  step: number;
  highestVisitedStep: number;
  subjectLabel: string;
  gradeLevel: number;
  schoolName: string;
  teacherName: string;
  onLogout: () => void;
  onContinue?: () => void;
  continueDisabled?: boolean;
  continueMessage?: string;
  children?: ReactNode;
}) {
  const backTo = step <= 0 ? "/planeamientos" : `/plans/${planId}/steps/${step - 1}`;

  return (
    <>
      <header className="topbar">
        <h1>Planificador AI</h1>
        <p className="plan-context">
          <span>{subjectLabel}</span>
          <span>{gradeLevel}.° año</span>
          <span>{schoolName}</span>
          <span>{teacherName}</span>
        </p>
        <div className="topbar-actions">
          <Link to="/planeamientos">Mis planeamientos</Link>
          <button type="button" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>
      <nav className="step-bar" aria-label="Pasos del planeamiento">
        <ol>
          {wizardStepLabels.map((label, index) => {
            const name = `${index} ${label}`;
            if (index <= highestVisitedStep) {
              return (
                <li key={name}>
                  <Link to={`/plans/${planId}/steps/${index}`}>{name}</Link>
                </li>
              );
            }
            return (
              <li key={name}>
                <span>{name}</span>
              </li>
            );
          })}
        </ol>
        {step >= 1 && step <= 8 ? <p>Paso {step} de 8</p> : null}
      </nav>
      {children}
      <footer className="wizard-footer">
        {continueMessage ? <p role="alert">{continueMessage}</p> : null}
        <Link to={backTo}>Atrás</Link>
        {step < 8 ? (
          <button type="button" onClick={onContinue} disabled={continueDisabled}>
            Continuar
          </button>
        ) : null}
      </footer>
    </>
  );
}
