import { useState } from 'react';
import Intro from './features/intro/Intro';
import Dashboard from './features/dashboard/Dashboard';
import CoreDefense from './features/quests/core_defense/CoreDefense';
// Импортируем наш новый квест HeartOS
import HeartOSFlow from './features/quests/heart_os/HeartOSFlow';

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

      {/* Роут для нового квеста */}
      {currentScreen === 'heart_os' && (
        <HeartOSFlow onReturnToDashboard={() => setCurrentScreen('dashboard')} />
      )}
    </>
  );
}

export default App;
