import React, { useState } from 'react';
import Intro from './features/intro/Intro';
import Dashboard from './features/dashboard/Dashboard';

export default function App() {
  // Состояние: прошли мы интро или нет
  const [isIntroFinished, setIsIntroFinished] = useState(false);

  return (
    <>
      {!isIntroFinished ? (
        <Intro onComplete={() => setIsIntroFinished(true)} />
      ) : (
        <Dashboard />
      )}
    </>
  );
}
