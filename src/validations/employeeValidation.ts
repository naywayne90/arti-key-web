import * as Yup from 'yup';
import { EMPLOYEE_CATEGORIES, EDUCATION_LEVELS } from '../constants/employeeConstants';

export const employeeValidationSchema = Yup.object().shape({
  // Personal Information
  firstName: Yup.string().required('Le prénom est requis'),
  lastName: Yup.string().required('Le nom est requis'),
  
  // Professional Information
  direction: Yup.string().required('La direction est requise'),
  category: Yup.string()
    .oneOf(EMPLOYEE_CATEGORIES, 'Catégorie invalide')
    .required('La catégorie est requise'),
  posteOccupe: Yup.string().required('Le poste occupé est requis'),
  educationLevel: Yup.string()
    .oneOf(EDUCATION_LEVELS, 'Niveau d\'études invalide')
    .required('Le niveau d\'études est requis'),
  
  // Add other validations as needed
});
