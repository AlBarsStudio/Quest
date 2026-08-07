import React from 'react';

export default function Dashboard() {
  return (
    <div style={{ padding: '40px', fontFamily: 'monospace' }}>
      <h2 style={{ color: '#ff2a5f' }}>ТЕРМИНАЛ СИМУЛЯЦИИ БЫТИЯ</h2>
      <p>Уровень абсурда: 99%</p>
      <div style={{ marginTop: '50px', padding: '20px', border: '1px solid #333' }}>
        <h3>Случайная мысль дня:</h3>
        <p>"Если долго смотреть в стяжку, стяжка начнет смотреть в тебя."</p>
      </div>
      <button style={{ marginTop: '20px', padding: '10px 20px', background: '#fff', color: '#000', cursor: 'pointer' }}>
        НАЧАТЬ КВЕСТ
      </button>
    </div>
  );
}
