import { type AnswersMap, overallBlockAveragePercentFromAnswers } from "./data";

export const SNAPSHOTS_STORAGE_KEY = "nist-csf-maturity-snapshots-v1";

const MAX_SNAPSHOTS = 28;

export interface EvalSnapshot {
  id: string;
  createdAt: string;
  label: string;
  /** Campo legado; ya no se guarda en nuevas mediciones. */
  context?: string;
  answers: AnswersMap;
}

export function loadSnapshots(): EvalSnapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SNAPSHOTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as EvalSnapshot[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(list: EvalSnapshot[]) {
  localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(list));
}

export function saveSnapshot(label: string, answers: AnswersMap): string | null {
  if (typeof window === "undefined") return null;
  try {
    const list = loadSnapshots();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const snap: EvalSnapshot = {
      id,
      createdAt: new Date().toISOString(),
      label: label.trim() || `Medicion ${new Date().toLocaleString("es-CL")}`,
      answers: JSON.parse(JSON.stringify(answers)) as AnswersMap,
    };
    list.unshift(snap);
    while (list.length > MAX_SNAPSHOTS) list.pop();
    persist(list);
    return id;
  } catch {
    return null;
  }
}

export function deleteSnapshot(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const list = loadSnapshots().filter((s) => s.id !== id);
    persist(list);
    return true;
  } catch {
    return false;
  }
}

export function snapshotMetrics(answers: AnswersMap) {
  return {
    overall: overallBlockAveragePercentFromAnswers(answers),
  };
}
