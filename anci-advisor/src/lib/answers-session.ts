/**
 * Sesion de respuestas del cuestionario: persiste en localStorage entre recargas (F5).
 * Solo se limpia con "Nueva evaluacion" en la barra de navegacion.
 */

import { CONTROLS, type AnswersMap } from "./data";

export const ANSWERS_SESSION_KEY = "nist-csf-answers-session-v1";

function isPlainRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

export function loadAnswersSession(): AnswersMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(ANSWERS_SESSION_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!isPlainRecord(parsed)) return {};
    const out: AnswersMap = {};
    for (const c of CONTROLS) {
      const sub = parsed[c.id];
      if (!isPlainRecord(sub)) continue;
      const inner: Record<number, number> = {};
      for (let i = 0; i < c.questions.length; i++) {
        const v = sub[String(i)];
        if (typeof v === "number" && Number.isInteger(v) && v >= 0 && v <= 2) {
          inner[i] = v;
        }
      }
      if (Object.keys(inner).length > 0) out[c.id] = inner;
    }
    return out;
  } catch {
    return {};
  }
}

export function saveAnswersSession(answers: AnswersMap): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ANSWERS_SESSION_KEY, JSON.stringify(answers));
  } catch {
    // quota u otro error: no bloquear la UI
  }
}
