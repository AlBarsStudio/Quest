import { useState, useEffect } from 'react';
import styles from './Level2Captcha.module.css';

const wrongFaceMessages = [
  "Серьезно, Настя? Мужа не узнала?", "Какой позор, Анастасия.", "Я начинаю сомневаться в нашей любви.",
  "Ошибка 404: Вкус не найден.", "Этот парень, конечно, ничего, но я лучше.", "Ты сейчас кликнула на левого мужика. Записал в базу данных.",
  "Сердце.exe завершило работу непредвиденно.", "Минус 10 баллов Гриффиндору... то есть Насте.", "А мы точно с 9 июня встречаемся?",
  "Требую перерасчет уровня симпатии!", "Администратор Саша разочарован.", "Очки похожи, но любовь-то не обманешь!",
  "Выбрана неверная модель парня.", "Запрос отклонен. Причина: измена в цифровом виде.", "Система фиксирует микро-инфаркт.",
  "Это кто вообще такой?!", "Попытка взлома биометрии чужим лицом.", "Настя, соберись!", "Это фиаско. Просто фиаско.",
  "Штраф: 50 дополнительных поцелуев.", "Надеюсь, ты просто промахнулась курсором.", "Скажи честно, он тебе больше нравится?",
  "Калибровка чувств сбита. Требуется перезагрузка.", "Несанкционированный клик по чужому профилю.", "Внимание: обнаружен сбой в матрице.",
  "Этот даже не знает, когда мы начали встречаться.", "А ведь я тебе доверял доступ к серверу...", "Ошибка аутентификации: чужой мужик.",
  "Пользователь Настя переведена в режим подозреваемой.", "Может, тебе еще раз фотку мою показать?", "Я вызываю полицию нравов!",
  "Доступ запрещен. Иди обними оригинал."
];

const SECRET_CODE = "nb vq vbq, nb vjt dct";

export default function Level2Captcha({ onNext }) {
  const [cards, setCards] = useState([]);
  const [wrongMessage, setWrongMessage] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Генерация массива карточек (1 правильная, 8 неправильных)
    // Замени пути к картинкам на свои реальные ассеты!
    let initialCards = [
      { id: 'sasha', img: '/assets/sasha.jpg', isFlipped: false },
      ...Array.from({ length: 8 }).map((_, i) => ({
        id: `other_${i}`, img: `/assets/other${i + 1}.jpg`, isFlipped: false
      }))
    ];
    setCards(initialCards.sort(() => Math.random() - 0.5));
  }, []);

  const handleCardClick = (id) => {
    if (id === 'sasha') {
      // Переворачиваем все рубашкой вверх и перемешиваем
      setCards(prev => prev.map(c => ({ ...c, isFlipped: true })).sort(() => Math.random() - 0.5));
      setTimeout(() => {
        setCards(prev => prev.map(c => ({ ...c, isFlipped: false })));
      }, 500);
    } else {
      setWrongMessage(wrongFaceMessages[Math.floor(Math.random() * wrongFaceMessages.length)]);
    }
  };

  const handleAudioClick = () => {
    // В идеале тут запускается аудиофайл, пока просто открываем поле
    setShowInput(true);
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (inputValue.toLowerCase() === SECRET_CODE) {
      setIsSuccess(true);
      setTimeout(onNext, 3000);
    } else {
      setWrongAttempts(prev => prev + 1);
      setInputValue("");
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.terminalText}>
          Код nb vq vbq, nb vjt dct принят.<br/><br/>
          Дешифровка: [ТЫ МОЙ МИР, ТЫ МОЕ ВСЕ].<br/><br/>
          Авторизация подтверждена.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <p className={styles.title}>Выберите все фрагменты, содержащие идеального парня</p>
      
      {wrongMessage && <div className={styles.alert}>{wrongMessage}</div>}

      <div className={styles.grid}>
        {cards.map((card, i) => (
          <div 
            key={i} 
            className={`${styles.card} ${card.isFlipped ? styles.flipped : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className={styles.cardInner}>
              <div className={styles.cardFront} style={{ backgroundImage: `url(${card.img})` }}>
                 {/* Заглушка, если нет картинок */}
                 {!card.img.includes('assets') && (card.id === 'sasha' ? 'САША' : 'НЕ САША')}
              </div>
              <div className={styles.cardBack}></div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button className={styles.audioBtn} onClick={handleAudioClick}>🔊</button>
        <button className={styles.verifyBtn} disabled>Подтвердить</button>
      </div>

      {showInput && (
        <form onSubmit={handleCodeSubmit} className={styles.codeForm}>
          <input 
            type="text" 
            value={inputValue} 
            onChange={e => setInputValue(e.target.value)} 
            placeholder="Введите кодовое слово"
            className={styles.codeInput}
          />
          {wrongAttempts >= 3 && (
            <div className={styles.hint}>
              Внимание. Цифровой ключ утерян. Физическая резервная копия спрятана там, где природа встретилась с твоими руками. Ищи среди того, что никогда не завянет, как и моя любовь к тебе.
            </div>
          )}
        </form>
      )}
    </div>
  );
}
