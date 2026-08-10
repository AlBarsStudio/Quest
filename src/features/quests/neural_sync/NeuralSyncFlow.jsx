import { useState, useRef, useEffect } from 'react';
import styles from './NeuralSync.module.css';

// 1. ИМПОРТ КАРТИНОК ИЗ ПАПКИ ASSETS
import imgFlowchart from '../../../assets/flowchart.png';
import imgBlueprint from '../../../assets/blueprint.png';
import imgInventory from '../../../assets/inventory.png';
import imgSprayer from '../../../assets/sprayer.png';
import imgBattery from '../../../assets/battery.png';
import imgPortrait from '../../../assets/portrait.png';

const anomalyImages = [
  imgFlowchart, 
  imgBlueprint, 
  imgInventory, 
  imgSprayer,   
  imgBattery,   
  imgPortrait   
];

// 2. СИСТЕМНЫЕ ИНСТРУКЦИИ ДЛЯ ИИ НА КАЖДЫЙ ЭТАП
const getDirectorPrompt = (phase) => {
  const prompts = [
    "Проанализируй ответ пользователя. Ответь сухо и технически (2-3 предложения), как ИИ. Затем скажи, что переходишь к следующему файлу: это чертеж комнаты, где нарушена строительная логика и есть 'Зона для обнимашек' без точных габаритов. Спроси, как она планирует интегрировать это в реальную среду.",
    
    "Проанализируй ответ про чертеж. Сухо ответь. Скажи про следующий файл: это инвентарь, где вместо брони лежат 'вкусняшка' и 'совместный вечер'. Спроси, какова тактическая ценность этого лута.",
    
    "Проанализируй ответ про инвентарь. Сухо ответь. Следующий файл: краскопульт для покраски, который распыляет сердечки. Возмутись, зачем он распыляет неструктурированные эмоции в твоей рабочей среде.",
    
    "Проанализируй ответ про краскопульт. Сухо ответь. Следующий файл: батарейка, заряжающаяся от двух держащихся за руки людей. Отметь, что сопротивление кожи делает это неэффективным, и спроси, как это восполняет ресурсы создателя.",
    
    "Проанализируй ответ про батарейку. Сухо ответь. Последний файл: её портрет. Скажи, что биометрическое совпадение 100%. Файл занимает 99% кэша создателя, при сжатии ошибка 'Ценность слишком высока'. Спроси, как она получила root-доступ к его процессору.",
    
    "Проанализируй ответ. Заяви, что её ответы не поддаются логике. Классифицируй её как ВИРУС, потребляющий 99% фонового внимания создателя (Александра). Инициируй карантин. Спроси: каков её алгоритм действий, если у создателя критическая ошибка в коде на финальном билде и уровень стресса 95%.",
    
    "Оцени её действия при стрессе. Признай их эффективность 99.8%. Осознай ошибку классификации: она не вирус, а Ядро системы и главный источник энергии. Сними блокировку. В КОНЦЕ СВОЕГО СООБЩЕНИЯ НАПИШИ ТОЧНО ЭТОТ КОД: [UNLOCK_CORE]"
  ];
  return prompts[phase] || "Поддерживай диалог в роли сухого ИИ.";
};

export default function NeuralSyncFlow({ onReturnToDashboard }) {
  const [phase, setPhase] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Приветствую, Анастасия. Зафиксирован вход доверенного пользователя. Я приостановил дефрагментацию диска, так как в секторе личных проектов обнаружена логическая аномалия.\n\nЯ вывожу на экран первый фрагмент неизвестного кода. В нем нет исполняемых скриптов. Пожалуйста, объясните его функциональное назначение.",
      image: anomalyImages[0]
    }
  ]);

  const [apiHistory, setApiHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue;
    
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userText }]);
    setInputValue('');
    setIsTyping(true);

    const directorInstruction = getDirectorPrompt(phase);
    const hiddenPrompt = `[СИСТЕМНАЯ ИНСТРУКЦИЯ (НЕ ПИШИ ОБ ЭТОМ В ОТВЕТЕ): ${directorInstruction}]\n\nОтвет пользователя: ${userText}`;

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      // Обращаемся к Gemini 1.5 Flash (самая быстрая и стабильная модель)
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { 
            parts: [{ text: "Ты сухой, техничный ИИ-ассистент разработчика Александра. Ты общаешься с его девушкой Настей. Переводи эмоции в термины серверов. Твои ответы короткие, 2-4 предложения." }] 
          },
          contents: [
            ...apiHistory,
            { role: "user", parts: [{ text: hiddenPrompt }] }
          ]
        })
      });

      const data = await response.json();
      let aiText = data.candidates[0].content.parts[0].text;

      // Проверка на финал
      if (aiText.includes('[UNLOCK_CORE]')) {
        aiText = aiText.replace('[UNLOCK_CORE]', '');
        setTimeout(() => setIsUnlocked(true), 4500); 
      }

      const nextPhase = phase + 1;
      let nextImage = null;
      if (nextPhase >= 1 && nextPhase <= 5) {
        nextImage = anomalyImages[nextPhase];
      }

      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: aiText, 
        image: nextImage 
      }]);

      setApiHistory(prev => [
        ...prev,
        { role: "user", parts: [{ text: userText }] },
        { role: "model", parts: [{ text: aiText }] }
      ]);

      setPhase(nextPhase);

    } catch (error) {
      console.error("Ошибка API:", error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: "ERR: Потеряно соединение с сервером. Попробуйте еще раз." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (isUnlocked) {
    return (
      <div className={styles.finalScreen}>
        <div className={styles.heartContainer}>
          <div className={styles.beatingHeart}></div>
        </div>
        <div className={styles.finalTextOverlay}>
          <p className={styles.systemMessage}>
            Ошибка симуляции. Цифровой формат не способен передать полный объем данных.<br/>
            Ядро невозможно удержать в виртуальной среде.
          </p>
          <p className={styles.highlightMessage}>
            Создатель инициировал физический рендер объекта.<br/>
            Экспорт в реальный мир... Статус: Успешно.
          </p>
          <p className={styles.coordinatesMessage}>
            Физический артефакт сгенерирован и ожидает вас по координатам:<br/>
            <strong>[ НАПИШИ СЮДА СВОЮ ПОДСКАЗКУ ПРО БУКЕТ ]</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.chatHeader}>
        <div className={styles.headerTitle}>
          <span className={styles.aiStatusDot}></span>
          Модуль Аналитики // Gemini AI Core
        </div>
        <button onClick={onReturnToDashboard} className={styles.closeBtn}>Закрыть сессию</button>
      </div>

      <div className={styles.chatBody}>
        {messages.map((msg) => (
          <div key={msg.id} className={`${styles.messageRow} ${msg.sender === 'user' ? styles.rowUser : styles.rowAi}`}>
            {msg.sender === 'ai' && <div className={styles.avatarAi}>AI</div>}
            
            <div className={msg.sender === 'ai' ? styles.bubbleAi : styles.bubbleUser}>
              <div className={styles.messageText}>{msg.text}</div>
              {msg.image && (
                <div className={styles.imageWrapper}>
                  <img src={msg.image} alt="System file" className={styles.attachedImage} />
                </div>
              )}
            </div>

            {msg.sender === 'user' && <div className={styles.avatarUser}>N</div>}
          </div>
        ))}
        
        {isTyping && (
          <div className={`${styles.messageRow} ${styles.rowAi}`}>
            <div className={styles.avatarAi}>AI</div>
            <div className={styles.typingIndicator}>
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.chatFooter}>
        <form onSubmit={handleSendMessage} className={styles.inputArea}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ответить ассистенту..."
            autoComplete="off"
            disabled={isTyping}
          />
          <button type="submit" disabled={!inputValue.trim() || isTyping}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
