import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { AutosaveField } from "../components/AutosaveField";
import { planAccessMessage } from "../services/authService";
import { planRowText, PlanSummary } from "../services/planLabels";
import { getPlan, patchPlan } from "../services/planService";

export function PlanListPage({
  teacherName,
  onLogout,
  plans,
}: {
  teacherName: string;
  onLogout: () => void;
  plans: PlanSummary[];
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
        {plans.length === 0 ? <p>Aún no tiene planeamientos.</p> : null}
        <ul className="plan-list">
          {plans.map((plan) => (
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
  const { planId = "" } = useParams();
  const [section, setSection] = useState("");
  const [deniedMessage, setDeniedMessage] = useState("");
  const [blocks, setBlocks] = useState<string[]>([]);
  const [heading, setHeading] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    getPlan(planId)
      .then((plan) => {
        const subject =
          { MATH: "Matemática", SPANISH: "Español", SCIENCE: "Ciencias", SOCIAL_STUDIES: "Estudios Sociales" }[plan.subject] ??
          plan.subject;
        setSection(plan.section ?? "");
        setHeading(`${subject} · ${plan.gradeLevel}.° año · ${plan.schoolName} · ${plan.teacherName}`);
        setBlocks(plan.blocks.map((block) => block.body));
        if (plan.usedFallback) {
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

  return (
    <>
      <AppHeader teacherName={teacherName} onLogout={onLogout} />
      <main className="page">
        <p>{heading}</p>
        {section ? (
          <AutosaveField
            key={section}
            initialValue={section}
            onSave={async (value) => {
              await patchPlan(planId, { section: value });
            }}
          />
        ) : null}
        {notice ? <p>{notice}</p> : null}
        {blocks.map((body) => (
          <p key={body}>{body}</p>
        ))}
      </main>
    </>
  );
}

export function NewPlanPage({ teacherName, onLogout }: { teacherName: string; onLogout: () => void }) {
  return (
    <>
      <AppHeader teacherName={teacherName} onLogout={onLogout} />
      <main className="page">
        <h2>Nuevo planeamiento</h2>
      </main>
    </>
  );
}
