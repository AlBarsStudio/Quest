import { useState } from 'react';
import Intro from './features/intro/Intro';
import Dashboard from './features/dashboard/Dashboard';
import CoreDefense from './features/quests/core_defense/CoreDefense';

function App() {
  // 'intro', 'dashboard', 'core_defense'
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
    </>
  );
}

export default App;
