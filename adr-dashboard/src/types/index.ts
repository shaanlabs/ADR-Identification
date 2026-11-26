export interface Case {
  CaseID: string;
  Age: number;
  Sex: string;
  SuspectProduct: string;
  Dose: string;
  Route: string;
  Indication: string;
  Reaction: string;
  OnsetDays: number;
  ExpectednessReference: 'Known' | 'Unexpected';
  Seriousness: 'Not serious' | 'Medically important' | 'Hospitalisation';
  Dechallenge: 'Positive' | 'Negative' | 'Unknown' | 'Not done';
  Rechallenge: 'Positive' | 'Negative' | 'Unknown' | 'Not done';
  ConcomitantMedicines: string;
  Reporter: 'Consumer' | 'Pharmacist' | 'Physician';
  Narrative: string;
}

export interface CausalityResult {
  category: 'Certain' | 'Probable' | 'Possible' | 'Unlikely' | 'Conditional/Unassessable';
  score: number;
  color: string;
  rationale: string[];
}

export interface DrugProfile {
  name: string;
  cases: Case[];
  avgOnset: number;
  reactions: string[];
  seriousCount: number;
  unexpectedCount: number;
}

export type TabId = 'cases' | 'analytics' | 'drugs' | 'causality' | 'fieldguide' | 'report';
