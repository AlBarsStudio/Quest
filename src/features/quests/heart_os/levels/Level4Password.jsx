import { useState, useEffect } from 'react';
import styles from './Level4Password.module.css';

// 10 основных правил
const rules = [
  { id: 1, text: "Слишком коротко, я так не играю. Давай минимум 10 символов.", check: (p) => p.length >= 10 },
  { id: 2, text: "Где экспрессия?! Добавь хотя бы одну заглавную букву и спецсимвол.", check: (p) => /[A-ZА-Я]/.test(p) && /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  { id: 3, text: "В пароле должно быть имя лучшего парня (Саша).", check: (p) => p.toLowerCase().includes('саша') },
  { id: 4, text: "А когда мы познакомились? Напиши месяц прописью (июнь).", check: (p) => p.toLowerCase().includes('июнь') },
  { id: 5, text: "Время математики. Сумма всех цифр в пароле должна равняться 23.", check: (p) => {
      const digits = p.match(/\d/g);
      return digits ? digits.reduce((a, b) => a + parseInt(b), 0) === 23 : false;
  }},
  { id: 6, text: "Мне разонравилась буква 'а'. И русская, и английская. Удали её везде.", check: (p) => !p.toLowerCase().includes('а') && !p.toLowerCase().includes('a') },
  { id: 7, text: "'Июнь' слишком банально. Разверни задом наперед ('ьнюи').", check: (p) => p.toLowerCase().includes('ьнюи') },
  { id: 8, text: "Добавь классический текстовый смайлик :-) для поднятия настроения.", check: (p) => p.includes(':-)') },
  { id: 9, text: "Система не пропустит тебя, пока ты не напишешь 'люблю'.", check: (p) => p.toLowerCase().includes('люблю') },
  { id: 10, text: "Идеальная длина пароля — ровно 18 символов. Подгоняй.", check: (p) => p.length === 18 }
];

const KEYS = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}:,./?".split('');

export default function Level4Password({ onNext }) {
  const [password, setPassword] = useState("");
  const [currentRuleIndex, setCurrentRuleIndex] = useState(0);
  const [keyboard, setKeyboard] = useState(KEYS);

  const shuffleKeyboard = () => {
    let shuffled = [...keyboard];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setKeyboard(shuffled);
  };

  useEffect(() => {
    shuffleKeyboard();
  }, []);

  useEffect(() => {
    // Проверка правил
    if (currentRuleIndex < rules.length) {
      if (rules[currentRuleIndex].check(password)) {
        setCurrentRuleIndex(prev => prev + 1);
      }
    } else {
      setTimeout(onNext, 1500);
    }
  }, [password, currentRuleIndex, onNext]);

  const handleKeyPress = (char) => {
    setPassword(prev => prev + char);
    shuffleKeyboard();
  };

  const handleBackspace = () => {
    setPassword(prev => prev.slice(0, -1));
    shuffleKeyboard();
  };

  return (
    <div className={styles.container}>
      <div className={styles.aiBox}>
        <p className={styles.aiName}>HeartOS AI:</p>
        <p className={styles.aiText}>
          {currentRuleIndex < rules.length ? rules[currentRuleIndex].text : "Пароль идеален. Доступ разрешен."}
        </p>
      </div>

      <input 
        type="text" 
        value={password} 
        readOnly 
        className={styles.passwordInput} 
        placeholder="Введите пароль..."
      />
      <div className={styles.counter}>Символов: {password.length}</div>

      <div className={styles.keyboard}>
        {keyboard.map((char, i) => (
          <button key={i} className={styles.key} onClick={() => handleKeyPress(char)}>
            {char}
          </button>
        ))}
        <button className={styles.keyBack} onClick={handleBackspace}>⌫</button>
      </div>
    </div>
  );
}
