import { useState } from 'react';
import Intro from './features/intro/Intro';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {showIntro ? (
        <Intro onComplete={() => setShowIntro(false)} />
      ) : (
        <div style={{ color: 'white', padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h1>Здесь будет основной Дашборд</h1>
          <p>С графиками, ачивками и запуском квестов.</p>
        </div>
      )}
    </>
  );
}

export default App;
