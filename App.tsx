
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { GeminiConfigProvider } from './context/GeminiConfigContext';
import { MainLayout } from './components/Layout/MainLayout';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { NovaProvaPage } from './pages/NovaProvaPage';
import { ListaProvasPage } from './pages/ListaProvasPage';
import { ProvaDetalhePage } from './pages/ProvaDetalhePage';
import { InstrucoesPage } from './pages/InstrucoesPage';

const App: React.FC = () => {
  return (
    <GeminiConfigProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/nova-prova" element={<NovaProvaPage />} />
            <Route path="/provas" element={<ListaProvasPage />} />
            <Route path="/provas/:id" element={<ProvaDetalhePage />} />
            <Route path="/instrucoes" element={<InstrucoesPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </GeminiConfigProvider>
  );
};

export default App;
