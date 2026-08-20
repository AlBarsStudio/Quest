import { useState, useEffect } from 'react';
import styles from './Level4Password.module.css';

// Правила в стиле Password Game
const RULES = [
  {
    id: 1,
    text: 'Правило 1: Пароль должен содержать не менее 6 символов.',
    check: (pw) => pw.length >= 6
  },
  {
    id: 2,
    text: 'Правило 2: Пароль должен содержать заглавную букву.',
    check: (pw) => /[A-ZА-ЯЁ]/.test(pw)
  },
  {
    id: 3,
    text: 'Правило 3: Пароль должен содержать день твоего рождения (число 20).',
    check: (pw) => pw.includes('20')
  },
  {
    id: 4,
    text: 'Правило 4: Пароль должен содержать имя создателя ("Саша" или "Aleksandr").',
    check: (pw) => /Саша|саша|Aleksandr|aleksandr/i.test(pw)
  },
  {
    id: 5,
    text: 'Правило 5: Пароль должен содержать эмодзи сердца (❤️).',
    check: (pw) => pw.includes('❤️')
  }
];

export default function Level4Password({ onNext, onSkip }) {
  const [password, setPassword] = useState('');
  const [visibleRulesCount, setVisibleRulesCount] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  // Каскадное появление правил по мере их выполнения
  useEffect(() => {
    let currentPassed = 0;
    for (let i = 0; i < RULES.length; i++) {
      if (RULES[i].check(password)) {
        currentPassed = i + 1;
      } else {
        break;
      }
    }
    setVisibleRulesCount(Math.min(RULES.length, Math.max(1, currentPassed + 1)));

    // Проверка выполнения абсолютно всех 5 правил
    const allPassed = RULES.every(rule => rule.check(password));
    if (allPassed && !isSuccess) {
      setIsSuccess(true);
      setTimeout(() => {
        onNext();
      }, 1800);
    }
  }, [password, isSuccess, onNext]);

  return (
    <div className={styles.levelWrapper}>
      <button className={styles.skipBtn} onClick={onSkip}>
        ПРОПУСТИТЬ УРОВЕНЬ ⏭
      </button>

      <div className={`${styles.passwordModal} ${isSuccess ? styles.modalSuccess : ''}`}>
        <div className={styles.modalHeader}>
          <div className={styles.headerTag}>HeartOS Security // Stage 4 of 5</div>
          <h2 className={styles.title}>Генерация мастер-пароля</h2>
          <p className={styles.subtitle}>
            Для снятия аварийной изоляции создайте пароль, удовлетворяющий протоколу искренности.
          </p>
        </div>

        <div className={styles.inputContainer}>
          <input 
            type="text"
            className={styles.passwordInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль..."
            autoFocus
          />
          <button 
            type="button"
            className={styles.heartInsertBtn}
            onClick={() => setPassword(prev => prev + '❤️')}
            title="Вставить ❤️"
          >
            + ❤️
          </button>
        </div>

        <div className={styles.rulesList}>
          {RULES.slice(0, visibleRulesCount).map((rule) => {
            const passed = rule.check(password);
            return (
              <div 
                key={rule.id}
                className={`${styles.ruleCard} ${passed ? styles.rulePassed : styles.ruleFailed}`}
              >
                <div className={styles.ruleStatusIcon}>
                  {passed ? '✓' : '✕'}
                </div>
                <div className={styles.ruleText}>{rule.text}</div>
              </div>
            );
          })}
        </div>

        <div className={styles.footerBar}>
          <div className={styles.statusIndicator}>
            Соблюдено правил: <strong>{RULES.filter(r => r.check(password)).length} / {RULES.length}</strong>
          </div>
          {isSuccess && <div className={styles.successBadge}>ПАРОЛЬ ПРИНЯТ! СНЯТИЕ БЛОКИРОВОК...</div>}
        </div>
      </div>
    </div>
  );
}
