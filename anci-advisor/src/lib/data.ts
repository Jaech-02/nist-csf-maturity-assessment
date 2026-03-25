/**
 * ANCI 9 Básicos de Ciberseguridad - Data Engine
 * By TTPSEC - Based on ANCI 9 Basics
 * Mapping: ISO 27001/27002, NIST CSF 2.0, NIST 800-53 Rev.5,
 *          CIS Controls v8.1, ISA/IEC 62443, NERC CIP
 * NO TRACKING | NO COOKIES | NO REGISTRATION | 100% CLIENT-SIDE
 */

export interface Question {
  text: string;
  weight: number;
}

export interface Control {
  id: string;
  number: number;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  riskIfMissing: string;
  mitre: string[];
  impact: string[];
  frameworks: Record<string, string>;
  questions: Question[];
  recommendations: {
    low: string[];
    medium: string[];
    high: string[];
  };
}

export interface MaturityLevel {
  label: string;
  min: number;
  max: number;
  cls: string;
  color: string;
  desc: string;
}

export const CONTROLS: Control[] = [
  {
    id: "c0",
    number: 0,
    name: "Gestión de Activos",
    shortName: "Activos",
    icon: "\uD83D\uDCCB",
    description: "Inventario completo, actualizado y gobernado de todos los activos de información, hardware, software y servicios.",
    riskIfMissing: "Sin inventario de activos: no sabes qué actualizar, qué respaldar, qué monitorear, qué proteger ni qué impacta la continuidad.",
    mitre: ["T1018 - Remote System Discovery", "T1083 - File and Directory Discovery", "T1082 - System Information Discovery"],
    impact: ["Puntos ciegos en la superficie de ataque", "Activos no gestionados como vectores de entrada", "Incapacidad de respuesta ante incidentes"],
    frameworks: {
      "ISO 27001:2022": "A.5.9 Inventario de activos; A.5.10 Uso aceptable; A.5.11 Devolución de activos; A.8.1 Dispositivos de usuario",
      "NIST CSF 2.0": "ID.AM-1, ID.AM-2, ID.AM-3, ID.AM-5 (Asset Management)",
      "NIST 800-53": "CM-8 System Component Inventory; CM-9 Configuration Management Plan; PM-5 System Inventory",
      "CIS v8.1": "Control 1: Inventario y Control de Activos Empresariales; Control 2: Inventario y Control de Activos de Software",
      "ISA/IEC 62443": "SR 7.8 Control system component inventory; FR 7 Resource Availability",
      "NERC CIP": "CIP-002 BES Cyber System Categorization; CIP-003 Security Management Controls",
    },
    questions: [
      { text: "¿Existe un inventario actualizado de todos los activos de hardware?", weight: 3 },
      { text: "¿Existe un inventario de software autorizado y no autorizado?", weight: 3 },
      { text: "¿Se clasifican los activos por criticidad e impacto al negocio?", weight: 2 },
      { text: "¿Se revisa y actualiza el inventario periódicamente (al menos trimestralmente)?", weight: 2 },
      { text: "¿Se incluyen activos en la nube, IoT y OT en el inventario?", weight: 2 },
    ],
    recommendations: {
      low: [
        "Implementar un inventario básico usando herramientas de descubrimiento automático (Nmap, GLPI, Snipe-IT)",
        "Clasificar activos en 3 niveles: crítico, importante, estándar",
        "Asignar responsables (owners) a cada activo crítico",
        "Documentar todos los activos de red, servidores y estaciones de trabajo",
      ],
      medium: [
        "Automatizar el descubrimiento continuo de activos con agentes o escaneo de red",
        "Integrar el inventario con la CMDB y el sistema de gestión de vulnerabilidades",
        "Incluir activos OT/ICS, IoT y servicios cloud en el inventario",
        "Establecer política de ciclo de vida de activos (adquisición, operación, decomisión)",
      ],
      high: [
        "Mantener el proceso de revisión y mejora continua",
        "Correlacionar inventario con fuentes de amenazas para priorizar protección",
        "Integrar con procesos de gestión de riesgos y continuidad de negocio",
      ],
    },
  },
  {
    id: "c1",
    number: 1,
    name: "Actualizar Periódicamente",
    shortName: "Parches",
    icon: "\uD83D\uDD04",
    description: "Proceso continuo de actualización de sistemas operativos, aplicaciones, firmware y servicios para corregir vulnerabilidades conocidas.",
    riskIfMissing: "Explotación directa de vulnerabilidades públicas (n-day), compromiso inicial sin credenciales y escalamiento rápido.",
    mitre: ["T1190 - Exploit Public-Facing Application", "T1068 - Exploitation for Privilege Escalation", "T1210 - Exploitation of Remote Services"],
    impact: ["Ransomware sin phishing", "Compromiso masivo automatizado", "Caída operacional por ataques oportunistas"],
    frameworks: {
      "ISO 27001:2022": "A.8.8 Gestión de vulnerabilidades técnicas; A.8.19 Instalación de software; A.8.32 Gestión de cambios",
      "NIST CSF 2.0": "PR.PS-1 (Patch Management); ID.RA-1 (Vulnerability Identification)",
      "NIST 800-53": "SI-2 Flaw Remediation; RA-5 Vulnerability Monitoring and Scanning; CM-3 Configuration Change Control",
      "CIS v8.1": "Control 7: Gestión Continua de Vulnerabilidades (7.1-7.7)",
      "ISA/IEC 62443": "SR 3.4 Software and information integrity; SR 7.6 Network and security configuration settings",
      "NERC CIP": "CIP-007-6 R2 Patch Management; CIP-010-4 Configuration Change Management",
    },
    questions: [
      { text: "¿Existe un proceso formal de gestión de parches con ventanas de actualización definidas?", weight: 3 },
      { text: "¿Se aplican parches críticos dentro de las primeras 72 horas de su publicación?", weight: 3 },
      { text: "¿Se realizan escaneos de vulnerabilidades periódicos (al menos mensuales)?", weight: 2 },
      { text: "¿Se incluyen en el parcheo los sistemas OT, firmware de red y aplicaciones de terceros?", weight: 2 },
      { text: "¿Existe un proceso de prueba antes de aplicar parches en producción?", weight: 2 },
    ],
    recommendations: {
      low: [
        "Implementar un calendario de parcheo mensual como mínimo",
        "Habilitar actualizaciones automáticas en endpoints donde sea posible",
        "Priorizar parches con CVSS >= 7.0 o con exploits públicos conocidos",
        "Utilizar herramientas como WSUS, SCCM, Ansible o similar para automatizar",
      ],
      medium: [
        "Reducir ventana de parches críticos a 72 horas o menos",
        "Implementar escaneo de vulnerabilidades semanal con Nessus, Qualys u OpenVAS",
        "Crear laboratorio de pruebas para validar parches antes de producción",
        "Incluir firmware de dispositivos de red y sistemas OT en el programa",
      ],
      high: [
        "Implementar parcheo virtual (IPS/WAF) para sistemas que no pueden actualizarse inmediatamente",
        "Integrar con threat intelligence para priorizar vulnerabilidades explotadas activamente",
        "Establecer métricas de cobertura y tiempo medio de remediación (MTTR)",
      ],
    },
  },
  {
    id: "c2",
    number: 2,
    name: "Capacitar Periódicamente",
    shortName: "Capacitación",
    icon: "\uD83C\uDF93",
    description: "Formación continua del personal en amenazas reales, errores comunes y responsabilidades de seguridad.",
    riskIfMissing: "El usuario se convierte en vector de ataque sin fricción.",
    mitre: ["T1566.001 - Phishing: Spearphishing Attachment", "T1566.002 - Phishing: Link", "T1204 - User Execution"],
    impact: ["Robo de credenciales", "Instalación inicial de malware", "Movimiento lateral facilitado"],
    frameworks: {
      "ISO 27001:2022": "A.6.3 Concienciación, educación y formación; A.5.4 Responsabilidades de la dirección; A.6.1 Selección",
      "NIST CSF 2.0": "PR.AT-1, PR.AT-2 (Awareness and Training)",
      "NIST 800-53": "AT-1 Policy and Procedures; AT-2 Literacy Training and Awareness; AT-3 Role-Based Training",
      "CIS v8.1": "Control 14: Concientización y Capacitación en Seguridad (14.1-14.9)",
      "ISA/IEC 62443": "SR 1.13 Security awareness training; FR 1 Identification and Authentication Control",
      "NERC CIP": "CIP-004-7 Personnel & Training (R1, R2, R3)",
    },
    questions: [
      { text: "¿Se realizan capacitaciones de ciberseguridad al menos 2 veces al año?", weight: 3 },
      { text: "¿Se ejecutan simulaciones de phishing periódicas?", weight: 2 },
      { text: "¿Existe un programa de capacitación diferenciado por roles (IT, OT, ejecutivos)?", weight: 2 },
      { text: "¿Se mide la efectividad de las capacitaciones con métricas (tasa de click, reportes)?", weight: 2 },
      { text: "¿El personal nuevo recibe inducción de seguridad antes de acceder a sistemas?", weight: 3 },
    ],
    recommendations: {
      low: [
        "Implementar capacitación básica obligatoria al menos 2 veces al año",
        "Iniciar programa de simulación de phishing mensual",
        "Crear política de uso aceptable y que todos la firmen",
        "Desarrollar material específico para amenazas del sector",
      ],
      medium: [
        "Diferenciar capacitación por rol: TI, OT, ejecutivos, contratistas",
        "Implementar métricas: tasa de clicks en phishing, reportes de incidentes",
        "Gamificar el programa con reconocimientos e incentivos",
        "Incluir escenarios de ingeniería social avanzada (vishing, pretexting)",
      ],
      high: [
        "Realizar ejercicios de red team que incluyan componente de ingeniería social",
        "Integrar capacitación continua con micro-aprendizaje semanal",
        "Publicar indicadores de cultura de seguridad a la alta dirección",
      ],
    },
  },
  {
    id: "c3",
    number: 3,
    name: "Minimizar Privilegios",
    shortName: "Privilegios",
    icon: "\uD83D\uDD12",
    description: "Asignar únicamente los permisos estrictamente necesarios y por tiempo limitado.",
    riskIfMissing: "Una cuenta comprometida equivale a control total del entorno.",
    mitre: ["T1078 - Valid Accounts", "T1068 - Privilege Escalation", "T1055 - Process Injection"],
    impact: ["Compromiso de dominio", "Bypass de controles de seguridad", "Persistencia profunda"],
    frameworks: {
      "ISO 27001:2022": "A.5.15 Control de acceso; A.5.18 Derechos de acceso; A.8.2 Acceso privilegiado; A.8.3 Restricción de acceso",
      "NIST CSF 2.0": "PR.AA-5 (Access Control); PR.AA-6 (Least Privilege)",
      "NIST 800-53": "AC-6 Least Privilege; AC-2 Account Management; AC-3 Access Enforcement; AC-5 Separation of Duties",
      "CIS v8.1": "Control 5: Gestión de Cuentas (5.1-5.6); Control 6: Gestión de Control de Acceso (6.1-6.8)",
      "ISA/IEC 62443": "SR 1.1 Human user identification and authentication; SR 2.1 Authorization enforcement; SR 1.3 Account management",
      "NERC CIP": "CIP-004-7 R4/R5 Access Management; CIP-007-6 R5 System Access Controls",
    },
    questions: [
      { text: "¿Se aplica el principio de mínimo privilegio en todas las cuentas?", weight: 3 },
      { text: "¿Las cuentas privilegiadas (admin) están separadas de las cuentas de uso diario?", weight: 3 },
      { text: "¿Se revisan los permisos periódicamente (al menos trimestralmente)?", weight: 2 },
      { text: "¿Existe un proceso de aprovisionamiento y desaprovisionamiento de cuentas?", weight: 2 },
      { text: "¿Se utiliza elevación temporal de privilegios (JIT/PAM) en lugar de acceso permanente?", weight: 2 },
    ],
    recommendations: {
      low: [
        "Eliminar cuentas de administrador innecesarias de inmediato",
        "Separar cuentas administrativas de cuentas de uso diario para todo el personal TI",
        "Implementar revisión trimestral de accesos y permisos",
        "Desactivar cuentas inactivas por más de 45 días",
      ],
      medium: [
        "Implementar solución PAM (CyberArk, BeyondTrust, Delinea) para acceso privilegiado",
        "Configurar Just-In-Time (JIT) access para tareas administrativas",
        "Segregar funciones críticas (SoD) en sistemas financieros y críticos",
        "Auditar logs de uso de cuentas privilegiadas semanalmente",
      ],
      high: [
        "Implementar modelo Zero Trust con verificación continua",
        "Automatizar certificación de accesos con workflows de aprobación",
        "Monitorear anomalías de comportamiento en cuentas privilegiadas (UEBA)",
      ],
    },
  },
  {
    id: "c4",
    number: 4,
    name: "Respaldar Información",
    shortName: "Respaldos",
    icon: "\uD83D\uDCBE",
    description: "Copias de seguridad periódicas, aisladas, probadas y con control de acceso.",
    riskIfMissing: "Pérdida irreversible de información o dependencia total del atacante.",
    mitre: ["T1486 - Data Encrypted for Impact", "T1490 - Inhibit System Recovery", "T1485 - Data Destruction"],
    impact: ["Paralización operacional", "Extorsión (doble/triple)", "Daño reputacional severo"],
    frameworks: {
      "ISO 27001:2022": "A.8.13 Copias de seguridad de la información; A.8.14 Redundancia; A.5.30 Preparación TIC para continuidad",
      "NIST CSF 2.0": "PR.DS-11 (Data Backup); RC.RP-1 (Recovery Planning)",
      "NIST 800-53": "CP-9 System Backup; CP-10 System Recovery and Reconstitution; CP-6 Alternate Storage Site",
      "CIS v8.1": "Control 11: Recuperación de Datos (11.1-11.5)",
      "ISA/IEC 62443": "SR 7.3 Control system backup; SR 7.4 Control system recovery and reconstitution",
      "NERC CIP": "CIP-009-6 Recovery Plans for BES Cyber Systems (R1, R2, R3)",
    },
    questions: [
      { text: "¿Se realizan respaldos automáticos de información crítica al menos diariamente?", weight: 3 },
      { text: "¿Los respaldos están aislados de la red de producción (air-gapped o inmutables)?", weight: 3 },
      { text: "¿Se prueban los respaldos con restauraciones periódicas (al menos trimestralmente)?", weight: 3 },
      { text: "¿Se aplica la regla 3-2-1 (3 copias, 2 medios, 1 offsite)?", weight: 2 },
      { text: "¿Los respaldos están cifrados y con control de acceso?", weight: 2 },
    ],
    recommendations: {
      low: [
        "Implementar respaldos automáticos diarios de datos críticos",
        "Aplicar regla 3-2-1: 3 copias, 2 medios distintos, 1 fuera del sitio",
        "Aislar al menos una copia de backup de la red (air-gap o almacenamiento inmutable)",
        "Realizar primera prueba de restauración para validar la integridad",
      ],
      medium: [
        "Implementar backups inmutables (WORM) como protección contra ransomware",
        "Programar pruebas de restauración trimestrales con métricas de RTO/RPO",
        "Cifrar todos los respaldos en tránsito y en reposo",
        "Documentar y probar el plan de recuperación ante desastres (DRP)",
      ],
      high: [
        "Automatizar pruebas de restauración con validación de integridad",
        "Implementar replicación geográfica para sitios de recuperación",
        "Realizar ejercicios de recuperación completa al menos anualmente",
      ],
    },
  },
  {
    id: "c5",
    number: 5,
    name: "Asegurar Redes",
    shortName: "Redes",
    icon: "\uD83C\uDF10",
    description: "Segmentación, firewalls, control de tráfico, cierre de servicios innecesarios.",
    riskIfMissing: "Movimiento lateral sin fricción y propagación rápida del ataque.",
    mitre: ["T1021 - Remote Services", "T1046 - Network Service Scanning", "T1018 - Remote System Discovery"],
    impact: ["Ataques east-west", "Compromiso en cascada", "Pérdida de control del perímetro"],
    frameworks: {
      "ISO 27001:2022": "A.8.20 Seguridad de redes; A.8.21 Seguridad de servicios de red; A.8.22 Segregación en redes",
      "NIST CSF 2.0": "PR.IR-1 (Network Security); PR.DS-1 (Data-in-Transit Protection)",
      "NIST 800-53": "SC-7 Boundary Protection; AC-4 Information Flow Enforcement; SC-8 Transmission Confidentiality",
      "CIS v8.1": "Control 12: Gestión de Infraestructura de Red (12.1-12.8); Control 13: Monitoreo y Defensa de Red",
      "ISA/IEC 62443": "SR 5.1 Network segmentation; SR 5.2 Zone boundary protection; SR 5.3 Communication restrictions",
      "NERC CIP": "CIP-005-7 Electronic Security Perimeter(s) (R1, R2); CIP-007-6 System Security Management",
    },
    questions: [
      { text: "¿La red está segmentada con VLANs, firewalls o zonas de seguridad?", weight: 3 },
      { text: "¿Existe separación entre la red TI y la red OT (si aplica)?", weight: 3 },
      { text: "¿Se han cerrado puertos y servicios innecesarios en todos los segmentos?", weight: 2 },
      { text: "¿Se utiliza cifrado (TLS/VPN) para comunicaciones críticas y acceso remoto?", weight: 2 },
      { text: "¿Existen reglas de firewall documentadas, revisadas y con principio deny-by-default?", weight: 2 },
    ],
    recommendations: {
      low: [
        "Segmentar la red en zonas: DMZ, servidores, usuarios, OT/ICS",
        "Implementar firewalls entre segmentos con reglas deny-by-default",
        "Cerrar todos los puertos y servicios no necesarios",
        "Forzar VPN para todo acceso remoto sin excepción",
      ],
      medium: [
        "Implementar modelo de zonas y conductos según ISA/IEC 62443 para OT",
        "Desplegar IDS/IPS en segmentos críticos",
        "Implementar Network Access Control (NAC) para dispositivos que se conectan",
        "Documentar y revisar reglas de firewall semestralmente",
      ],
      high: [
        "Implementar microsegmentación con políticas basadas en identidad",
        "Desplegar NDR (Network Detection and Response) para detección avanzada",
        "Realizar pruebas de penetración de red anuales con alcance TI y OT",
      ],
    },
  },
  {
    id: "c6",
    number: 6,
    name: "Asegurar Equipos",
    shortName: "Endpoints",
    icon: "\uD83D\uDCBB",
    description: "Hardening, EDR/XDR, control de aplicaciones, desactivación de macros y servicios innecesarios.",
    riskIfMissing: "Persistencia silenciosa y ejecución continua de malware.",
    mitre: ["T1059 - Command and Scripting Interpreter", "T1547 - Boot or Logon Autostart Execution", "T1053 - Scheduled Task/Job"],
    impact: ["Backdoors persistentes", "Exfiltración lenta de datos", "Dificultad extrema de erradicación"],
    frameworks: {
      "ISO 27001:2022": "A.8.1 Dispositivos de punto final; A.8.7 Protección contra malware; A.8.19 Instalación de software",
      "NIST CSF 2.0": "PR.PS-1 (Configuration Management); DE.CM-4 (Malicious Code Detection)",
      "NIST 800-53": "CM-6 Configuration Settings; CM-7 Least Functionality; SI-3 Malicious Code Protection",
      "CIS v8.1": "Control 4: Configuración Segura de Activos (4.1-4.12); Control 10: Defensas contra Malware (10.1-10.7)",
      "ISA/IEC 62443": "SR 3.2 Malicious code protection; SR 3.4 Software and information integrity",
      "NERC CIP": "CIP-007-6 R3 Malicious Code Prevention; CIP-010-4 R1 Configuration Monitoring",
    },
    questions: [
      { text: "¿Todos los endpoints tienen solución EDR/XDR activa y actualizada?", weight: 3 },
      { text: "¿Se aplican baselines de hardening (CIS Benchmarks o equivalente)?", weight: 2 },
      { text: "¿Están deshabilitadas las macros de Office en usuarios estándar?", weight: 2 },
      { text: "¿Existe control de aplicaciones (whitelisting) o restricción de ejecución?", weight: 2 },
      { text: "¿Los dispositivos móviles y BYOD tienen políticas de seguridad aplicadas (MDM)?", weight: 2 },
    ],
    recommendations: {
      low: [
        "Desplegar solución EDR en todos los endpoints (no solo antivirus tradicional)",
        "Deshabilitar macros de Office por política de grupo (GPO) para usuarios estándar",
        "Aplicar CIS Benchmarks Level 1 en sistemas operativos de escritorio y servidores",
        "Eliminar software innecesario y deshabilitar servicios no requeridos",
      ],
      medium: [
        "Implementar Application Whitelisting (AppLocker, WDAC) en sistemas críticos",
        "Desplegar solución MDM para dispositivos móviles y BYOD",
        "Configurar Device Guard y Credential Guard en Windows",
        "Implementar hardening específico para sistemas OT según ISA/IEC 62443",
      ],
      high: [
        "Implementar XDR con correlación automática de amenazas",
        "Automatizar la verificación de compliance de hardening",
        "Integrar EDR/XDR con SOAR para respuesta automatizada",
      ],
    },
  },
  {
    id: "c7",
    number: 7,
    name: "Monitorear en Tiempo Real",
    shortName: "Monitoreo",
    icon: "\uD83D\uDCCA",
    description: "Recolección, correlación y análisis continuo de eventos de seguridad.",
    riskIfMissing: "El ataque ocurre sin ser detectado durante semanas o meses.",
    mitre: ["T1071 - Application Layer Protocol", "T1041 - Exfiltration Over C2 Channel", "T1562 - Impair Defenses"],
    impact: ["Detección tardía", "Incidentes forenses incompletos", "Notificación regulatoria tardía"],
    frameworks: {
      "ISO 27001:2022": "A.8.15 Registro de eventos; A.8.16 Actividades de seguimiento; A.5.25 Evaluación de eventos de seguridad",
      "NIST CSF 2.0": "DE.CM-1, DE.CM-6 (Continuous Monitoring); DE.AE-2, DE.AE-3 (Anomaly Detection)",
      "NIST 800-53": "AU-6 Audit Log Review; SI-4 System Monitoring; IR-4 Incident Handling; AU-2 Event Logging",
      "CIS v8.1": "Control 8: Gestión de Registros de Auditoría (8.1-8.12); Control 13: Monitoreo y Defensa de Red",
      "ISA/IEC 62443": "SR 6.1 Audit log accessibility; SR 6.2 Continuous monitoring; SR 2.8 Auditable events",
      "NERC CIP": "CIP-007-6 R4 Security Event Monitoring; CIP-008-6 Incident Reporting and Response Planning",
    },
    questions: [
      { text: "¿Existe un SIEM o plataforma centralizada de correlación de logs?", weight: 3 },
      { text: "¿Se recolectan logs de fuentes críticas (AD, firewalls, VPN, email, endpoints)?", weight: 3 },
      { text: "¿Existe un SOC o equipo dedicado de monitoreo (interno o externo)?", weight: 2 },
      { text: "¿Se definen y revisan alertas de seguridad con reglas de correlación?", weight: 2 },
      { text: "¿Los logs se retienen al menos 12 meses y están protegidos contra manipulación?", weight: 2 },
    ],
    recommendations: {
      low: [
        "Implementar SIEM o plataforma de logs centralizada (Wazuh, Elastic, Splunk)",
        "Recolectar logs de: Active Directory, firewalls, VPN, email gateway, endpoints",
        "Definir al menos 20 reglas de detección basadas en MITRE ATT&CK",
        "Contratar servicio de SOC gestionado (MSSP) si no hay capacidad interna",
      ],
      medium: [
        "Configurar alertas automáticas para eventos críticos con SLA de respuesta",
        "Integrar fuentes OT en el monitoreo (si aplica)",
        "Implementar SOAR para automatizar respuesta a incidentes comunes",
        "Proteger logs con escritura inmutable y retención mínima de 12 meses",
      ],
      high: [
        "Implementar threat hunting proactivo basado en hipótesis",
        "Integrar threat intelligence feeds con el SIEM",
        "Medir MTTD (Mean Time to Detect) y MTTR (Mean Time to Respond)",
      ],
    },
  },
  {
    id: "c8",
    number: 8,
    name: "Uso de MFA",
    shortName: "MFA",
    icon: "\uD83D\uDD10",
    description: "Autenticación con más de un factor: algo que sabes, tienes o eres.",
    riskIfMissing: "Las credenciales robadas son suficientes para acceder.",
    mitre: ["T1078 - Valid Accounts", "T1556 - Modify Authentication Process", "T1110 - Brute Force"],
    impact: ["Acceso remoto no autorizado", "Compromiso de correo y VPN", "Ataques sin malware"],
    frameworks: {
      "ISO 27001:2022": "A.8.5 Autenticación segura; A.5.17 Información de autenticación; A.5.16 Gestión de identidad",
      "NIST CSF 2.0": "PR.AA-3 (Multi-Factor Authentication); PR.AA-1 (Identity Management)",
      "NIST 800-53": "IA-2(1)(2) MFA for Local/Network Access; IA-5 Authenticator Management",
      "CIS v8.1": "Control 6.3 Require MFA for Externally-Exposed Apps; 6.4 MFA for Remote Access; 6.5 MFA for Admin Access",
      "ISA/IEC 62443": "SR 1.1 Human user identification and authentication; SR 1.2 Software process and device identification",
      "NERC CIP": "CIP-007-6 R5.1 Authentication for Interactive User Access; CIP-005-7 R2 Remote Access Management",
    },
    questions: [
      { text: "¿Se utiliza MFA para acceso remoto (VPN, escritorio remoto)?", weight: 3 },
      { text: "¿Se utiliza MFA para correo electrónico y aplicaciones cloud?", weight: 3 },
      { text: "¿Todas las cuentas privilegiadas requieren MFA obligatorio?", weight: 3 },
      { text: "¿Se utiliza MFA resistente a phishing (FIDO2, smart cards) en lugar de solo SMS?", weight: 2 },
      { text: "¿Se aplica MFA en accesos a sistemas críticos internos (consolas, SCADA)?", weight: 2 },
    ],
    recommendations: {
      low: [
        "Activar MFA inmediatamente en: VPN, correo, acceso remoto y cuentas admin",
        "Preferir apps de autenticación (Microsoft/Google Authenticator) sobre SMS",
        "Definir política que prohíba acceso remoto sin MFA sin excepciones",
        "Registrar todos los accesos MFA y monitorear intentos fallidos",
      ],
      medium: [
        "Migrar a MFA resistente a phishing: FIDO2/WebAuthn, smart cards",
        "Implementar MFA adaptativo basado en riesgo (ubicación, dispositivo, comportamiento)",
        "Extender MFA a aplicaciones internas críticas y consolas de gestión",
        "Implementar número matching o push verification en lugar de simple push",
      ],
      high: [
        "Adoptar autenticación passwordless basada en FIDO2",
        "Implementar Conditional Access integrado con SIEM/UEBA",
        "Eliminar completamente SMS como segundo factor",
      ],
    },
  },
  {
    id: "c9",
    number: 9,
    name: "Gestor de Contraseñas",
    shortName: "Contraseñas",
    icon: "\uD83D\uDD11",
    description: "Herramienta para generar, almacenar y usar contraseñas únicas y robustas.",
    riskIfMissing: "Reutilización de credenciales y contraseñas débiles.",
    mitre: ["T1555 - Credentials from Password Stores", "T1003 - OS Credential Dumping", "T1110 - Credential Stuffing"],
    impact: ["Compromisos en cadena", "Ataques cruzados entre servicios", "Escalamiento silencioso"],
    frameworks: {
      "ISO 27001:2022": "A.5.17 Información de autenticación; A.8.5 Autenticación segura; A.5.15 Control de acceso",
      "NIST CSF 2.0": "PR.AA-1 (Identity Management); PR.AA-3 (Authentication)",
      "NIST 800-53": "IA-5 Authenticator Management; IA-5(1) Password-Based Authentication; IA-4 Identifier Management",
      "CIS v8.1": "Control 5.2 Use Unique Passwords; Control 5.3 Disable Dormant Accounts; Control 5.4 Restrict Admin Privileges",
      "ISA/IEC 62443": "SR 1.5 Authenticator management; SR 1.7 Strength of password-based authentication",
      "NERC CIP": "CIP-007-6 R5.2 Password Requirements; CIP-007-6 R5.3-R5.7 Authentication Controls",
    },
    questions: [
      { text: "¿Se utiliza un gestor de contraseñas corporativo (1Password, Bitwarden, KeePass)?", weight: 3 },
      { text: "¿Las contraseñas generadas tienen al menos 16 caracteres y son únicas por servicio?", weight: 2 },
      { text: "¿Se prohíbe la reutilización de contraseñas entre sistemas?", weight: 2 },
      { text: "¿Se monitorean credenciales comprometidas en breaches públicos (HaveIBeenPwned)?", weight: 2 },
      { text: "¿Existen políticas que prohíban almacenar contraseñas en texto plano?", weight: 3 },
    ],
    recommendations: {
      low: [
        "Implementar gestor de contraseñas empresarial para todo el personal",
        "Establecer política de contraseñas mínimo 16 caracteres, únicas por servicio",
        "Prohibir almacenamiento de contraseñas en texto plano, post-its o archivos",
        "Verificar credenciales corporativas contra bases de datos de breaches",
      ],
      medium: [
        "Integrar gestor de contraseñas con SSO y directorio corporativo",
        "Monitorear continuamente credenciales filtradas en la dark web",
        "Implementar rotación automática de credenciales para cuentas de servicio",
        "Desplegar solución de password vaulting para cuentas privilegiadas",
      ],
      high: [
        "Transicionar hacia autenticación passwordless donde sea posible",
        "Implementar secrets management para CI/CD y aplicaciones (HashiCorp Vault)",
        "Auditar periódicamente el uso del gestor de contraseñas y su adopción",
      ],
    },
  },
];

export const CONTEXT_RECOMMENDATIONS: Record<string, { label: string; general: string; priority: string }> = {
  ti: {
    label: "TI Corporativo",
    general: "Los 9 básicos constituyen el núcleo mínimo de un SGSI auditable conforme a ISO 27001.",
    priority: "Priorizar: Gestión de activos, MFA, Monitoreo y Respaldos como base del SGSI.",
  },
  ot: {
    label: "OT / ICS",
    general: "En entornos OT, estos controles son el punto de partida para segmentación, control de accesos industriales y detección temprana según ISA/IEC 62443.",
    priority: "Priorizar: Segmentación de redes TI-OT, Gestión de activos industriales, Parcheo con ventanas de mantenimiento.",
  },
  critica: {
    label: "Infraestructura Crítica",
    general: "Para infraestructura crítica, estos controles permiten avanzar desde cumplimiento formal (NERC CIP) hacia resiliencia operativa real. Ley 21.663 aplicable.",
    priority: "Priorizar: Cumplimiento regulatorio NERC CIP, Segmentación, Monitoreo 24/7, Plan de recuperación probado.",
  },
};

export function getMaturityLevel(score: number): MaturityLevel {
  if (score <= 25) return { label: "Crítico", min: 0, max: 25, cls: "critical", color: "#dc2626", desc: "Nivel crítico de exposición. Se requieren acciones inmediatas." };
  if (score <= 50) return { label: "Bajo", min: 26, max: 50, cls: "low", color: "#d97706", desc: "Nivel bajo de madurez. Existen brechas significativas que deben atenderse con prioridad." };
  if (score <= 75) return { label: "Medio", min: 51, max: 75, cls: "medium", color: "#0891b2", desc: "Nivel medio de madurez. Fundamentos establecidos pero se requiere fortalecimiento." };
  return { label: "Alto", min: 76, max: 100, cls: "high", color: "#059669", desc: "Nivel alto de madurez. Mantener y mejorar continuamente." };
}

export const GRADIENT_COLORS = [
  "from-indigo-500 to-indigo-700",
  "from-blue-500 to-blue-700",
  "from-cyan-500 to-cyan-700",
  "from-violet-500 to-violet-700",
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-amber-700",
  "from-red-500 to-red-700",
  "from-pink-500 to-pink-700",
  "from-teal-500 to-teal-700",
  "from-orange-500 to-orange-700",
];
