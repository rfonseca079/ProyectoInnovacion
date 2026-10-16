import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { AutosaveField, SaveFooter } from "../components/AutosaveField";
import { WizardChrome, isOpenableWizardStep } from "../components/WizardChrome";
import { planAccessMessage } from "../services/authService";
import { planRowText, PlanSummary, subjectLabel } from "../services/planLabels";
import { continuePlan, downloadWeekPdf, getMepDocument, getPlan, patchMepDocument, patchPlan, PlanDetail, saveClassSession } from "../services/planService";
import { acceptSuggestion, balanceAssessmentLoad, duplicateStructure, fitFortyMinutes, generateImplications, generateWeekSessions, reanalyzeProgram, redistributeEvaluation, regenerateMediation, regenerateSuggestion, simplifyMaterials } from "../services/suggestionService";
import { EvidenceStepPage, isEvidenceStepReady, NO_STORED_LOAD } from "./steps/EvidenceStepPage";
import { GroupStepPage, isGroupStepReady } from "./steps/GroupStepPage";
import { isMediationStepReady, MediationStepPage } from "./steps/MediationStepPage";
import { isProgramStepReady, ProgramStepPage } from "./steps/ProgramStepPage";
import { emptyDocumentField, MepDocumentView, MepStepPage } from "./steps/MepStepPage";
import { isSessionsStepReady, SessionsStepPage } from "./steps/SessionsStepPage";
import { isUnitsStepReady, UnitsStepPage } from "./steps/UnitsStepPage";

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
  const [actionMessage, setActionMessage] = useState("");
  const [unitsReady, setUnitsReady] = useState<boolean | null>(null);
  const [groupReady, setGroupReady] = useState<boolean | null>(null);
  const [mediationReady, setMediationReady] = useState<boolean | null>(null);
  const [evidenceReady, setEvidenceReady] = useState<boolean | null>(null);
  const [sessionsReady, setSessionsReady] = useState<boolean | null>(null);
  const [mepDocument, setMepDocument] = useState<MepDocumentView | null>(null);
  const pendingSave = useRef(Promise.resolve());
  const reportUnitsReady = useCallback((ready: boolean) => {
    setUnitsReady(ready);
  }, []);
  const reportGroupReady = useCallback((ready: boolean) => {
    setGroupReady(ready);
  }, []);
  const reportMediationReady = useCallback((ready: boolean) => {
    setMediationReady(ready);
  }, []);
  const reportEvidenceReady = useCallback((ready: boolean) => {
    setEvidenceReady(ready);
  }, []);
  const reportSessionsReady = useCallback((ready: boolean) => {
    setSessionsReady(ready);
  }, []);

  function trackSave(work: Promise<void>): Promise<void> {
    const next = pendingSave.current.then(() => work, () => work);
    pendingSave.current = next;
    return next;
  }

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

  useEffect(() => {
    if (step !== 7) {
      return;
    }
    getMepDocument(planId)
      .then(setMepDocument)
      .catch(() => {
        setMepDocument(null);
      });
  }, [planId, step]);

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

  async function saveBlock(blockKey: string, body: string) {
    await patchPlan(planId, { blocks: [{ blockKey, body }] });
    setPlan((current) =>
      current
        ? {
            ...current,
            blocks: current.blocks.map((block) =>
              block.blockKey === blockKey ? { ...block, body, status: "EDITED" } : block,
            ),
          }
        : current,
    );
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
      continueDisabled={
        (step === 1 && !isProgramStepReady(plan.blocks)) ||
        (step === 2 && !(unitsReady ?? isUnitsStepReady(plan.weeks ?? [], plan.rubric ?? []))) ||
        (step === 3 && !(groupReady ?? isGroupStepReady(plan.blocks))) ||
        (step === 4 && !(mediationReady ?? isMediationStepReady(plan.blocks))) ||
        (step === 5 && !(evidenceReady ?? isEvidenceStepReady(plan.evidence ?? []))) ||
        (step === 7 && (mepDocument === null || emptyDocumentField(mepDocument) !== null)) ||
        (step === 6 && !(sessionsReady ?? isSessionsStepReady(
          (plan.weeks ?? []).map((week) => ({
            position: week.position,
            title: week.title,
            active: week.active ?? false,
            sessions: week.sessions ?? [],
          })),
        )))
      }
      continueMessage={continueMessage}
      onContinue={() => {
        setContinueMessage("");
        void pendingSave.current.then(() =>
          continuePlan(planId, step)
            .then((saved) => {
              setPlan(saved);
              navigate(`/plans/${planId}/steps/${saved.currentStep}`);
            })
            .catch((error: unknown) => {
              setContinueMessage(error instanceof Error ? error.message : "No se pudo continuar.");
            }),
        );
      }}
    >
      {step === 3 ? (
        <GroupStepPage
          blocks={plan.blocks}
          onSaveField={(blockKey, body) =>
            trackSave(
              patchPlan(planId, { blocks: [{ blockKey, body }] })
                .then(() => {
                  setPlan((current) =>
                    current
                      ? {
                          ...current,
                          blocks: current.blocks.map((block) =>
                            block.blockKey === blockKey ? { ...block, body, status: "EDITED" } : block,
                          ),
                        }
                      : current,
                  );
                  setSaveState("saved");
                })
                .catch(() => {
                  setSaveState("error");
                }),
            )
          }
          onReadyChange={reportGroupReady}
          actionMessage={actionMessage}
          onGenerate={() =>
            generateImplications(planId)
              .then((saved) => {
                setPlan(saved);
                setActionMessage("");
              })
              .catch((error: unknown) => {
                setActionMessage(error instanceof Error ? error.message : "No se pudieron generar las implicaciones.");
              })
          }
          onAccept={(blockKey) => {
            void acceptSuggestion(planId, blockKey).then((saved) => {
              setPlan((current) =>
                current
                  ? { ...current, blocks: current.blocks.map((block) => (block.blockKey === saved.blockKey ? saved : block)) }
                  : current,
              );
            });
          }}
          onEdit={(blockKey, body) => {
            void saveBlock(blockKey, body);
          }}
          onRegenerate={(blockKey) => {
            void regenerateSuggestion(planId, blockKey).then((saved) => {
              setPlan((current) =>
                current
                  ? { ...current, blocks: current.blocks.map((block) => (block.blockKey === saved.blockKey ? saved : block)) }
                  : current,
              );
            });
          }}
          notice={notice}
        />
      ) : step === 2 ? (
        <UnitsStepPage
          weeks={plan.weeks ?? []}
          rubric={plan.rubric ?? []}
          justification={plan.blocks.find((block) => block.blockKey === "evaluation-justification")?.body ?? ""}
          onSaveWeeks={(weeks) =>
            trackSave(
              patchPlan(planId, { weeks })
                .then(() => {
                  setPlan((current) => (current ? { ...current, weeks } : current));
                  setSaveState("saved");
                })
                .catch(() => {
                  setSaveState("error");
                }),
            )
          }
          onSaveRubric={(rubric) =>
            trackSave(
              patchPlan(planId, { rubric })
                .then(() => {
                  setPlan((current) => (current ? { ...current, rubric } : current));
                  setSaveState("saved");
                })
                .catch(() => {
                  setSaveState("error");
                }),
            )
          }
          onReadyChange={reportUnitsReady}
          onRedistribute={() => {
            void redistributeEvaluation(planId)
              .then((saved) => {
                setPlan(saved);
                setActionMessage("");
              })
              .catch((error: unknown) => {
                setActionMessage(error instanceof Error ? error.message : "No se pudo redistribuir.");
              });
          }}
          onAccept={() => {
            void acceptSuggestion(planId, "evaluation-justification").then((saved) => {
              setPlan((current) =>
                current
                  ? { ...current, blocks: current.blocks.map((block) => (block.blockKey === saved.blockKey ? saved : block)) }
                  : current,
              );
            });
          }}
          onEdit={(body) => {
            void saveBlock("evaluation-justification", body);
          }}
          onRegenerate={() => {
            void regenerateSuggestion(planId, "evaluation-justification").then((saved) => {
              setPlan((current) =>
                current
                  ? { ...current, blocks: current.blocks.map((block) => (block.blockKey === saved.blockKey ? saved : block)) }
                  : current,
              );
            });
          }}
          actionMessage={actionMessage}
          notice={notice}
        />
      ) : step === 1 ? (
        <ProgramStepPage
          schoolYear={plan.schoolYear}
          month={plan.month}
          blocks={plan.blocks}
          calendarDays={plan.calendarDays ?? []}
          onStatus={setSaveState}
          onSaveBlock={saveBlock}
          onReanalyze={() => {
            void reanalyzeProgram(planId).then(setPlan);
          }}
          onAccept={(blockKey) => {
            void acceptSuggestion(planId, blockKey).then((saved) => {
              setPlan((current) =>
                current
                  ? { ...current, blocks: current.blocks.map((block) => (block.blockKey === saved.blockKey ? saved : block)) }
                  : current,
              );
            });
          }}
          onRegenerate={(blockKey) => {
            void regenerateSuggestion(planId, blockKey).then((saved) => {
              setPlan((current) =>
                current
                  ? { ...current, blocks: current.blocks.map((block) => (block.blockKey === saved.blockKey ? saved : block)) }
                  : current,
              );
            });
          }}
          notice={notice}
        />
      ) : step === 4 ? (
        <MediationStepPage
          blocks={plan.blocks}
          weeks={plan.weeks ?? []}
          onSaveInClass={(body) =>
            trackSave(
              patchPlan(planId, { blocks: [{ blockKey: "mediation-in-class", body }] })
                .then(() => {
                  setPlan((current) =>
                    current
                      ? {
                          ...current,
                          blocks: current.blocks.map((block) =>
                            block.blockKey === "mediation-in-class" ? { ...block, body, status: "EDITED" } : block,
                          ),
                        }
                      : current,
                  );
                  setSaveState("saved");
                })
                .catch(() => {
                  setSaveState("error");
                }),
            )
          }
          onSaveOutside={(body) =>
            trackSave(
              patchPlan(planId, { blocks: [{ blockKey: "mediation-outside", body }] })
                .then(() => {
                  setPlan((current) =>
                    current
                      ? {
                          ...current,
                          blocks: current.blocks.map((block) =>
                            block.blockKey === "mediation-outside" ? { ...block, body, status: "EDITED" } : block,
                          ),
                        }
                      : current,
                  );
                  setSaveState("saved");
                })
                .catch(() => {
                  setSaveState("error");
                }),
            )
          }
          onReadyChange={reportMediationReady}
          onRegenerate={() =>
            pendingSave.current
              .then(() => regenerateMediation(planId))
              .then((saved) => {
                setPlan(saved);
                setActionMessage("");
              })
              .catch((error: unknown) => {
                setActionMessage(error instanceof Error ? error.message : "No se pudo regenerar la mediación.");
              })
          }
          onFit40={() =>
            pendingSave.current
              .then(() => fitFortyMinutes(planId))
              .then((saved) => {
                setPlan(saved);
                setActionMessage("");
              })
              .catch((error: unknown) => {
                setActionMessage(error instanceof Error ? error.message : "No se pudo ajustar el tiempo.");
              })
          }
          onSimplify={() =>
            pendingSave.current
              .then(() => simplifyMaterials(planId))
              .then((saved) => {
                setPlan(saved);
                setActionMessage("");
              })
              .catch((error: unknown) => {
                setActionMessage(error instanceof Error ? error.message : "No se pudieron simplificar los materiales.");
              })
          }
          actionMessage={actionMessage}
          notice={notice}
        />
      ) : step === 5 ? (
        <EvidenceStepPage
          evidence={plan.evidence ?? []}
          calendarDays={plan.calendarDays ?? []}
          onSave={(blockKey, body) =>
            trackSave(
              patchPlan(planId, { blocks: [{ blockKey, body }] })
                .then(() => {
                  const card = JSON.parse(body) as {
                    title: string;
                    measures: string;
                    when: string;
                    instrument: string;
                    expectedLearning: string;
                    occursOn: string | null;
                  };
                  setPlan((current) =>
                    current
                      ? {
                          ...current,
                          blocks: current.blocks.map((block) =>
                            block.blockKey === blockKey ? { ...block, body, status: "EDITED" } : block,
                          ),
                          evidence: (current.evidence ?? []).map((item) =>
                            item.blockKey === blockKey ? { ...item, ...card } : item,
                          ),
                        }
                      : current,
                  );
                  setSaveState("saved");
                })
                .catch(() => {
                  setSaveState("error");
                }),
            )
          }
          onReadyChange={reportEvidenceReady}
          onBalance={() =>
            pendingSave.current
              .then(() => balanceAssessmentLoad(planId))
              .then((saved) => {
                setPlan(saved);
                setActionMessage("");
              })
              .catch((error: unknown) => {
                setActionMessage(error instanceof Error ? error.message : NO_STORED_LOAD);
              })
          }
          onAccept={(blockKey) => {
            void acceptSuggestion(planId, blockKey).then((saved) => {
              setPlan((current) =>
                current
                  ? { ...current, blocks: current.blocks.map((block) => (block.blockKey === saved.blockKey ? saved : block)) }
                  : current,
              );
            });
          }}
          onRegenerate={(blockKey) => {
            void pendingSave.current
              .then(() => regenerateSuggestion(planId, blockKey))
              .then(() => getPlan(planId))
              .then((saved) => {
                setPlan(saved);
                setActionMessage("");
              })
              .catch((error: unknown) => {
                setActionMessage(error instanceof Error ? error.message : "No se pudo regenerar la evidencia.");
              });
          }}
          actionMessage={actionMessage}
          notice={notice}
        />
      ) : step === 6 ? (
        <SessionsStepPage
          weeks={(plan.weeks ?? []).map((week) => ({
            position: week.position,
            title: week.title,
            active: week.active ?? false,
            sessions: week.sessions ?? [],
          }))}
          onReadyChange={reportSessionsReady}
          onSave={(sessionId, patch) =>
            trackSave(
              saveClassSession(planId, sessionId, patch)
                .then((saved) => {
                  setPlan(saved);
                  setSaveState("saved");
                })
                .catch(() => {
                  setSaveState("error");
                }),
            )
          }
          onGenerate={(weekNumber) =>
            pendingSave.current
              .then(() => generateWeekSessions(planId, weekNumber))
              .then((saved) => {
                setPlan(saved);
                setActionMessage("");
              })
              .catch((error: unknown) => {
                setActionMessage(error instanceof Error ? error.message : "No se pudieron generar las sesiones.");
              })
          }
          onDuplicate={(weekNumber) =>
            pendingSave.current
              .then(() => duplicateStructure(planId, weekNumber))
              .then((saved) => {
                setPlan(saved);
                setActionMessage("");
              })
              .catch((error: unknown) => {
                setActionMessage(error instanceof Error ? error.message : "No se pudo duplicar la estructura.");
              })
          }
          onExport={(weekNumber) => {
            void pendingSave.current
              .then(() => downloadWeekPdf(planId, weekNumber))
              .catch((error: unknown) => {
                setActionMessage(error instanceof Error ? error.message : "No se pudo exportar la semana.");
              });
          }}
          actionMessage={actionMessage}
        />
      ) : step === 7 && mepDocument ? (
        <MepStepPage
          document={mepDocument}
          status={plan.status}
          onSave={(patch) => {
            void trackSave(
              patchMepDocument(planId, patch)
                .then(setMepDocument)
                .then(() => {
                  setSaveState("saved");
                })
                .catch(() => {
                  setSaveState("error");
                }),
            );
          }}
          onDownload={() => undefined}
        />
      ) : (
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
      )}
      <SaveFooter state={saveState} />
    </WizardChrome>
  );
}

