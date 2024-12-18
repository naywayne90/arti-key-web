export type EmployeeStatus = 'En poste' | 'En congés' | 'Départ';
export type ContractType = 'CDI' | 'CDD' | 'Stage';
export type EmployeeCategory = 'Agent de maîtrise' | 'Cadre débutant' | 'Cadre confirmé' | 'Cadre supérieur';
export type EmployeeSegment = 'Agent de maitrise' | 'Sous-Directeur' | 'Chef de Service' | 'Directeur' | 'Ouvrier' | 'Autre';
export type EmployeeCollege = 'A' | 'B' | 'C' | 'D';
export type EmployeeFamily = 'Support' | 'Gouvernance' | 'Métier';
export type MaritalStatus = 'Célibataire' | 'Marié(e)' | 'Divorcé(e)' | 'Veuf/Veuve';
export type PaymentMode = 'Virement bancaire' | 'Chèque' | 'Espèces';

export interface Document {
  name: string;
  url: string;
  type: string;
  uploadDate: Date;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Salary {
  base: number;
  transport: number;
  housing: number;
  other?: number;
}

export interface Employee {
  // Informations Personnelles
  id: string;
  photo: string;
  matricule: string;
  firstName: string;
  lastName: string;
  cni: {
    number: string;
    expiryDate: Date;
  };
  passport?: {
    number: string;
    issueDate: Date;
    expiryDate: Date;
  };
  gender: 'M' | 'F';
  birthDate: Date;
  nationality: string;
  location: string;

  // Coordonnées
  professionalEmail: string;
  professionalPhone: string;
  personalPhone: string;
  address: string;

  // Informations Professionnelles
  direction: string;
  college: EmployeeCollege;
  family: EmployeeFamily;
  contractType: ContractType;
  contractDuration?: string;
  category: EmployeeCategory;
  educationLevel: string;
  domain: string;
  segment: EmployeeSegment;
  status: EmployeeStatus;
  hireDate: Date;
  isCivilServant: boolean;
  departureDate?: Date;
  departureReason?: string;

  // Rémunération et Sécurité Sociale
  salary: Salary;
  paymentMode: PaymentMode;
  cnpsNumber?: string;
  ipsCgraeNumber?: string;
  insurances?: string[];

  // Situation Familiale
  maritalStatus: MaritalStatus;
  numberOfChildren: number;
  emergencyContact: EmergencyContact;

  // Documents
  documents: {
    cv?: Document;
    diplomas?: Document[];
    criminalRecord?: Document;
    medicalCertificate?: Document;
    drivingLicense?: Document;
    certifications?: Document[];
  };

  createdAt: Date;
  updatedAt: Date;
}
