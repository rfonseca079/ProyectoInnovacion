import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { AutosaveField, SaveFooter } from "../components/AutosaveField";
import { WizardChrome, isOpenableWizardStep } from "../components/WizardChrome";
import { planAccessMessage } from "../services/authService";
import { planRowText, PlanSummary, subjectLabel } from "../services/planLabels";
import { continuePlan, getPlan, patchPlan, PlanDetail } from "../services/planService";

export function PlanListPage({
  teacherName,
  onLogout,
  plans,
  loadError = "",
}: {
  teacherName: string;
  onLogout: () => void;
  plans: PlanSummary[] | null;
  loadError?: string;
}) {
  return (
    <>
      <AppHeader teacherName={teacherName} onLogout={onLogout} />
      <main className="page">
        <div className="list-heading">
          <h2>Mis planeamientos</h2>
          <Link className="primary link-button" to="/plans/new">
            Nuevo planeamiento
          </Link>
        </div>
        {loadError ? <p role="alert">{loadError}</p> : null}
        {!loadError && plans && plans.length === 0 ? <p>Aún no tiene planeamientos.</p> : null}
        <ul className="plan-list">
          {(plans ?? []).map((plan) => (
            <li key={plan.id}>
              <Link to={`/plans/${plan.id}/steps/${plan.currentStep}`}>{planRowText(plan)}</Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

export function PlanAccessPage({
  planId,
  teacherName,
  onLogout,
}: {
  planId: string;
  teacherName: string;
  onLogout: () => void;
}) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    planAccessMessage(planId).then((value) => {
      if (value) {
        setMessage(value);
      }
    });
  }, [planId]);

  return (
    <>
      <AppHeader teacherName={teacherName} onLogout={onLogout} />
      <main className="page">
        <p role="alert">{message}</p>
      </main>
    </>
  );
}

export function StepPage({ teacherName, onLogout }: { teacherName: string; onLogout: () => void }) {
  const { planId = "", step: stepText = "0" } = useParams();
  const step = Number(stepText);
  const navigate = useNavigate();
  const [plan, setPlan] = useState<PlanDetail | null>(null);
  const [deniedMessage, setDeniedMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");
  const [continueMessage, setContinueMessage] = useState("");

  useEffect(() => {
    getPlan(planId)
      .then((loaded) => {
        setPlan(loaded);
        if (loaded.usedFallback) {
          setNotice(
            "No hay un escenario específico para esta combinación. Las sugerencias corresponden a Matemática, 4.° año, marzo 2026.",
          );
        }
      })
      .catch((error: unknown) => {
        setDeniedMessage(error instanceof Error ? error.message : "No tiene acceso a este planeamiento.");
      });
  }, [planId]);

  if (deniedMessage) {
    return (
      <>
        <AppHeader teacherName={teacherName} onLogout={onLogout} />
        <main className="page">
          <p role="alert">{deniedMessage}</p>
        </main>
      </>
    );
  }

  if (!plan) {
    return null;
  }

  if (!isOpenableWizardStep(step, plan.highestVisitedStep)) {
    return <Navigate to={`/plans/${planId}/steps/${plan.highestVisitedStep}`} replace />;
  }

  return (
    <WizardChrome
      planId={planId}
      step={step}
      highestVisitedStep={plan.highestVisitedStep}
      subjectLabel={subjectLabel(plan.subject)}
      gradeLevel={plan.gradeLevel}
      schoolName={plan.schoolName}
      teacherName={plan.teacherName || teacherName}
      onLogout={onLogout}
      continueMessage={continueMessage}
      onContinue={() => {
        setContinueMessage("");
        continuePlan(planId, step)
          .then((saved) => {
            setPlan(saved);
            navigate(`/plans/${planId}/steps/${saved.currentStep}`);
          })
          .catch((error: unknown) => {
            setContinueMessage(error instanceof Error ? error.message : "No se pudo continuar.");
          });
      }}
    >
      <main className="page">
        {plan.section ? (
          <AutosaveField
            key={plan.section}
            initialValue={plan.section}
            onStatus={setSaveState}
            onSave={async (value) => {
              await patchPlan(planId, { section: value });
            }}
          />
        ) : null}
        {notice ? <p>{notice}</p> : null}
        {plan.blocks.map((block) => (
          <p key={block.blockKey}>{block.body}</p>
        ))}
      </main>
      <SaveFooter state={saveState} />
    </WizardChrome>
  );
}

