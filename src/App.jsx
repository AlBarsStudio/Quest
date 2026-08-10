import { useState } from 'react';
import Intro from './features/intro/Intro';
import Dashboard from './features/dashboard/Dashboard';
import CoreDefense from './features/quests/core_defense/CoreDefense';
import HeartOSFlow from './features/quests/heart_os/HeartOSFlow';
// ДОБАВЛЯЕМ ИМПОРТ НОВОГО КВЕСТА
import NeuralSyncFlow from './features/quests/neural_sync/NeuralSyncFlow';

function App() {
  const [currentScreen, setCurrentScreen] = useState('intro');

  return (
    <>
      {currentScreen === 'intro' && (
        <Intro onComplete={() => setCurrentScreen('dashboard')} />
      )}
      
      {currentScreen === 'dashboard' && (
        <Dashboard onStartQuest={(questId) => setCurrentScreen(questId)} />
      )}

      {currentScreen === 'core_defense' && (
        <CoreDefense onReturnToDashboard={() => setCurrentScreen('dashboard')} />
      )}

      {currentScreen === 'heart_os' && (
        <HeartOSFlow onReturnToDashboard={() => setCurrentScreen('dashboard')} />
      )}

      {/* ДОБАВЛЯЕМ РОУТ НОВОГО КВЕСТА */}
      {currentScreen === 'neural_sync' && (
        <NeuralSyncFlow onReturnToDashboard={() => setCurrentScreen('dashboard')} />
      )}
    </>
  );
}

export default App;
