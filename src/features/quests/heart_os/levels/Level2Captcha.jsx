import { useState } from 'react';
import styles from './Level2Captcha.module.css';

// Стабильные качественные изображения с Unsplash
const INITIAL_TILES = [
  { id: 1, url: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=400&q=80', isTarget: true, title: 'Кот спит' },
  { id: 2, url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80', isTarget: false, title: 'Микросхема' },
  { id: 3, url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=400&q=80', isTarget: true, title: 'Собачка' },
  { id: 4, url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80', isTarget: true, title: 'Милый котик' },
  { id: 5, url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80', isTarget: false, title: 'Матрица/Код' },
  { id: 6, url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=400&q=80', isTarget: true, title: 'Щенок' },
  { id: 7, url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80', isTarget: false, title: 'Терминал' },
  { id: 8, url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80', isTarget: true, title: 'Мопс' },
  { id: 9, url: 'https://images.unsplash.com/photo-1516116211227-bbc13c7a9561?auto=format&fit=crop&w=400&q=80', isTarget: false, title: 'Серверная' }
];

export default function Level2Captcha({ onNext, onSkip }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleTile = (id) => {
    if (isVerifying || isSuccess) return;
    setErrorMessage('');
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setErrorMessage('');

    // Имитация невыносимо долгой проверки Google Captcha
    setTimeout(() => {
      const targetIds = INITIAL_TILES.filter(t => t.isTarget).map(t => t.id);
      const isCorrect = 
        targetIds.every(id => selectedIds.includes(id)) && 
        selectedIds.length === targetIds.length;

      if (isCorrect) {
        setIsSuccess(true);
        setTimeout(() => {
          onNext();
        }, 1500);
      } else {
        setIsVerifying(false);
        setErrorMessage('ОШИБКА: Обнаружен дефицит пушистости в выбранных секторах. Попробуйте снова.');
      }
    }, 2200);
  };

  return (
    <div className={styles.levelWrapper}>
      <button className={styles.skipBtn} onClick={onSkip}>
        ПРОПУСТИТЬ УРОВЕНЬ ⏭
      </button>

      <div className={`${styles.captchaModal} ${isSuccess ? styles.modalSuccess : ''}`}>
        <div className={styles.modalHeader}>
          <div className={styles.headerBadge}>HeartOS Security // Stage 2 of 5</div>
          <h3 className={styles.headerTitle}>
            Выберите все изображения, где есть <span className={styles.highlight}>ДОМАШНИЕ ПИТОМЦЫ</span>
          </h3>
          <p className={styles.headerSubtitle}>
            Если на фото сервер, код или микросхемы — не нажимайте на них.
          </p>
        </div>

        <div className={styles.gridContainer}>
          {INITIAL_TILES.map((tile) => {
            const isSelected = selectedIds.includes(tile.id);
            return (
              <div 
                key={tile.id}
                className={`${styles.tile} ${isSelected ? styles.tileSelected : ''}`}
                onClick={() => toggleTile(tile.id)}
              >
                <img src={tile.url} alt={tile.title} className={styles.tileImage} />
                {isSelected && (
                  <div className={styles.checkmarkBadge}>
                    <div className={styles.checkmarkCircle}>✓</div>
                  </div>
                )}
                <div className={styles.tileOverlay}></div>
              </div>
            );
          })}
        </div>

        {errorMessage && (
          <div className={styles.errorAlert}>
            ⚠️ {errorMessage}
          </div>
        )}

        <div className={styles.modalFooter}>
          <div className={styles.counter}>
            Выбрано: <strong>{selectedIds.length}</strong> / 5
          </div>

          <button 
            className={`${styles.verifyBtn} ${isVerifying ? styles.btnLoading : ''}`}
            onClick={handleVerify}
            disabled={selectedIds.length === 0 || isVerifying || isSuccess}
          >
            {isSuccess ? 'ВЕРИФИЦИРОВАНО ✓' : isVerifying ? 'АНАЛИЗ СЕТИ...' : 'ПОДТВЕРДИТЬ'}
          </button>
        </div>
      </div>
    </div>
  );
}
