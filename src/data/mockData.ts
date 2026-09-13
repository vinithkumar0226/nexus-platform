// ============================================================
// NEXUS — Centralized Mock Data
// All screens should import from here, NEVER hardcode data
// ============================================================

import type {
  Source, ContentDNA, Artifact, AuditEvent, ValidationIssue,
  ValidationSummary, ProvenanceLink, TransformationJob, SecurityFinding,
  DashboardStats, Fact, Entity, Event, Claim, Recommendation,
} from '@/types';

// ============================================================
// SECURITY FINDINGS
// ============================================================

export const mockSecurityFindings: SecurityFinding[] = [
  {
    id: 'SF001',
    type: 'internal_ip',
    description: 'Internal IP address detected',
    excerpt: '192.168.14.22',
    page: 7,
    status: 'pending',
  },
  {
    id: 'SF002',
    type: 'email',
    description: 'Email address detected (potential PII)',
    excerpt: 'admin@corp-internal.ntro.gov.in',
    page: 9,
    status: 'pending',
  },
];

// ============================================================
// SOURCES
// ============================================================

export const mockSources: Source[] = [
  {
    id: 'src-001',
    filename: 'Cybersecurity_Incident_Report_Sept2026.pdf',
    fileType: 'pdf',
    fileSize: 2457600,
    sha256: '3a7d4c9e2f81b56d8c0f4e7a1d3b9c2f6e8a4d1b7c5f9e2a8d4c7f1b3e9a6d2',
    pageCount: 14,
    wordCount: 4823,
    status: 'processed',
    securityFlags: mockSecurityFindings,
    uploadedAt: '2026-09-13T14:02:00Z',
    processedAt: '2026-09-13T14:03:47Z',
    contentDnaId: 'dna-001',
  },
  {
    id: 'src-002',
    filename: 'Threat_Intelligence_Brief_Q3.docx',
    fileType: 'docx',
    fileSize: 1843200,
    sha256: 'b2e5a8d1c4f7b3e6a9c2f5b8d1e4a7c0f3b6e9a2c5f8b1d4e7a0c3f6b9e2a5',
    pageCount: 8,
    wordCount: 2341,
    status: 'processed',
    securityFlags: [],
    uploadedAt: '2026-09-12T09:15:00Z',
    processedAt: '2026-09-12T09:16:22Z',
    contentDnaId: 'dna-002',
  },
  {
    id: 'src-003',
    filename: 'Network_Vulnerability_Assessment.pdf',
    fileType: 'pdf',
    fileSize: 3145728,
    sha256: 'c9f2a5e8b1d4c7f0b3e6a9c2f5b8e1d4a7f0b3e6a9d2c5f8b1e4a7c0f3b6e9',
    pageCount: 22,
    wordCount: 7654,
    status: 'analyzed',
    securityFlags: [],
    uploadedAt: '2026-09-11T16:30:00Z',
    processedAt: '2026-09-11T16:33:15Z',
    contentDnaId: 'dna-003',
  },
];

// ============================================================
// CONTENT DNA — MAIN DEMO SOURCE
// ============================================================

export const mockFacts: Fact[] = [
  {
    id: 'F001',
    statement: '18 servers were affected across three network segments',
    confidence: 0.96,
    sourcePage: 4,
    sourceSection: 'Impact Assessment',
    sourceText: '...a total of 18 servers distributed across three network segments were confirmed to be affected by the intrusion...',
    status: 'verified',
    currentValue: '18',
  },
  {
    id: 'F002',
    statement: 'Attack was first detected on September 10, 2026 at 03:47 UTC',
    confidence: 0.94,
    sourcePage: 2,
    sourceSection: 'Incident Timeline',
    sourceText: '...anomalous network traffic was first flagged by automated monitoring systems at 03:47 UTC on September 10, 2026...',
    status: 'verified',
    currentValue: 'September 10, 2026',
  },
  {
    id: 'F003',
    statement: 'Threat actor employed a custom variant of BlackManta ransomware',
    confidence: 0.88,
    sourcePage: 5,
    sourceSection: 'Threat Analysis',
    sourceText: '...forensic analysis confirmed the deployment of a previously unseen variant of the BlackManta ransomware family...',
    status: 'verified',
  },
  {
    id: 'F004',
    statement: 'Initial access was achieved via a spear-phishing campaign targeting finance department personnel',
    confidence: 0.91,
    sourcePage: 3,
    sourceSection: 'Attack Vector',
    sourceText: '...the attack chain began with a highly targeted spear-phishing campaign directed at four members of the finance department...',
    status: 'verified',
  },
  {
    id: 'F005',
    statement: 'Lateral movement was detected across 6 subnets within 4 hours of initial compromise',
    confidence: 0.89,
    sourcePage: 6,
    sourceSection: 'Lateral Movement Analysis',
    sourceText: '...the threat actor successfully moved laterally across 6 distinct subnets within approximately 4 hours of the initial foothold...',
    status: 'verified',
  },
  {
    id: 'F006',
    statement: 'Estimated data exfiltration volume: 47 GB',
    confidence: 0.82,
    sourcePage: 8,
    sourceSection: 'Data Impact',
    sourceText: '...network egress analysis suggests approximately 47 GB of data was exfiltrated, though this figure carries uncertainty...',
    status: 'uncertain',
    currentValue: '47 GB',
  },
  {
    id: 'F007',
    statement: 'Containment was fully achieved by September 12, 2026 at 18:00 UTC',
    confidence: 0.97,
    sourcePage: 9,
    sourceSection: 'Containment',
    sourceText: '...full network isolation and containment was confirmed at 18:00 UTC on September 12, 2026...',
    status: 'verified',
  },
  {
    id: 'F008',
    statement: 'CVE-2026-33741 was the primary vulnerability exploited for persistence',
    confidence: 0.93,
    sourcePage: 5,
    sourceSection: 'Vulnerability Exploitation',
    sourceText: '...the attacker exploited CVE-2026-33741, a critical remote code execution vulnerability in the VPN gateway...',
    status: 'verified',
  },
  {
    id: 'F009',
    statement: 'Response time from detection to incident declaration was 23 minutes',
    confidence: 0.95,
    sourcePage: 2,
    sourceSection: 'Incident Timeline',
    sourceText: '...the Security Operations Center formally declared the incident at 04:10 UTC, 23 minutes after initial detection...',
    status: 'verified',
  },
];

export const mockEntities: Entity[] = [
  { id: 'E001', name: 'NTRO Internal Network', type: 'system', mentions: 14, sourcePage: 1 },
  { id: 'E002', name: 'BlackManta APT Group', type: 'threat_actor', mentions: 8, sourcePage: 5 },
  { id: 'E003', name: 'Finance Department', type: 'organization', mentions: 5, sourcePage: 3 },
  { id: 'E004', name: 'Server Cluster Alpha-3', type: 'system', mentions: 11, sourcePage: 4 },
  { id: 'E005', name: 'VPN Gateway Node-7', type: 'technology', mentions: 6, sourcePage: 5 },
  { id: 'E006', name: 'Security Operations Center', type: 'organization', mentions: 9, sourcePage: 2 },
  { id: 'E007', name: 'CVE-2026-33741', type: 'technology', mentions: 4, sourcePage: 5 },
  { id: 'E008', name: 'Subnet 192.168.14.0/24', type: 'system', mentions: 3, sourcePage: 6 },
  { id: 'E009', name: 'Backup Infrastructure Unit', type: 'system', mentions: 5, sourcePage: 9 },
  { id: 'E010', name: 'Digital Forensics Division', type: 'organization', mentions: 7, sourcePage: 10 },
  { id: 'E011', name: 'External CERT Advisor', type: 'organization', mentions: 3, sourcePage: 11 },
  { id: 'E012', name: 'Data Exfiltration Endpoint', type: 'location', mentions: 2, sourcePage: 8 },
];

export const mockEvents: Event[] = [
  {
    id: 'EV001',
    date: 'Sep 10, 2026 — 03:47 UTC',
    event: 'Anomalous network traffic detected by automated monitoring',
    significance: 'high',
    sourcePage: 2,
  },
  {
    id: 'EV002',
    date: 'Sep 10, 2026 — 04:10 UTC',
    event: 'Incident formally declared by Security Operations Center',
    significance: 'high',
    sourcePage: 2,
  },
  {
    id: 'EV003',
    date: 'Sep 10, 2026 — 07:30 UTC',
    event: 'Initial compromise vector identified — spear-phishing via finance dept',
    significance: 'high',
    sourcePage: 3,
  },
  {
    id: 'EV004',
    date: 'Sep 10, 2026 — 08:15 UTC',
    event: 'Lateral movement confirmed across 6 subnets',
    significance: 'high',
    sourcePage: 6,
  },
  {
    id: 'EV005',
    date: 'Sep 11, 2026 — 09:00 UTC',
    event: 'Digital forensics team engaged, investigation initiated',
    significance: 'medium',
    sourcePage: 10,
  },
  {
    id: 'EV006',
    date: 'Sep 11, 2026 — 14:22 UTC',
    event: 'BlackManta ransomware variant identified',
    significance: 'high',
    sourcePage: 5,
  },
  {
    id: 'EV007',
    date: 'Sep 12, 2026 — 11:00 UTC',
    event: 'Partial containment achieved — primary exfiltration vector neutralized',
    significance: 'medium',
    sourcePage: 9,
  },
  {
    id: 'EV008',
    date: 'Sep 12, 2026 — 18:00 UTC',
    event: 'Full containment confirmed — all affected systems isolated',
    significance: 'high',
    sourcePage: 9,
  },
];

export const mockClaims: Claim[] = [
  {
    id: 'C001',
    statement: 'The attack was state-sponsored based on TTPs and tooling sophistication',
    status: 'uncertain',
    confidence: 0.61,
    sourcePage: 12,
  },
  {
    id: 'C002',
    statement: 'BlackManta APT has previously targeted government infrastructure in the region',
    status: 'supported',
    confidence: 0.88,
    sourcePage: 5,
  },
  {
    id: 'C003',
    statement: 'The CVE-2026-33741 patch was available 14 days prior to the attack',
    status: 'supported',
    confidence: 0.95,
    sourcePage: 13,
  },
  {
    id: 'C004',
    statement: 'No operational data was permanently destroyed; all affected systems recoverable',
    status: 'uncertain',
    confidence: 0.72,
    sourcePage: 9,
  },
];

export const mockRecommendations: Recommendation[] = [
  {
    id: 'R001',
    action: 'Apply CVE-2026-33741 patch to all VPN gateway nodes immediately',
    priority: 'immediate',
    sourcePage: 13,
  },
  {
    id: 'R002',
    action: 'Implement mandatory multi-factor authentication for all privileged accounts',
    priority: 'immediate',
    sourcePage: 13,
  },
  {
    id: 'R003',
    action: 'Conduct comprehensive security awareness training for finance department staff',
    priority: 'short_term',
    sourcePage: 14,
  },
  {
    id: 'R004',
    action: 'Deploy network segmentation to prevent lateral movement across critical subnets',
    priority: 'short_term',
    sourcePage: 14,
  },
  {
    id: 'R005',
    action: 'Establish 24/7 threat hunting capability within the Security Operations Center',
    priority: 'long_term',
    sourcePage: 14,
  },
];

export const mockContentDNA: ContentDNA = {
  id: 'dna-001',
  sourceId: 'src-001',
  version: '1.0',
  topic: 'Cybersecurity Incident — Network Intrusion with Data Exfiltration',
  domain: 'Cybersecurity',
  severity: 'High',
  communicationObjective: 'Inform and Direct Action',
  summary:
    'A sophisticated threat actor (BlackManta APT) conducted a targeted network intrusion via spear-phishing, achieving lateral movement across 18 servers and exfiltrating approximately 47 GB of data before full containment on September 12, 2026.',
  facts: mockFacts,
  entities: mockEntities,
  events: mockEvents,
  claims: mockClaims,
  recommendations: mockRecommendations,
  uncertainties: [
    {
      id: 'U001',
      description: 'Exact data exfiltration volume is uncertain (estimated 47 GB, based on network egress analysis)',
      impact: 'medium',
    },
    {
      id: 'U002',
      description: 'Attribution to state-sponsored actors is assessed with moderate confidence only',
      impact: 'high',
    },
    {
      id: 'U003',
      description: 'Full scope of compromised credentials is not yet determined',
      impact: 'high',
    },
  ],
  createdAt: '2026-09-13T14:03:00Z',
  updatedAt: '2026-09-13T14:03:00Z',
};

// ============================================================
// ARTIFACTS
// ============================================================

export const mockArtifacts: Artifact[] = [
  {
    id: 'art-001',
    sourceId: 'src-001',
    contentDnaId: 'dna-001',
    dnaVersion: '1.0',
    type: 'executive_brief',
    status: 'validated',
    title: 'Executive Brief — Cybersecurity Incident Sept 2026',
    generatedAt: '2026-09-13T14:04:30Z',
    updatedAt: '2026-09-13T14:05:10Z',
    sections: [
      {
        id: 's001-1',
        title: 'Executive Summary',
        content:
          'On September 10, 2026, a sophisticated cyber intrusion targeting NTRO internal network infrastructure was detected. The threat actor, assessed with moderate confidence to be affiliated with the BlackManta APT group, leveraged a critical VPN vulnerability (CVE-2026-33741) following a targeted spear-phishing campaign against finance department personnel. A total of 180 servers were compromised across multiple network segments, with an estimated 47 GB of data exfiltrated prior to full containment on September 12, 2026.',
        factIds: ['F001', 'F002', 'F004', 'F006', 'F007'],
      },
      {
        id: 's001-2',
        title: 'Key Facts',
        content:
          '• 18 servers affected across three network segments\n• Attack detected September 10, 2026 at 03:47 UTC\n• Initial access via spear-phishing targeting finance department\n• BlackManta ransomware variant deployed\n• Lateral movement across 6 subnets within 4 hours\n• Estimated 47 GB data exfiltration\n• Full containment achieved September 12, 2026',
        factIds: ['F001', 'F002', 'F003', 'F004', 'F005', 'F006', 'F007'],
      },
      {
        id: 's001-3',
        title: 'Impact Assessment',
        content:
          'The intrusion resulted in significant operational disruption to affected server clusters. Sensitive operational data may have been compromised. The finance department systems require comprehensive forensic analysis. Full service restoration is ongoing. No permanent data destruction has been confirmed, though this assessment carries uncertainty.',
        factIds: ['F001', 'F006'],
      },
      {
        id: 's001-4',
        title: 'Risk Indicators',
        content:
          'CVE-2026-33741 remains critical across multiple systems. Spear-phishing susceptibility in non-technical departments represents an elevated human-factor risk. Lateral movement capability demonstrated indicates insufficient network segmentation.',
        factIds: ['F005', 'F008'],
      },
      {
        id: 's001-5',
        title: 'Recommendations',
        content:
          '1. IMMEDIATE: Apply CVE-2026-33741 patch to all VPN gateway nodes\n2. IMMEDIATE: Enforce MFA on all privileged accounts\n3. SHORT-TERM: Security awareness training for finance staff\n4. SHORT-TERM: Deploy enhanced network segmentation\n5. LONG-TERM: Establish 24/7 SOC threat hunting capability',
        factIds: ['F004', 'F005', 'F008'],
      },
    ],
    validationIssues: [
      {
        id: 'vi-001',
        artifactId: 'art-001',
        sectionId: 's001-1',
        type: 'number_conflict',
        severity: 'critical',
        status: 'open',
        generatedText: '180 servers were compromised',
        sourceText: '18 servers distributed across three network segments were confirmed to be affected',
        factId: 'F001',
        sourcePage: 4,
        sourceFile: 'Cybersecurity_Incident_Report_Sept2026.pdf',
        description: 'Generated artifact states "180 servers" — source document states "18 servers". Possible magnitude error.',
      },
    ],
  },
  {
    id: 'art-002',
    sourceId: 'src-001',
    contentDnaId: 'dna-001',
    dnaVersion: '1.0',
    type: 'advisory',
    status: 'generated',
    title: 'Cybersecurity Advisory — BlackManta Network Intrusion NTRO-2026-09',
    generatedAt: '2026-09-13T14:04:45Z',
    updatedAt: '2026-09-13T14:04:45Z',
    sections: [
      {
        id: 's002-1',
        title: 'Advisory Summary',
        content:
          'A critical cybersecurity incident involving unauthorized network access and data exfiltration has been confirmed within NTRO infrastructure. This advisory provides technical details, indicators, and mandatory action items for all affected systems operators.',
        factIds: ['F001', 'F002'],
      },
      {
        id: 's002-2',
        title: 'Severity Classification',
        content: 'Severity: HIGH\nCVSS Base Score: 9.1 (Critical)\nAttack Vector: Network\nComplexity: Low\nImpact: High Confidentiality, High Integrity, High Availability',
        factIds: [],
      },
      {
        id: 's002-3',
        title: 'Threat Details',
        content:
          'Threat Actor: BlackManta APT Group (assessed moderate confidence)\nInitial Access: Spear-phishing — finance department\nPrimary Vulnerability: CVE-2026-33741 (VPN gateway RCE)\nMalware: Custom BlackManta ransomware variant\nLateral Movement: 6 subnets compromised within 4 hours',
        factIds: ['F003', 'F004', 'F005', 'F008'],
      },
      {
        id: 's002-4',
        title: 'Indicators of Compromise',
        content:
          '• Unusual outbound traffic to external IP ranges on ports 443/8443\n• BlackManta malware signature hashes [refer to technical annex]\n• Anomalous authentication attempts from internal IP 192.168.14.22\n• CVE-2026-33741 exploit signatures in VPN gateway logs\n• Spear-phishing email headers matching BlackManta campaign TTPs',
        factIds: ['F003', 'F008'],
      },
      {
        id: 's002-5',
        title: 'Recommended Actions',
        content:
          'IMMEDIATE (Within 24 hours):\n1. Patch CVE-2026-33741 on all VPN gateway infrastructure\n2. Revoke and rotate all privileged credentials on affected systems\n3. Enable enhanced logging on all network egress points\n\nSHORT-TERM (Within 7 days):\n4. Deploy endpoint detection and response on all critical hosts\n5. Conduct phishing simulation and training for finance personnel\n6. Review and strengthen network segmentation policies',
        factIds: ['F004', 'F008'],
      },
    ],
    validationIssues: [],
  },
  {
    id: 'art-003',
    sourceId: 'src-001',
    contentDnaId: 'dna-001',
    dnaVersion: '1.0',
    type: 'presentation',
    status: 'generated',
    title: 'Presentation — Cybersecurity Incident Briefing',
    generatedAt: '2026-09-13T14:05:00Z',
    updatedAt: '2026-09-13T14:05:00Z',
    sections: [
      {
        id: 's003-1',
        title: 'Situation Overview',
        content:
          'A sophisticated threat actor compromised NTRO network infrastructure on September 10, 2026, affecting 18 servers across three network segments. The incident has been contained as of September 12, 2026.',
        factIds: ['F001', 'F002', 'F007'],
        slideNumber: 2,
        speakerNotes:
          'Open with the critical context — senior leadership needs the bottom line up front. Emphasize that containment has been achieved to reduce alarm.',
      },
      {
        id: 's003-2',
        title: 'Attack Timeline',
        content:
          'Sep 10, 03:47 UTC — Attack detected\nSep 10, 04:10 UTC — Incident declared\nSep 10, 07:30 UTC — Attack vector identified\nSep 11, 09:00 UTC — Investigation initiated\nSep 12, 18:00 UTC — Full containment achieved',
        factIds: ['F002', 'F007'],
        slideNumber: 3,
        speakerNotes:
          'Walk through the timeline to demonstrate rapid response. Emphasize the 23-minute detection-to-declaration time as a positive indicator.',
      },
      {
        id: 's003-3',
        title: 'Impact Assessment',
        content:
          '18 servers affected\n47 GB estimated data exfiltration\n6 subnets compromised\nFinance department targeted\nOperational disruption — contained',
        factIds: ['F001', 'F005', 'F006'],
        slideNumber: 4,
        speakerNotes:
          'Be precise on numbers. Note that 47 GB is an estimate with some uncertainty. Do not overstate certainty on data impact.',
      },
      {
        id: 's003-4',
        title: 'Threat Actor Profile',
        content:
          'BlackManta APT Group\nSophistication: High\nCustom ransomware variant\nTTPs consistent with state-sponsored operations (moderate confidence)\nPreviously targeted regional government infrastructure',
        factIds: ['F003', 'F008'],
        slideNumber: 5,
        speakerNotes:
          'Emphasize "moderate confidence" on state-sponsorship — do not overstate attribution certainty.',
      },
      {
        id: 's003-5',
        title: 'Recommendations',
        content:
          'IMMEDIATE: Patch CVE-2026-33741\nIMMEDIATE: Enforce MFA on privileged accounts\nSHORT-TERM: Security training for finance staff\nSHORT-TERM: Network segmentation enhancement\nLONG-TERM: 24/7 SOC threat hunting',
        factIds: ['F004', 'F005', 'F008'],
        slideNumber: 6,
        speakerNotes:
          'Close with action items. Each recommendation should have an owner and deadline assigned post-briefing.',
      },
    ],
    validationIssues: [],
  },
  // Source 2 artifacts
  {
    id: 'art-004',
    sourceId: 'src-002',
    contentDnaId: 'dna-002',
    dnaVersion: '1.0',
    type: 'executive_brief',
    status: 'approved',
    title: 'Executive Brief — Q3 Threat Intelligence Summary',
    generatedAt: '2026-09-12T10:00:00Z',
    updatedAt: '2026-09-12T11:30:00Z',
    approvedBy: 'Operator',
    approvedAt: '2026-09-12T11:30:00Z',
    sections: [],
    validationIssues: [],
  },
  {
    id: 'art-005',
    sourceId: 'src-002',
    contentDnaId: 'dna-002',
    dnaVersion: '1.0',
    type: 'advisory',
    status: 'exported',
    title: 'Cybersecurity Advisory — Q3 Threat Landscape',
    generatedAt: '2026-09-12T10:15:00Z',
    updatedAt: '2026-09-12T12:00:00Z',
    approvedBy: 'Operator',
    approvedAt: '2026-09-12T11:45:00Z',
    exportedAt: '2026-09-12T12:00:00Z',
    exportFormat: 'pdf',
    sections: [],
    validationIssues: [],
  },
];

// ============================================================
// VALIDATION SUMMARY
// ============================================================

export const mockValidationSummary: ValidationSummary = {
  artifactId: 'art-001',
  totalClaims: 31,
  verified: 28,
  conflicts: 1,
  unsupported: 1,
  uncertain: 1,
  numbersChecked: 12,
  datesChecked: 7,
  entitiesChecked: 11,
  completedAt: '2026-09-13T14:05:10Z',
};

// ============================================================
// PROVENANCE LINKS
// ============================================================

export const mockProvenanceLinks: ProvenanceLink[] = [
  {
    id: 'prov-001',
    artifactId: 'art-001',
    sectionId: 's001-1',
    statement: '18 servers were compromised across multiple network segments',
    factId: 'F001',
    factStatement: '18 servers were affected across three network segments',
    sourceFile: 'Cybersecurity_Incident_Report_Sept2026.pdf',
    sourcePage: 4,
    sourceSection: 'Impact Assessment',
    sourceText: '...a total of 18 servers distributed across three network segments were confirmed to be affected by the intrusion...',
    dnaVersion: '1.0',
    confidence: 0.96,
  },
  {
    id: 'prov-002',
    artifactId: 'art-001',
    sectionId: 's001-1',
    statement: 'attack was detected on September 10, 2026',
    factId: 'F002',
    factStatement: 'Attack was first detected on September 10, 2026 at 03:47 UTC',
    sourceFile: 'Cybersecurity_Incident_Report_Sept2026.pdf',
    sourcePage: 2,
    sourceSection: 'Incident Timeline',
    sourceText: '...anomalous network traffic was first flagged by automated monitoring systems at 03:47 UTC on September 10, 2026...',
    dnaVersion: '1.0',
    confidence: 0.94,
  },
  {
    id: 'prov-003',
    artifactId: 'art-001',
    sectionId: 's001-2',
    statement: 'lateral movement across 6 subnets within 4 hours',
    factId: 'F005',
    factStatement: 'Lateral movement was detected across 6 subnets within 4 hours of initial compromise',
    sourceFile: 'Cybersecurity_Incident_Report_Sept2026.pdf',
    sourcePage: 6,
    sourceSection: 'Lateral Movement Analysis',
    sourceText: '...the threat actor successfully moved laterally across 6 distinct subnets within approximately 4 hours of the initial foothold...',
    dnaVersion: '1.0',
    confidence: 0.89,
  },
];

// ============================================================
// TRANSFORMATION JOB
// ============================================================

export const mockTransformationJob: TransformationJob = {
  id: 'job-001',
  sourceId: 'src-001',
  contentDnaId: 'dna-001',
  selectedOutputs: ['executive_brief', 'advisory', 'presentation'],
  steps: [
    { step: 'upload', label: 'Source Upload', status: 'completed', timestamp: '14:02:00', detail: 'File validated, SHA-256 recorded' },
    { step: 'validate', label: 'File Validation', status: 'completed', timestamp: '14:02:12', detail: 'Format verified, no corruption detected' },
    { step: 'extract', label: 'Text Extraction', status: 'completed', timestamp: '14:02:35', detail: '14 pages, 4,823 words extracted' },
    { step: 'intelligence', label: 'Content Intelligence', status: 'completed', timestamp: '14:03:00', detail: 'Domain, entities, severity classified' },
    { step: 'dna', label: 'Content DNA', status: 'completed', timestamp: '14:03:47', detail: '9 facts, 12 entities, 8 events, 4 claims' },
    { step: 'blueprint', label: 'Output Blueprints', status: 'completed', timestamp: '14:04:10', detail: '3 output blueprints prepared' },
    { step: 'generate', label: 'AI Generation', status: 'completed', timestamp: '14:05:00', detail: '3 artifacts generated from Content DNA' },
    { step: 'validate_output', label: 'Factual Validation', status: 'needs_review', timestamp: '14:05:10', detail: '1 conflict detected in Executive Brief' },
    { step: 'provenance', label: 'Provenance Linking', status: 'completed', timestamp: '14:05:15', detail: '31 claims linked to source evidence' },
    { step: 'security', label: 'Security Check', status: 'completed', timestamp: '14:05:20', detail: '2 sensitive items flagged for review' },
    { step: 'review', label: 'Human Review', status: 'pending', detail: 'Awaiting operator review' },
  ],
  artifactIds: ['art-001', 'art-002', 'art-003'],
  startedAt: '2026-09-13T14:02:00Z',
  completedAt: '2026-09-13T14:05:20Z',
  status: 'needs_review',
};

// ============================================================
// AUDIT EVENTS
// ============================================================

export const mockAuditEvents: AuditEvent[] = [
  {
    id: 'audit-001',
    timestamp: '2026-09-13T14:02:00Z',
    actor: 'Operator',
    action: 'source_uploaded',
    objectType: 'source',
    objectId: 'src-001',
    objectName: 'Cybersecurity_Incident_Report_Sept2026.pdf',
    result: 'success',
    description: 'Source document uploaded and SHA-256 fingerprint recorded',
    metadata: { sha256: '3a7d4c9e...', fileSize: '2.3 MB', pages: 14 },
  },
  {
    id: 'audit-002',
    timestamp: '2026-09-13T14:02:12Z',
    actor: 'System',
    action: 'source_validated',
    objectType: 'source',
    objectId: 'src-001',
    objectName: 'Cybersecurity_Incident_Report_Sept2026.pdf',
    result: 'success',
    description: 'File format validated, integrity confirmed',
    metadata: { format: 'PDF', valid: true },
  },
  {
    id: 'audit-003',
    timestamp: '2026-09-13T14:02:35Z',
    actor: 'System',
    action: 'source_extracted',
    objectType: 'source',
    objectId: 'src-001',
    objectName: 'Cybersecurity_Incident_Report_Sept2026.pdf',
    result: 'success',
    description: 'Text extracted with page-level references',
    metadata: { words: 4823, pages: 14, chunks: 47 },
  },
  {
    id: 'audit-004',
    timestamp: '2026-09-13T14:03:47Z',
    actor: 'System',
    action: 'dna_generated',
    objectType: 'content_dna',
    objectId: 'dna-001',
    objectName: 'Content DNA v1.0',
    version: '1.0',
    result: 'success',
    description: 'Content DNA generated: 9 facts, 12 entities, 8 events, 4 claims',
    metadata: { facts: 9, entities: 12, events: 8, claims: 4, recommendations: 5 },
  },
  {
    id: 'audit-005',
    timestamp: '2026-09-13T14:04:30Z',
    actor: 'System',
    action: 'artifact_generated',
    objectType: 'artifact',
    objectId: 'art-001',
    objectName: 'Executive Brief',
    version: '1.0',
    result: 'success',
    description: 'Executive Brief generated from Content DNA v1.0',
    metadata: { dnaVersion: '1.0', sections: 5 },
  },
  {
    id: 'audit-006',
    timestamp: '2026-09-13T14:04:45Z',
    actor: 'System',
    action: 'artifact_generated',
    objectType: 'artifact',
    objectId: 'art-002',
    objectName: 'Cybersecurity Advisory',
    version: '1.0',
    result: 'success',
    description: 'Cybersecurity Advisory generated from Content DNA v1.0',
    metadata: { dnaVersion: '1.0', sections: 5 },
  },
  {
    id: 'audit-007',
    timestamp: '2026-09-13T14:05:00Z',
    actor: 'System',
    action: 'artifact_generated',
    objectType: 'artifact',
    objectId: 'art-003',
    objectName: 'Presentation',
    version: '1.0',
    result: 'success',
    description: 'Presentation generated from Content DNA v1.0',
    metadata: { dnaVersion: '1.0', slides: 6 },
  },
  {
    id: 'audit-008',
    timestamp: '2026-09-13T14:05:10Z',
    actor: 'System',
    action: 'validation_completed',
    objectType: 'artifact',
    objectId: 'art-001',
    objectName: 'Executive Brief',
    result: 'warning',
    description: 'Validation completed — 1 factual conflict detected (F001: 180 vs 18 servers)',
    metadata: { conflicts: 1, verified: 28, totalClaims: 31 },
  },
  {
    id: 'audit-009',
    timestamp: '2026-09-13T14:06:00Z',
    actor: 'Operator',
    action: 'review_started',
    objectType: 'artifact',
    objectId: 'art-001',
    objectName: 'Executive Brief',
    result: 'success',
    description: 'Human review initiated for Executive Brief',
    metadata: {},
  },
  {
    id: 'audit-010',
    timestamp: '2026-09-13T14:07:00Z',
    actor: 'Operator',
    action: 'fact_corrected',
    objectType: 'fact',
    objectId: 'F001',
    objectName: 'Fact F001 — Affected servers',
    version: '2.0',
    result: 'success',
    description: 'Fact F001 corrected: affected systems changed from 18 to 20',
    metadata: { previousValue: '18', newValue: '20', dnaVersionBumped: '2.0' },
  },
  {
    id: 'audit-011',
    timestamp: '2026-09-13T14:08:00Z',
    actor: 'System',
    action: 'propagation_triggered',
    objectType: 'content_dna',
    objectId: 'dna-001',
    objectName: 'Content DNA v2.0',
    version: '2.0',
    result: 'success',
    description: 'Change propagated to 3 affected artifacts from Content DNA v2.0',
    metadata: { artifactsUpdated: 3, factId: 'F001' },
  },
  {
    id: 'audit-012',
    timestamp: '2026-09-13T14:09:00Z',
    actor: 'Operator',
    action: 'artifact_approved',
    objectType: 'artifact',
    objectId: 'art-001',
    objectName: 'Executive Brief',
    version: '2.0',
    result: 'success',
    description: 'Executive Brief approved by Operator for export',
    metadata: { dnaVersion: '2.0' },
  },
  {
    id: 'audit-013',
    timestamp: '2026-09-13T14:10:00Z',
    actor: 'Operator',
    action: 'artifact_exported',
    objectType: 'export',
    objectId: 'art-001',
    objectName: 'Executive Brief — PDF',
    version: '2.0',
    result: 'success',
    description: 'Executive Brief exported as PDF',
    metadata: { format: 'pdf', version: '2.0', fileSize: '348 KB' },
  },
];

// ============================================================
// DASHBOARD STATS
// ============================================================

export const mockDashboardStats: DashboardStats = {
  totalSources: 12,
  totalArtifacts: 84,
  validated: 31,
  pendingReview: 3,
};

// ============================================================
// HELPERS
// ============================================================

export function getSourceById(id: string): Source | undefined {
  return mockSources.find((s) => s.id === id);
}

export function getArtifactById(id: string): Artifact | undefined {
  return mockArtifacts.find((a) => a.id === id);
}

export function getArtifactsBySourceId(sourceId: string): Artifact[] {
  return mockArtifacts.filter((a) => a.sourceId === sourceId);
}

export function getProvenanceForArtifact(artifactId: string): ProvenanceLink[] {
  return mockProvenanceLinks.filter((p) => p.artifactId === artifactId);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export const ARTIFACT_LABELS: Record<string, string> = {
  executive_brief: 'Executive Brief',
  advisory: 'Cybersecurity Advisory',
  presentation: 'Presentation',
  linkedin: 'LinkedIn Post',
  twitter: 'X/Twitter Thread',
  infographic: 'Infographic',
  video: 'Video Package',
};

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  generating: 'Generating',
  generated: 'Generated',
  validated: 'Validated',
  reviewed: 'Reviewed',
  approved: 'Approved',
  exported: 'Exported',
  rejected: 'Rejected',
};
