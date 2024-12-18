import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Employes from './pages/Employes/Employes';
import CongesAbsences from './pages/CongesAbsences/CongesAbsences';
import GestionCarrieres from './pages/GestionCarrieres/GestionCarrieres';
import ParcAuto from './pages/ParcAuto/ParcAuto';
import Formations from './pages/Formations/Formations';
import Performances from './pages/Performances/Performances';
import GestionDossiersAdministratifs from './pages/GestionDossiersAdministratifs/GestionDossiersAdministratifs';
import Pointage from './pages/Pointage/Pointage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employes/*" element={<Employes />} />
          <Route path="/conges/*" element={<CongesAbsences />} />
          <Route path="/carrieres/*" element={<GestionCarrieres />} />
          <Route path="/parc-auto/*" element={<ParcAuto />} />
          <Route path="/formations/*" element={<Formations />} />
          <Route path="/performances/*" element={<Performances />} />
          <Route path="/dossiers/*" element={<GestionDossiersAdministratifs />} />
          <Route path="/pointage/*" element={<Pointage />} />
        </Routes>
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
