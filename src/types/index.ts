// Types communs
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Types Employés
export interface Employee extends BaseEntity {
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: Date;
  dateEmbauche: Date;
  poste: string;
  departement: string;
  status: 'ACTIF' | 'INACTIF';
  adresse: string;
  photo?: string;
}

// Types Congés
export interface Conge extends BaseEntity {
  employeeId: string;
  typeConge: 'ANNUEL' | 'MALADIE' | 'SPECIAL';
  dateDebut: Date;
  dateFin: Date;
  motif: string;
  status: 'EN_ATTENTE' | 'APPROUVE' | 'REFUSE';
  approuvePar?: string;
  dateApprobation?: Date;
  commentaire?: string;
}

// Types Carrière
export interface Evolution extends BaseEntity {
  employeeId: string;
  type: 'PROMOTION' | 'MUTATION' | 'AUGMENTATION';
  dateEvolution: Date;
  ancienPoste?: string;
  nouveauPoste?: string;
  ancienSalaire?: number;
  nouveauSalaire?: number;
  commentaire: string;
}

// Types Parc Auto
export interface Vehicule extends BaseEntity {
  marque: string;
  modele: string;
  immatriculation: string;
  annee: number;
  status: 'DISPONIBLE' | 'ASSIGNE' | 'MAINTENANCE';
  kilometrage: number;
  dernierEntretien?: Date;
}

// Types Formation
export interface Formation extends BaseEntity {
  titre: string;
  description: string;
  formateur: string;
  dateDebut: Date;
  dateFin: Date;
  lieu: string;
  capacite: number;
  status: 'PLANIFIE' | 'EN_COURS' | 'TERMINE';
  participants: string[];
}

// Types Performance
export interface Evaluation extends BaseEntity {
  employeeId: string;
  periode: string;
  objectifs: {
    description: string;
    poids: number;
    realisation: number;
  }[];
  competences: {
    nom: string;
    niveau: number;
    commentaire: string;
  }[];
  noteGlobale: number;
  status: 'EN_COURS' | 'SOUMIS' | 'VALIDE';
  commentaire: string;
}

// Types Dossier
export interface Document extends BaseEntity {
  employeeId: string;
  type: 'CONTRAT' | 'CV' | 'DIPLOME' | 'AUTRE';
  nom: string;
  description: string;
  fileUrl: string;
  fileName: string;
  status: 'ACTIF' | 'ARCHIVE';
}

// Types Pointage
export interface Pointage extends BaseEntity {
  employeeId: string;
  typePointage: 'ENTREE' | 'SORTIE';
  datePointage: Date;
  status: 'VALIDE' | 'CORRIGE';
  commentaire?: string;
}

// Types Notification
export interface Notification extends BaseEntity {
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  titre: string;
  message: string;
  destinataireId: string;
  lu: boolean;
  dateExpiration?: Date;
}
