import { useState } from 'react';
import Intro from './features/intro/Intro';
import Dashboard from './features/dashboard/Dashboard';
import CoreDefense from './features/quests/core_defense/CoreDefense';
import HeartOSFlow from './features/quests/heart_os/HeartOSFlow';
import NeuralSyncFlow from './features/quests/neural_sync/NeuralSyncFlow';
import FinalQuestFlow from './features/quests/final_quest/FinalQuestFlow';

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

      {/* Квест 1: Тайпинг */}
      {currentScreen === 'core_defense' && (
        <CoreDefense onReturnToDashboard={() => setCurrentScreen('dashboard')} />
      )}

      {/* Квест 2: Капча */}
      {currentScreen === 'heart_os' && (
        <HeartOSFlow onReturnToDashboard={() => setCurrentScreen('dashboard')} />
      )}

      {/* Квест 3: Чат-бот */}
      {currentScreen === 'neural_sync' && (
        <NeuralSyncFlow onReturnToDashboard={() => setCurrentScreen('dashboard')} />
      )}

      {/* ФИНАЛ: Ввод кодов и магия */}
      {currentScreen === 'final_quest' && (
        <FinalQuestFlow onReturnToDashboard={() => setCurrentScreen('dashboard')} />
      )}
    </>
  );
}

export default App;
