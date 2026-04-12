/**
 * Registro de gobierno: metadatos de la evaluacion (trazabilidad, no preguntas CSF).
 * Persistencia solo en este navegador (localStorage).
 */

export const GOVERNANCE_STORAGE_KEY = "nist-csf-governance-record-v1";

export type GovernanceMeasurementType = "" | "linea_base" | "seguimiento" | "auditoria_interna";

export interface GovernanceRecord {
  institutionName: string;
  scopeText: string;
  responsibleName: string;
  responsibleRole: string;
  responsibleArea: string;
  measurementType: GovernanceMeasurementType;
  policyReference: string;
  notes: string;
  updatedAt: string;
}

export function emptyGovernanceRecord(): GovernanceRecord {
  return {
    institutionName: "",
    scopeText: "",
    responsibleName: "",
    responsibleRole: "",
    responsibleArea: "",
    measurementType: "",
    policyReference: "",
    notes: "",
    updatedAt: "",
  };
}

export function loadGovernanceRecord(): GovernanceRecord {
  if (typeof window === "undefined") return emptyGovernanceRecord();
  try {
    const raw = localStorage.getItem(GOVERNANCE_STORAGE_KEY);
    if (!raw) return emptyGovernanceRecord();
    const p = JSON.parse(raw) as Partial<GovernanceRecord>;
    const base = emptyGovernanceRecord();
    return {
      institutionName: typeof p.institutionName === "string" ? p.institutionName : "",
      scopeText: typeof p.scopeText === "string" ? p.scopeText : "",
      responsibleName: typeof p.responsibleName === "string" ? p.responsibleName : "",
      responsibleRole: typeof p.responsibleRole === "string" ? p.responsibleRole : "",
      responsibleArea: typeof p.responsibleArea === "string" ? p.responsibleArea : "",
      measurementType: isMeasurementType(p.measurementType) ? p.measurementType : "",
      policyReference: typeof p.policyReference === "string" ? p.policyReference : "",
      notes: typeof p.notes === "string" ? p.notes : "",
      updatedAt: typeof p.updatedAt === "string" ? p.updatedAt : "",
    };
  } catch {
    return emptyGovernanceRecord();
  }
}

function isMeasurementType(v: unknown): v is GovernanceMeasurementType {
  return v === "" || v === "linea_base" || v === "seguimiento" || v === "auditoria_interna";
}

export function saveGovernanceRecord(r: GovernanceRecord): void {
  if (typeof window === "undefined") return;
  try {
    const next = { ...r, updatedAt: new Date().toISOString() };
    localStorage.setItem(GOVERNANCE_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
}

/** Quita el registro del almacenamiento local (formulario vacio en la siguiente carga). */
export function clearGovernanceRecord(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(GOVERNANCE_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function governanceRecordHasAnyContent(r: GovernanceRecord): boolean {
  return (
    r.institutionName.trim() !== "" ||
    r.scopeText.trim() !== "" ||
    r.responsibleName.trim() !== "" ||
    r.responsibleRole.trim() !== "" ||
    r.responsibleArea.trim() !== "" ||
    r.measurementType !== "" ||
    r.policyReference.trim() !== "" ||
    r.notes.trim() !== ""
  );
}

export const MEASUREMENT_TYPE_LABELS: Record<Exclude<GovernanceMeasurementType, "">, string> = {
  linea_base: "Linea base",
  seguimiento: "Seguimiento",
  auditoria_interna: "Auditoria interna / autodiagnostico",
};
