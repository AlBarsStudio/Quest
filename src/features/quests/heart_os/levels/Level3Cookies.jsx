import { useState, useEffect } from 'react';
import styles from './Level3Cookies.module.css';

const popupConditions = [
  "Подтвердите подписку на ежедневные комплименты.", "HeartOS использует cookie для отслеживания вашего счастья.", "Обязуетесь терпеть специфические шутки?",
  "Разрешить доступ к обнимашкам 24/7?", "Согласны на внеплановые поцелуи?", "Готовы стать самым счастливым пользователем?",
  "Оцените работу Администратора (10/10).", "Подтверждаете, что Саша лучший?", "Соглашение о просмотре фильмов принято?",
  "Разрешить передачу телеметрии настроения?", "Обязуетесь честно говорить, где кушать?", "Критический передоз милоты. Продолжить?",
  "Разрешить использовать вас для согрева ног?", "Уведомление: Вы идеальны. Закрыть?", "Делить вкусняшки строго 50/50?",
  "Лицензия на право держать за руку.", "Подтверждаете, что 23.06.2026 — важная дата?", "Согласие на реализацию сокровенных желаний.",
  "Разрешить признания в любви в любое время?", "Предупреждение: Администратор скучает.", "Обязуюсь не дуться дольше 5 минут.",
  "Подтверждаю, что архитектура квеста гениальна.", "Согласие на полную интеграцию жизней.", "Разрешить заваривание чая по утрам?",
  "Абсолютная монополия на сердечко?", "Подтвердите, что не шпион бывших.", "Обновление прошивки до версии 'Навсегда'?",
  "Обязуетесь смеяться над багованными мемами?", "Root-доступ к вашим снам?", "Финальное соглашение: Быть моей."
];

export default function Level3Cookies({ onNext }) {
  const [popups, setPopups] = useState([]);
  const [acceptedCount, setAcceptedCount] = useState(0);

  const spawnPopup = () => {
    if (acceptedCount >= 15) return;
    const text = popupConditions[Math.floor(Math.random() * popupConditions.length)];
    const x = Math.floor(Math.random() * 60) + 10; // 10% - 70% 
    const y = Math.floor(Math.random() * 60) + 10;
    
    setPopups(prev => [...prev, { id: Date.now() + Math.random(), text, x, y }]);
  };

  useEffect(() => {
    // Спавним первые 3 окна при старте
    for(let i=0; i<3; i++) setTimeout(spawnPopup, i*300);
  }, []);

  const handleAccept = (id) => {
    setPopups(prev => prev.filter(p => p.id !== id));
    setAcceptedCount(prev => prev + 1);
    
    if (acceptedCount < 14) {
      spawnPopup();
      if (Math.random() > 0.5) spawnPopup(); // Иногда спавним сразу два
    }
  };

  return (
    <div className={styles.container}>
      <button 
        className={styles.mainBtn} 
        disabled={acceptedCount < 15}
        onClick={onNext}
      >
        {acceptedCount >= 15 ? "Подтвердить" : "Ожидание соглашений..."}
      </button>

      {popups.map(popup => (
        <div 
          key={popup.id} 
          className={styles.popup} 
          style={{ top: `${popup.y}%`, left: `${popup.x}%` }}
        >
          <div className={styles.popupHeader}>Системный запрос</div>
          <div className={styles.popupBody}>
            <p>{popup.text}</p>
            <div className={styles.btnGroup}>
              <button onClick={() => handleAccept(popup.id)} className={styles.acceptBtn}>
                {["Принять", "Согласна", "Да", "Естественно", "Ага"][Math.floor(Math.random() * 5)]}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
