import { useState } from 'react';
import Intro from './features/intro/Intro';
import Dashboard from './features/dashboard/Dashboard';
// Подключаем наш новый квест:
import CoreDefense from './features/quests/core_defense/CoreDefense';

function App() {
  // Теперь стейт хранит название текущего экрана, а не просто true/false
  const [currentScreen, setCurrentScreen] = useState('intro');

  return (
    <>
      {currentScreen === 'intro' && (
        <Intro onComplete={() => setCurrentScreen('dashboard')} />
      )}
      
      {currentScreen === 'dashboard' && (
        // Здесь мы передаем пропс onStartQuest, который Дашборд вызывает при клике на кнопку
        <Dashboard onStartQuest={(questId) => setCurrentScreen(questId)} />
      )}

      {currentScreen === 'core_defense' && (
        <CoreDefense onReturnToDashboard={() => setCurrentScreen('dashboard')} />
      )}
    </>
  );
}

export default App;
