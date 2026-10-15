import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { PlanConfigPage } from "./pages/PlanConfigPage";
import { PlanAccessPage, PlanListPage, StepPage } from "./pages/PlanListPage";
import { currentTeacher, logout, TeacherProfile } from "./services/authService";
import { PlanSummary } from "./services/planLabels";
import { createPlan, listPlans } from "./services/planService";

export function App() {
  const [teacher, setTeacher] = useState<TeacherProfile | null | undefined>(undefined);
  const [plans, setPlans] = useState<PlanSummary[] | null>(null);
  const [plansError, setPlansError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    currentTeacher()
      .then(setTeacher)
      .catch(() => setTeacher(null));
  }, []);

  useEffect(() => {
    if (!teacher) {
      return;
    }
    let active = true;
    setPlans(null);
    setPlansError("");
    listPlans()
      .then((rows) => {
        if (active) {
          setPlans(rows);
        }
      })
      .catch(() => {
        if (active) {
          setPlansError("No se pudieron cargar los planeamientos.");
        }
      });
    return () => {
      active = false;
    };
  }, [teacher]);

  async function handleLogout() {
    await logout();
    setPlans(null);
    setPlansError("");
    setTeacher(null);
    navigate("/login", { replace: true });
  }

  if (teacher === undefined) {
    return <div className="desktop-frame" />;
  }

  return (
    <div className="desktop-frame">
      <Routes>
        <Route path="/" element={<LoginRoute teacher={teacher} onSignedIn={setTeacher} />} />
        <Route path="/login" element={<LoginRoute teacher={teacher} onSignedIn={setTeacher} />} />
        <Route
          path="/planeamientos"
          element={
            teacher ? (
              <PlanListPage teacherName={teacher.fullName} onLogout={handleLogout} plans={plans} loadError={plansError} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/plans/new"
          element={
            teacher ? (
              <PlanConfigPage
                teacher={teacher}
                onLogout={handleLogout}
                onCreate={async (draft) => {
                  const plan = await createPlan(draft);
                  navigate(`/plans/${plan.id}/steps/1`);
                }}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/plans/:planId/steps/:step"
          element={
            teacher ? (
              <StepPage teacherName={teacher.fullName} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/planeamientos/:planId"
          element={
            teacher ? (
              <GuardedPlan teacherName={teacher.fullName} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

function LoginRoute({
  teacher,
  onSignedIn,
}: {
  teacher: TeacherProfile | null;
  onSignedIn: (teacher: TeacherProfile) => void;
}) {
  const navigate = useNavigate();
  if (teacher) {
    return <Navigate to="/planeamientos" replace />;
  }
  return (
    <LoginPage
      onSuccess={() => {
        currentTeacher().then((profile) => {
          if (profile) {
            onSignedIn(profile);
            navigate("/planeamientos");
          }
        });
      }}
    />
  );
}

function GuardedPlan({ teacherName, onLogout }: { teacherName: string; onLogout: () => void }) {
  const { planId = "" } = useParams();
  return <PlanAccessPage planId={planId} teacherName={teacherName} onLogout={onLogout} />;
}
