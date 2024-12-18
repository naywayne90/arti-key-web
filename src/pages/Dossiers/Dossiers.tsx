import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Archive as ArchiveIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Document } from '../../types';
import DocumentForm from './DocumentForm';
import { storage } from '../../config/firebase';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export default function Dossiers() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery<Document[]>('documents', async () => {
    const response = await axios.get(`${API_URL}/dossiers`);
    return response.data;
  });

  const uploadFile = async (file: File, employeeId: string) => {
    const fileName = `${employeeId}/${Date.now()}_${file.name}`;
    const fileRef = storage.ref().child(fileName);
    await fileRef.put(file);
    return fileRef.getDownloadURL();
  };

  const createMutation = useMutation(
    async ({ file, data }: { file: File; data: Partial<Document> }) => {
      const fileUrl = await uploadFile(file, data.employeeId!);
      return axios.post(`${API_URL}/dossiers`, { ...data, fileUrl });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('documents');
        setOpenDialog(false);
      },
    }
  );

  const archiveMutation = useMutation(
    (documentId: string) =>
      axios.patch(`${API_URL}/dossiers/${documentId}`, { status: 'ARCHIVE' }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('documents');
      },
    }
  );

  const handleSubmit = async (document: Partial<Document>, file: File) => {
    createMutation.mutate({ file, data: document });
  };

  const handleDownload = async (document: Document) => {
    try {
      const response = await fetch(document.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleArchive = (documentId: string) => {
    archiveMutation.mutate(documentId);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Dossiers Administratifs</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Nouveau Document
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Employé</TableCell>
              <TableCell>Date d'ajout</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents?.map((document) => (
              <TableRow key={document.id}>
                <TableCell>
                  <Chip label={document.type} color="primary" size="small" />
                </TableCell>
                <TableCell>{document.nom}</TableCell>
                <TableCell>{document.description}</TableCell>
                <TableCell>{document.employeeId}</TableCell>
                <TableCell>
                  {format(new Date(document.createdAt), 'dd MMMM yyyy', {
                    locale: fr,
                  })}
                </TableCell>
                <TableCell>
                  <Chip
                    label={document.status}
                    color={document.status === 'ACTIF' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleDownload(document)}
                    size="small"
                    title="Télécharger"
                  >
                    <DownloadIcon />
                  </IconButton>
                  {document.status === 'ACTIF' && (
                    <IconButton
                      onClick={() => handleArchive(document.id)}
                      size="small"
                      title="Archiver"
                    >
                      <ArchiveIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DocumentForm onSubmit={handleSubmit} onCancel={() => setOpenDialog(false)} />
      </Dialog>
    </Box>
  );
}
