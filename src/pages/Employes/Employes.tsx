import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Employee } from '../../types/employee';
import EmployeeForm from './EmployeeForm';

const mockEmployees: Employee[] = [
  {
    matricule: 'EMP001',
    nom: 'Doe',
    prenoms: 'John',
    dateNaissance: '1990-01-01',
    sexe: 'Homme',
    email: 'john.doe@arti.ci',
    direction: 'IT',
    nomDirection: 'Direction des Systèmes d\'Information',
    posteOccupe: 'Développeur',
    niveau: 'Senior',
    college: 'A',
    domaine: 'Technique',
    familleMetier: 'Développement',
    segmentPoste: 'Technique',
    categorie: 'Cadre',
    codeCategorie: 'C1',
    localisation: 'Abidjan',
    dateEmbauche: '2020-01-01',
    typeContrat: 'CDI',
    fonctionnaire: false,
    statutActuel: 'En poste',
  },
];

export default function Employes() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleOpenDialog = () => {
    setSelectedEmployee(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmployee(null);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setOpenDialog(true);
  };

  const handleDeleteEmployee = (matricule: string) => {
    setEmployees(employees.filter((emp) => emp.matricule !== matricule));
  };

  const handleSubmit = (values: Employee) => {
    if (selectedEmployee) {
      setEmployees(
        employees.map((emp) =>
          emp.matricule === selectedEmployee.matricule ? values : emp
        )
      );
    } else {
      setEmployees([...employees, values]);
    }
    handleCloseDialog();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Gestion des employés</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Nouvel employé
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Matricule</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Prénoms</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Direction</TableCell>
              <TableCell>Poste</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.matricule}>
                <TableCell>{employee.matricule}</TableCell>
                <TableCell>{employee.nom}</TableCell>
                <TableCell>{employee.prenoms}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.direction}</TableCell>
                <TableCell>{employee.posteOccupe}</TableCell>
                <TableCell>{employee.statutActuel}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleEditEmployee(employee)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteEmployee(employee.matricule)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <EmployeeForm
            initialValues={selectedEmployee || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCloseDialog}
          />
        </Box>
      </Dialog>
    </Box>
  );
}
