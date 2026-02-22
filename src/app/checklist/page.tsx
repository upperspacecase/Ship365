"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { phases, type Phase, type Task } from "./checklistData";

interface TaskState {
  completed: boolean;
  notes: string;
}

type ChecklistState = Record<string, TaskState>;

const STORAGE_KEY = "launch-in-a-day-checklist";

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
    // ignore
  }
}

function getPhaseProgress(phase: Phase, state: ChecklistState) {
  const total = phase.tasks.length;
  const completed = phase.tasks.filter((t) => state[t.id]?.completed).length;
  return { total, completed, percent: total > 0 ? (completed / total) * 100 : 0 };
}

function isPhaseUnlocked(phaseIndex: number, state: ChecklistState): boolean {
  if (phaseIndex === 0) return true;
  // Phase 3 (index 2) requires both Phase 1 and Phase 2 complete
  if (phaseIndex === 2) {
    const p1 = getPhaseProgress(phases[0], state);
    const p2 = getPhaseProgress(phases[1], state);
    return p1.percent === 100 && p2.percent === 100;
  }
  // Phase 4 requires Phase 3 complete
  if (phaseIndex === 3) {
    const p3 = getPhaseProgress(phases[2], state);
    return isPhaseUnlocked(2, state) && p3.percent === 100;
  }
  // Phase 2 requires Phase 1 complete
  const prev = getPhaseProgress(phases[phaseIndex - 1], state);
  return prev.percent === 100;
}

function OwnerBadge({ owner }: { owner: Task["owner"] }) {
  const styles = {
    Human: "bg-gold/10 text-gold border-gold/20",
    AI: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Both: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };
  return (
    <span
      className={`text-[10px] px-2 py-0.5 tracking-wider font-medium border ${styles[owner]}`}
    >
      {owner.toUpperCase()}
    </span>
  );
}

function TaskCard({
  task,
  taskState,
  onToggle,
  onNotesChange,
  disabled,
}: {
  task: Task;
  taskState: TaskState;
  onToggle: () => void;
  onNotesChange: (notes: string) => void;
  disabled: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`border transition-all ${
        taskState.completed
          ? "border-gold/20 bg-gold/[0.02] task-completed"
          : disabled
            ? "border-dark-border/50 bg-dark-card/50 opacity-50"
            : "border-dark-border bg-dark-card hover:border-gold/20"
      }`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            className="checklist-checkbox mt-1"
            checked={taskState.completed}
            onChange={onToggle}
            disabled={disabled}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-gold/50 text-xs font-mono">{task.id}</span>
              <OwnerBadge owner={task.owner} />
            </div>
            <h3
              className={`font-semibold text-sm ${
                taskState.completed ? "task-text text-text-muted" : "text-white"
              }`}
            >
              {task.title}
            </h3>
            <p className="text-text-muted text-xs mt-1">{task.deliverable}</p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-text-muted hover:text-gold transition-colors shrink-0 p-1"
            disabled={disabled}
          >
            <svg
              className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 border-t border-dark-border/50">
          <div className="pt-4 space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gold/50 mb-1">
                Definition of Good
              </p>
              <p className="text-text-muted text-xs">{task.definition}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gold/50 mb-1">
                Notes / Output
              </p>
              <textarea
                className="w-full bg-dark border border-dark-border text-white text-sm p-3 focus:outline-none focus:border-gold/50 placeholder:text-text-muted/50 resize-y min-h-[80px]"
                placeholder={task.inputPlaceholder || "Add your notes here..."}
                value={taskState.notes}
                onChange={(e) => onNotesChange(e.target.value)}
                disabled={disabled}
                rows={3}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PhaseSection({
  phase,
  phaseIndex,
  state,
  onToggleTask,
  onUpdateNotes,
}: {
  phase: Phase;
  phaseIndex: number;
  state: ChecklistState;
  onToggleTask: (taskId: string) => void;
  onUpdateNotes: (taskId: string, notes: string) => void;
}) {
  const progress = getPhaseProgress(phase, state);
  const unlocked = isPhaseUnlocked(phaseIndex, state);
  const complete = progress.percent === 100;

  return (
    <div
      id={phase.id}
      className={`mb-12 ${complete ? "gate-unlocked" : ""}`}
    >
      {/* Phase Header */}
      <div className="flex items-start gap-6 mb-6">
        <div className="shrink-0">
          <span
            className={`font-display text-4xl ${
              complete ? "text-gold" : unlocked ? "text-gold/40" : "text-dark-border"
            }`}
          >
            {phase.number}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-semibold text-white">{phase.title}</h2>
            {complete && (
              <span className="text-gold text-xs px-2 py-0.5 border border-gold/30 bg-gold/10">
                COMPLETE
              </span>
            )}
            {!unlocked && (
              <span className="text-text-muted text-xs px-2 py-0.5 border border-dark-border flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                LOCKED
              </span>
            )}
          </div>
          <p className="text-text-muted text-sm">{phase.subtitle}</p>

          {/* Progress bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-1 bg-dark-border overflow-hidden">
              <div
                className="h-full bg-gold transition-all duration-500 progress-bar-animated"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <span className="text-xs text-text-muted shrink-0">
              {progress.completed}/{progress.total}
            </span>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-2 ml-0 md:ml-16">
        {phase.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            taskState={state[task.id] || { completed: false, notes: "" }}
            onToggle={() => onToggleTask(task.id)}
            onNotesChange={(notes) => onUpdateNotes(task.id, notes)}
            disabled={!unlocked}
          />
        ))}
      </div>

      {/* Gate message */}
      {complete && phaseIndex < phases.length - 1 && (
        <div className="mt-6 ml-0 md:ml-16 p-4 border border-gold/30 bg-gold/5 flex items-center gap-3">
          <svg
            className="w-5 h-5 text-gold shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gold text-sm">
            Gate {phaseIndex + 1} cleared — Phase {phaseIndex + 2} unlocked.
          </p>
        </div>
      )}
    </div>
  );
}

export default function ChecklistPage() {
  const [state, setState] = useState<ChecklistState>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setState(loadState());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveState(state);
  }, [state, loaded]);

  const toggleTask = useCallback((taskId: string) => {
    setState((prev) => ({
      ...prev,
      [taskId]: {
        completed: !prev[taskId]?.completed,
        notes: prev[taskId]?.notes || "",
      },
    }));
  }, []);

  const updateNotes = useCallback((taskId: string, notes: string) => {
    setState((prev) => ({
      ...prev,
      [taskId]: {
        completed: prev[taskId]?.completed || false,
        notes,
      },
    }));
  }, []);

  const totalTasks = phases.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedTasks = phases.reduce(
    (sum, p) => sum + p.tasks.filter((t) => state[t.id]?.completed).length,
    0
  );
  const overallPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleReset = () => {
    if (
      window.confirm(
        "This will reset all your progress. Are you sure?"
      )
    ) {
      setState({});
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "launch-in-a-day-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!loaded) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-gold font-display text-xl animate-pulse">
          [ Loading... ]
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-sm border-b border-dark-border">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-gold font-display text-base tracking-wide hover:text-gold-light transition-colors"
          >
            [ Launch in a Day ]
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-text-muted text-xs hidden sm:inline">
              {completedTasks}/{totalTasks} tasks
            </span>
            <div className="w-24 h-1.5 bg-dark-border overflow-hidden hidden sm:block">
              <div
                className="h-full bg-gold transition-all duration-500"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
            <button
              onClick={handleExport}
              className="text-text-muted hover:text-gold text-xs transition-colors"
              title="Export progress"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            <button
              onClick={handleReset}
              className="text-text-muted hover:text-red-400 text-xs transition-colors"
              title="Reset all progress"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Phase navigation sidebar - desktop */}
      <aside className="fixed left-0 top-14 bottom-0 w-48 border-r border-dark-border bg-dark/95 hidden lg:flex flex-col py-6 px-4 z-40">
        <p className="text-[10px] uppercase tracking-widest text-text-muted mb-4">
          Phases
        </p>
        {phases.map((phase, i) => {
          const prog = getPhaseProgress(phase, state);
          const unlocked = isPhaseUnlocked(i, state);
          return (
            <a
              key={phase.id}
              href={`#${phase.id}`}
              className={`flex items-center gap-3 py-2 group transition-colors ${
                !unlocked ? "opacity-40 pointer-events-none" : ""
              }`}
            >
              <span
                className={`text-xs font-display ${
                  prog.percent === 100
                    ? "text-gold"
                    : "text-text-muted group-hover:text-white"
                }`}
              >
                {phase.number}
              </span>
              <div className="flex-1">
                <p
                  className={`text-xs ${
                    prog.percent === 100
                      ? "text-gold"
                      : "text-text-muted group-hover:text-white"
                  }`}
                >
                  {phase.title}
                </p>
                <div className="w-full h-0.5 bg-dark-border mt-1 overflow-hidden">
                  <div
                    className="h-full bg-gold transition-all"
                    style={{ width: `${prog.percent}%` }}
                  />
                </div>
              </div>
            </a>
          );
        })}

        <div className="mt-auto pt-6 border-t border-dark-border">
          <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2">
            Overall
          </p>
          <p className="text-gold font-display text-2xl">
            {Math.round(overallPercent)}%
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="pt-20 pb-16 lg:pl-48">
        <div className="max-w-3xl mx-auto px-6">
          {/* Hero */}
          <div className="mb-16 pt-8">
            <p className="text-gold uppercase tracking-[0.2em] text-xs mb-3">
              Your Launch Checklist
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
              Idea to live product.
            </h1>
            <p className="text-text-muted text-lg max-w-lg">
              Work through each phase in order. Complete every task before moving
              to the next gate.
            </p>
          </div>

          {/* Phases */}
          {phases.map((phase, i) => (
            <PhaseSection
              key={phase.id}
              phase={phase}
              phaseIndex={i}
              state={state}
              onToggleTask={toggleTask}
              onUpdateNotes={updateNotes}
            />
          ))}

          {/* Completion */}
          {overallPercent === 100 && (
            <div className="text-center py-16 border border-gold/30 bg-gold/5 gate-unlocked">
              <p className="text-gold font-display text-3xl mb-4">
                You shipped it.
              </p>
              <p className="text-text-muted">
                All 32 tasks complete. Now go talk to your users.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
