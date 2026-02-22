"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { phases, type Task } from "./checklistData";

/* ─── State Types ─── */

interface TaskState {
  completed: boolean;
  notes: string;
}

type ChecklistState = Record<string, TaskState>;

interface AppPosition {
  phaseIndex: number;
  taskIndex: number;
}

type View = "step" | "phase-intro" | "gate" | "review" | "complete";

/* ─── Persistence ─── */

const STORAGE_KEY = "launch-in-a-day-v2";

function loadState(): ChecklistState {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveState(state: ChecklistState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

/* ─── Helpers ─── */

function getPhaseProgress(phaseIndex: number, state: ChecklistState) {
  const phase = phases[phaseIndex];
  const total = phase.tasks.length;
  const completed = phase.tasks.filter((t) => state[t.id]?.completed).length;
  return { total, completed, percent: total > 0 ? (completed / total) * 100 : 0 };
}

function isPhaseComplete(phaseIndex: number, state: ChecklistState) {
  return getPhaseProgress(phaseIndex, state).percent === 100;
}

function isPhaseUnlocked(phaseIndex: number, state: ChecklistState): boolean {
  if (phaseIndex === 0) return true;
  if (phaseIndex === 2) {
    return isPhaseComplete(0, state) && isPhaseComplete(1, state);
  }
  if (phaseIndex === 3) {
    return isPhaseUnlocked(2, state) && isPhaseComplete(2, state);
  }
  return isPhaseComplete(phaseIndex - 1, state);
}

function getAllTasksFlat() {
  return phases.flatMap((phase, pi) =>
    phase.tasks.map((task, ti) => ({ task, phaseIndex: pi, taskIndex: ti }))
  );
}

function findFirstIncompletePosition(state: ChecklistState): AppPosition {
  for (let pi = 0; pi < phases.length; pi++) {
    if (!isPhaseUnlocked(pi, state)) continue;
    for (let ti = 0; ti < phases[pi].tasks.length; ti++) {
      if (!state[phases[pi].tasks[ti].id]?.completed) {
        return { phaseIndex: pi, taskIndex: ti };
      }
    }
  }
  return { phaseIndex: phases.length - 1, taskIndex: phases[phases.length - 1].tasks.length - 1 };
}

function getTotalProgress(state: ChecklistState) {
  const all = getAllTasksFlat();
  const completed = all.filter((t) => state[t.task.id]?.completed).length;
  return { total: all.length, completed, percent: all.length > 0 ? (completed / all.length) * 100 : 0 };
}

/* ─── Subcomponents ─── */

function OwnerBadge({ owner }: { owner: Task["owner"] }) {
  const styles = {
    Human: "bg-gold/10 text-gold border-gold/20",
    AI: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Both: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 tracking-wider font-medium border ${styles[owner]}`}>
      {owner.toUpperCase()}
    </span>
  );
}

function ProgressDots({
  phaseIndex,
  taskIndex,
  state,
}: {
  phaseIndex: number;
  taskIndex: number;
  state: ChecklistState;
}) {
  const phase = phases[phaseIndex];
  return (
    <div className="flex items-center gap-1.5">
      {phase.tasks.map((t, i) => {
        const isComplete = state[t.id]?.completed;
        const isCurrent = i === taskIndex;
        return (
          <div
            key={t.id}
            className={`step-dot ${
              isComplete
                ? "step-dot-complete"
                : isCurrent
                  ? "step-dot-active"
                  : "step-dot-pending"
            }`}
          />
        );
      })}
    </div>
  );
}

/* ─── Phase Intro Screen ─── */

function PhaseIntro({
  phaseIndex,
  onStart,
}: {
  phaseIndex: number;
  onStart: () => void;
}) {
  const phase = phases[phaseIndex];
  return (
    <div className="animate-fade-in-up max-w-2xl mx-auto text-center py-12">
      <div className="mb-8">
        <span className="text-gold font-display text-7xl md:text-8xl opacity-30">
          {phase.number}
        </span>
      </div>
      <p className="text-gold uppercase tracking-[0.2em] text-xs mb-4">
        Phase {phase.number}
      </p>
      <h2 className="font-display text-4xl md:text-5xl text-white mb-3">
        {phase.title}
      </h2>
      <p className="text-gold/70 text-sm mb-6">{phase.subtitle}</p>
      <p className="text-text-muted text-lg leading-relaxed max-w-lg mx-auto mb-10">
        {phase.description}
      </p>
      <div className="flex items-center justify-center gap-4 text-xs text-text-muted mb-10">
        <span>{phase.tasks.length} tasks</span>
        <span className="text-dark-border">|</span>
        <OwnerBadge owner={phase.tasks[0].owner} />
      </div>
      <button
        onClick={onStart}
        className="bg-gold text-dark px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-gold-light transition-colors"
      >
        Begin Phase {phase.number}
      </button>
    </div>
  );
}

/* ─── Gate Screen ─── */

function GateScreen({
  phaseIndex,
  onContinue,
}: {
  phaseIndex: number;
  onContinue: () => void;
}) {
  const phase = phases[phaseIndex];
  const nextPhase = phases[phaseIndex + 1];
  return (
    <div className="animate-gate-unlock max-w-2xl mx-auto text-center py-12">
      <div className="mb-8">
        <div className="w-20 h-20 mx-auto border-2 border-gold flex items-center justify-center animate-pulse-gold">
          <svg
            className="w-10 h-10 text-gold"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
      <p className="text-gold uppercase tracking-[0.2em] text-xs mb-4">
        {phase.gateName} Cleared
      </p>
      <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
        Phase {phase.number} complete.
      </h2>
      <p className="text-text-muted text-base mb-3">{phase.gateRule}</p>
      <div className="w-16 h-px bg-gold/30 mx-auto my-8" />
      {nextPhase && (
        <>
          <p className="text-text-muted text-sm mb-8">
            Next up: <span className="text-white">{nextPhase.title}</span> — {nextPhase.tasks.length} tasks
          </p>
          <button
            onClick={onContinue}
            className="bg-gold text-dark px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-gold-light transition-colors"
          >
            Continue to Phase {nextPhase.number}
          </button>
        </>
      )}
    </div>
  );
}

/* ─── Complete Screen ─── */

function CompleteScreen({ onReview }: { onReview: () => void }) {
  return (
    <div className="animate-gate-unlock max-w-2xl mx-auto text-center py-16">
      <div className="mb-8">
        <div className="w-24 h-24 mx-auto border-2 border-gold flex items-center justify-center gate-unlocked">
          <svg
            className="w-12 h-12 text-gold"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
      <h2 className="font-display text-4xl md:text-5xl text-gold mb-4">
        You shipped it.
      </h2>
      <p className="text-text-muted text-lg mb-8 max-w-md mx-auto">
        All 32 tasks complete. You&rsquo;ve gone from idea to live product. Now go talk to your users.
      </p>
      <button
        onClick={onReview}
        className="bg-gold text-dark px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-gold-light transition-colors"
      >
        Review All Decisions
      </button>
    </div>
  );
}

/* ─── Step View (Single Task) ─── */

function StepView({
  task,
  phaseIndex,
  taskIndex,
  taskState,
  checklistState,
  onComplete,
  onNotesChange,
  onSkipBack,
  onSkipForward,
  onShowMap,
}: {
  task: Task;
  phaseIndex: number;
  taskIndex: number;
  taskState: TaskState;
  checklistState: ChecklistState;
  onComplete: () => void;
  onNotesChange: (notes: string) => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onShowMap: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const phase = phases[phaseIndex];
  const isFirst = phaseIndex === 0 && taskIndex === 0;
  const isLast =
    phaseIndex === phases.length - 1 &&
    taskIndex === phase.tasks.length - 1;

  const canGoBack = !isFirst;
  const canGoForward = taskState.completed && !isLast;

  useEffect(() => {
    if (textareaRef.current && !taskState.completed) {
      textareaRef.current.focus();
    }
  }, [task.id, taskState.completed]);

  return (
    <div className="animate-fade-in-up" key={task.id}>
      {/* Phase + step indicator */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="text-gold/40 font-display text-sm">{phase.number}</span>
          <span className="text-dark-border">/</span>
          <span className="text-text-muted text-sm">{phase.title}</span>
        </div>
        <button
          onClick={onShowMap}
          className="text-text-muted hover:text-gold text-xs transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Overview
        </button>
      </div>

      {/* Progress dots */}
      <div className="mb-8">
        <ProgressDots phaseIndex={phaseIndex} taskIndex={taskIndex} state={checklistState} />
      </div>

      {/* Task number + owner */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-gold font-mono text-sm">{task.id}</span>
        <OwnerBadge owner={task.owner} />
      </div>

      {/* Task title */}
      <h1 className="font-display text-3xl md:text-4xl text-white mb-3">
        {task.title}
      </h1>

      {/* Deliverable */}
      <p className="text-text-muted text-base mb-2">
        {task.deliverable}
      </p>

      {/* Definition of Good */}
      <div className="flex items-start gap-2 mb-8">
        <svg className="w-4 h-4 text-gold/50 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gold/60 text-sm italic">
          Good enough: {task.definition}
        </p>
      </div>

      {/* Why this matters */}
      {task.why && (
        <div className="border-l-2 border-gold/20 pl-4 mb-8">
          <p className="text-text-muted text-sm leading-relaxed">{task.why}</p>
        </div>
      )}

      {/* Input area */}
      <div className="mb-6">
        <label className="text-[10px] uppercase tracking-widest text-gold/50 mb-2 block">
          Your Answer
        </label>
        <textarea
          ref={textareaRef}
          className="w-full bg-dark-secondary border border-dark-border text-white text-sm p-4 focus:border-gold/50 placeholder:text-text-muted/40 resize-y min-h-[120px] transition-colors"
          placeholder={task.inputPlaceholder || "Write your answer here..."}
          value={taskState.notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={4}
        />
      </div>

      {/* Tip */}
      {task.tip && (
        <div className="bg-dark-card border border-dark-border p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-4 h-4 text-gold/50 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
            <p className="text-text-muted text-xs leading-relaxed">{task.tip}</p>
          </div>
        </div>
      )}

      {/* Example */}
      {task.example && (
        <div className="bg-dark-card border border-dark-border p-4 mb-8">
          <p className="text-[10px] uppercase tracking-widest text-gold/50 mb-2">
            Example
          </p>
          <p className="text-text-muted text-xs leading-relaxed italic">
            &ldquo;{task.example}&rdquo;
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-dark-border">
        <button
          onClick={onSkipBack}
          disabled={!canGoBack}
          className={`flex items-center gap-2 text-sm transition-colors ${
            canGoBack
              ? "text-text-muted hover:text-white"
              : "text-dark-border cursor-not-allowed"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>

        <div className="flex items-center gap-3">
          {taskState.completed ? (
            <button
              onClick={onSkipForward}
              disabled={!canGoForward}
              className="bg-gold text-dark px-6 py-3 text-sm font-semibold tracking-wider uppercase hover:bg-gold-light transition-colors flex items-center gap-2"
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="bg-gold text-dark px-6 py-3 text-sm font-semibold tracking-wider uppercase hover:bg-gold-light transition-colors flex items-center gap-2"
            >
              Complete
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Review / Overview Map ─── */

function ReviewView({
  state,
  onNavigate,
  onClose,
  onExport,
  onReset,
}: {
  state: ChecklistState;
  onNavigate: (phaseIndex: number, taskIndex: number) => void;
  onClose: () => void;
  onExport: () => void;
  onReset: () => void;
}) {
  const total = getTotalProgress(state);

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-gold uppercase tracking-[0.2em] text-xs mb-2">Overview</p>
          <h2 className="font-display text-3xl text-white">Your progress</h2>
        </div>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-white transition-colors p-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Overall progress */}
      <div className="bg-dark-card border border-dark-border p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-text-muted text-sm">Overall completion</span>
          <span className="text-gold font-display text-2xl">{Math.round(total.percent)}%</span>
        </div>
        <div className="h-2 bg-dark-border overflow-hidden">
          <div
            className="h-full bg-gold transition-all duration-500"
            style={{ width: `${total.percent}%` }}
          />
        </div>
        <p className="text-text-muted text-xs mt-2">
          {total.completed} of {total.total} tasks complete
        </p>
      </div>

      {/* Phase-by-phase */}
      {phases.map((phase, pi) => {
        const progress = getPhaseProgress(pi, state);
        const unlocked = isPhaseUnlocked(pi, state);

        return (
          <div key={phase.id} className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className={`font-display text-lg ${unlocked ? "text-gold" : "text-dark-border"}`}>
                {phase.number}
              </span>
              <h3 className={`text-sm font-semibold ${unlocked ? "text-white" : "text-text-muted"}`}>
                {phase.title}
              </h3>
              <div className="flex-1 h-px bg-dark-border" />
              <span className="text-xs text-text-muted">
                {progress.completed}/{progress.total}
              </span>
              {!unlocked && (
                <svg className="w-3.5 h-3.5 text-dark-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </div>

            <div className="space-y-1 ml-8">
              {phase.tasks.map((task, ti) => {
                const ts = state[task.id];
                const isComplete = ts?.completed;
                const hasNotes = ts?.notes && ts.notes.trim().length > 0;

                return (
                  <button
                    key={task.id}
                    onClick={() => unlocked && onNavigate(pi, ti)}
                    disabled={!unlocked}
                    className={`w-full text-left flex items-start gap-3 p-3 border transition-colors ${
                      !unlocked
                        ? "border-transparent opacity-30 cursor-not-allowed"
                        : isComplete
                          ? "border-dark-border/50 bg-dark-card/50 hover:border-gold/20 cursor-pointer"
                          : "border-dark-border bg-dark-card hover:border-gold/20 cursor-pointer"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 mt-0.5 shrink-0 border flex items-center justify-center ${
                        isComplete
                          ? "bg-gold border-gold"
                          : "border-dark-border"
                      }`}
                    >
                      {isComplete && (
                        <svg className="w-2.5 h-2.5 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-gold/40 text-[10px] font-mono">{task.id}</span>
                        <span className={`text-xs ${isComplete ? "text-text-muted" : "text-white"}`}>
                          {task.title}
                        </span>
                      </div>
                      {hasNotes && (
                        <p className="text-text-muted/60 text-[11px] mt-1 truncate">
                          {ts!.notes}
                        </p>
                      )}
                    </div>
                    <OwnerBadge owner={task.owner} />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-6 border-t border-dark-border mt-8">
        <button
          onClick={onExport}
          className="border border-dark-border text-text-muted px-4 py-2 text-xs tracking-wider uppercase hover:border-gold hover:text-gold transition-colors"
        >
          Export JSON
        </button>
        <button
          onClick={onReset}
          className="border border-dark-border text-text-muted px-4 py-2 text-xs tracking-wider uppercase hover:border-red-500 hover:text-red-400 transition-colors"
        >
          Reset All
        </button>
      </div>
    </div>
  );
}

/* ─── Main App ─── */

export default function ChecklistPage() {
  const [state, setState] = useState<ChecklistState>({});
  const [loaded, setLoaded] = useState(false);
  const [position, setPosition] = useState<AppPosition>({ phaseIndex: 0, taskIndex: 0 });
  const [view, setView] = useState<View>("phase-intro");
  const [introSeenPhases, setIntroSeenPhases] = useState<Set<number>>(new Set());

  // Load saved state
  useEffect(() => {
    const saved = loadState();
    setState(saved);

    // Resume from where the user left off
    const pos = findFirstIncompletePosition(saved);
    setPosition(pos);

    // If any tasks are completed, skip straight to step view
    const hasProgress = Object.values(saved).some((t) => t.completed);
    if (hasProgress) {
      setIntroSeenPhases(new Set([0, 1, 2, 3]));
      setView("step");
    }

    setLoaded(true);
  }, []);

  // Persist state changes
  useEffect(() => {
    if (loaded) saveState(state);
  }, [state, loaded]);

  /* ─── Actions ─── */

  const completeTask = useCallback(() => {
    const phase = phases[position.phaseIndex];
    const task = phase.tasks[position.taskIndex];

    setState((prev) => {
      const next = {
        ...prev,
        [task.id]: { completed: true, notes: prev[task.id]?.notes || "" },
      };

      // Check if this completes the phase
      const phaseComplete = phase.tasks.every(
        (t) => next[t.id]?.completed
      );

      if (phaseComplete) {
        // Show gate screen (or complete screen if last phase)
        if (position.phaseIndex < phases.length - 1) {
          setTimeout(() => setView("gate"), 150);
        } else {
          setTimeout(() => setView("complete"), 150);
        }
      } else {
        // Advance to next incomplete task in this phase
        const nextTaskIndex = phase.tasks.findIndex(
          (t, i) => i > position.taskIndex && !next[t.id]?.completed
        );
        if (nextTaskIndex >= 0) {
          setTimeout(
            () => setPosition({ phaseIndex: position.phaseIndex, taskIndex: nextTaskIndex }),
            150
          );
        }
      }

      return next;
    });
  }, [position]);

  const updateNotes = useCallback(
    (notes: string) => {
      const task = phases[position.phaseIndex].tasks[position.taskIndex];
      setState((prev) => ({
        ...prev,
        [task.id]: {
          completed: prev[task.id]?.completed || false,
          notes,
        },
      }));
    },
    [position]
  );

  const navigateTo = useCallback(
    (phaseIndex: number, taskIndex: number) => {
      setPosition({ phaseIndex, taskIndex });
      setView("step");
    },
    []
  );

  const goBack = useCallback(() => {
    if (position.taskIndex > 0) {
      setPosition({ phaseIndex: position.phaseIndex, taskIndex: position.taskIndex - 1 });
    } else if (position.phaseIndex > 0) {
      const prevPhase = phases[position.phaseIndex - 1];
      setPosition({
        phaseIndex: position.phaseIndex - 1,
        taskIndex: prevPhase.tasks.length - 1,
      });
    }
  }, [position]);

  const goForward = useCallback(() => {
    const phase = phases[position.phaseIndex];
    if (position.taskIndex < phase.tasks.length - 1) {
      setPosition({ phaseIndex: position.phaseIndex, taskIndex: position.taskIndex + 1 });
    } else if (position.phaseIndex < phases.length - 1) {
      const nextPhaseIndex = position.phaseIndex + 1;
      if (isPhaseUnlocked(nextPhaseIndex, state)) {
        setPosition({ phaseIndex: nextPhaseIndex, taskIndex: 0 });
      }
    }
  }, [position, state]);

  const startPhase = useCallback(() => {
    setIntroSeenPhases((prev) => new Set([...prev, position.phaseIndex]));
    setView("step");
  }, [position.phaseIndex]);

  const continueToNextPhase = useCallback(() => {
    const nextPhaseIndex = position.phaseIndex + 1;
    if (nextPhaseIndex < phases.length) {
      setPosition({ phaseIndex: nextPhaseIndex, taskIndex: 0 });
      if (introSeenPhases.has(nextPhaseIndex)) {
        setView("step");
      } else {
        setView("phase-intro");
      }
    }
  }, [position.phaseIndex, introSeenPhases]);

  const handleExport = useCallback(() => {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "launch-in-a-day-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const handleReset = useCallback(() => {
    if (window.confirm("This will erase all your progress and answers. Are you sure?")) {
      setState({});
      localStorage.removeItem(STORAGE_KEY);
      setPosition({ phaseIndex: 0, taskIndex: 0 });
      setIntroSeenPhases(new Set());
      setView("phase-intro");
    }
  }, []);

  /* ─── Derived ─── */

  const currentPhase = phases[position.phaseIndex];
  const currentTask = currentPhase.tasks[position.taskIndex];
  const currentTaskState = state[currentTask.id] || { completed: false, notes: "" };
  const totalProgress = getTotalProgress(state);

  /* ─── Keyboard navigation ─── */

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (view !== "step") return;
      if (e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "ArrowLeft" || e.key === "k") {
        e.preventDefault();
        goBack();
      } else if (e.key === "ArrowRight" || e.key === "j") {
        if (currentTaskState.completed) {
          e.preventDefault();
          goForward();
        }
      } else if (e.key === "Enter" && !currentTaskState.completed) {
        e.preventDefault();
        completeTask();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [view, goBack, goForward, completeTask, currentTaskState.completed]);

  /* ─── Loading ─── */

  if (!loaded) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-gold font-display text-xl animate-pulse">
          [ Loading... ]
        </div>
      </div>
    );
  }

  /* ─── Render ─── */

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-sm border-b border-dark-border">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-gold font-display text-base tracking-wide hover:text-gold-light transition-colors"
          >
            [ Launch in a Day ]
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-text-muted text-xs hidden sm:inline">
              {totalProgress.completed}/{totalProgress.total}
            </span>
            <div className="w-20 h-1 bg-dark-border overflow-hidden">
              <div
                className="h-full bg-gold transition-all duration-500"
                style={{ width: `${totalProgress.percent}%` }}
              />
            </div>
            <button
              onClick={() => setView(view === "review" ? "step" : "review")}
              className={`text-xs transition-colors ${view === "review" ? "text-gold" : "text-text-muted hover:text-gold"}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 pt-16">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {view === "phase-intro" && (
            <PhaseIntro phaseIndex={position.phaseIndex} onStart={startPhase} />
          )}

          {view === "gate" && (
            <GateScreen
              phaseIndex={position.phaseIndex}
              onContinue={continueToNextPhase}
            />
          )}

          {view === "complete" && (
            <CompleteScreen onReview={() => setView("review")} />
          )}

          {view === "step" && (
            <StepView
              task={currentTask}
              phaseIndex={position.phaseIndex}
              taskIndex={position.taskIndex}
              taskState={currentTaskState}
              checklistState={state}
              onComplete={completeTask}
              onNotesChange={updateNotes}
              onSkipBack={goBack}
              onSkipForward={goForward}
              onShowMap={() => setView("review")}
            />
          )}

          {view === "review" && (
            <ReviewView
              state={state}
              onNavigate={navigateTo}
              onClose={() => setView("step")}
              onExport={handleExport}
              onReset={handleReset}
            />
          )}
        </div>
      </main>

      {/* Bottom bar — keyboard hints (desktop) */}
      {view === "step" && (
        <div className="hidden md:block fixed bottom-0 left-0 right-0 bg-dark/95 backdrop-blur-sm border-t border-dark-border">
          <div className="max-w-2xl mx-auto px-6 py-2 flex items-center justify-center gap-6 text-[10px] text-text-muted/60 uppercase tracking-wider">
            <span>
              <kbd className="text-text-muted bg-dark-card border border-dark-border px-1.5 py-0.5 mx-1">&#8592;</kbd>
              Back
            </span>
            <span>
              <kbd className="text-text-muted bg-dark-card border border-dark-border px-1.5 py-0.5 mx-1">&#8594;</kbd>
              Next
            </span>
            <span>
              <kbd className="text-text-muted bg-dark-card border border-dark-border px-1.5 py-0.5 mx-1">Enter</kbd>
              Complete
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
