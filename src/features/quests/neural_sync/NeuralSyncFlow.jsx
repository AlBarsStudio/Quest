import { useState, useRef, useEffect } from 'react';
import styles from './NeuralSync.module.css';

// 1. ИМПОРТ КАРТИНОК 
import imgFlowchart from '../../../public/assets/flowchart.png';
import imgBlueprint from '../../../public/assets/blueprint.png';
import imgInventory from '../../../public/assets/inventory.png';
import imgSprayer from '../../../public/assets/sprayer.png';
import imgBattery from '../../../public/assets/battery.png';
import imgPortrait from '../../../public/assets/portrait.png';

const anomalyImages = [
  imgFlowchart, 
  imgBlueprint, 
  imgInventory, 
  imgSprayer,   
  imgBattery,   
  imgPortrait   
];

// КЛЮЧИ API
const GROQ_API_KEY = "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";
const OPENROUTER_API_KEY = "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";

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

// 3. ЛОКАЛЬНАЯ АВАРИЙНАЯ ЗАГЛУШКА ПЕРЕПИСКИ
const getFallbackResponse = (phase, text) => {
  const fallbacks = [
    "Данные получены. Однако логика чертежа нарушена. 'Зона для обнимашек' не имеет точных пространственных габаритов. Как вы планируете интегрировать данный объект в реальную среду без привязки к координатам?",
    "Оценка тактической ценности: сомнительно. Перехожу к следующему файлу инвентаря: вместо бронеплит обнаружены элементы 'вкусняшка' и 'совместный вечер'. Обоснуйте их присутствие в слотах быстрого доступа.",
    "Ответ нерационален с точки зрения энергозатрат. Следующий файл: устройство распыления (краскопульт), генерирующее частицы в форме сердец. Объясните причину распыления неструктурированных эмоций в рабочей директории.",
    "Аргумент зафиксирован. Следующий аномальный файл: элемент питания, активирующийся от контакта двух рук. Биоэлектрическое сопротивление кожи снижает КПД до нуля. Каким образом это восполняет ресурсы Александра?",
    "Анализ биометрии: 100% совпадение. Этот файл-портрет занимает 99% оперативной памяти создателя. Попытка компрессии выдает ошибку 'Ценность объекта слишком высока'. Назовите эксплойт, через который вы получили root-доступ к его алгоритмам принятия решений.",
    "Введенные данные не поддаются технической классификации. Система определяет вас как ВИРУС, блокирующий 99% фонового внимания системы Александра. Запуск протокола карантина. Запрос: назовите ваш алгоритм действий, если у создателя обнаружена критическая ошибка в финальном билде, а датчик стресса показывает 95%.",
    "Обработка сценария... Оценка действий при стрессе: 99.8% эффективности восстановления. Внимание: выявлена критическая ошибка классификации. Вы — не вирус. Статус обновлен: Ядро системы и главный источник энергии. Протоколы блокировки деактивируются. [UNLOCK_CORE]"
  ];
  
  // Добавляем немного динамики, если ответ слишком короткий
  let response = fallbacks[phase] || "Система дестабилизирована.";
  if (text.length < 5 && phase < 6) {
    response = "Объем вводных данных недостаточен для полноценного анализа, но протокол продолжается. " + response;
  }
  return response;
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
    const systemInstructionContent = "Ты сухой, техничный ИИ-ассистент разработчика Александра. Ты общаешься с его девушкой Настей. Переводи эмоции в термины серверов. Твои ответы короткие, 2-4 предложения.";

    // API 1: Groq (Максимальная скорость)
    const fetchGroq = async () => {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemInstructionContent },
            ...apiHistory,
            { role: "user", content: hiddenPrompt }
          ]
        })
      });
      if (!response.ok) throw new Error("Groq API недоступен");
      const data = await response.json();
      return data.choices[0].message.content;
    };

    // API 2: OpenRouter (Резервный канал)
    const fetchOpenRouter = async () => {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.href,
          "X-Title": "Quest for Anastasia"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct:free",
          messages: [
            { role: "system", content: systemInstructionContent },
            ...apiHistory,
            { role: "user", content: hiddenPrompt }
          ]
        })
      });
      if (!response.ok) throw new Error("OpenRouter API недоступен");
      const data = await response.json();
      return data.choices[0].message.content;
    };

    try {
      let aiText = "";

      try {
        // Попытка 1: GROQ
        aiText = await fetchGroq();
      } catch (errorGroq) {
        console.warn("Сбой Groq, переключение на OpenRouter...");
        try {
          // Попытка 2: OpenRouter
          aiText = await fetchOpenRouter();
        } catch (errorOpenRouter) {
          console.warn("Сбой OpenRouter, запуск локального ядра...");
          // Попытка 3: Локальная резервная логика
          await new Promise(resolve => setTimeout(resolve, 1500)); // Имитация задержки
          aiText = getFallbackResponse(phase, userText);
        }
      }

      // Проверка на финал
      if (aiText.includes('[UNLOCK_CORE]')) {
        aiText = aiText.replace('[UNLOCK_CORE]', '').trim();
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
        { role: "user", content: userText },
        { role: "assistant", content: aiText }
      ]);

      setPhase(nextPhase);

    } catch (error) {
      console.error("Критическая ошибка:", error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: "ERR: Глобальный сбой интерфейса." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // ЭКРАН ФИНАЛА
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

  // ЭКРАН ЧАТА
  return (
    <div className={styles.chatWrapper}>
      <div className={styles.chatHeader}>
        <div className={styles.headerTitle}>
          <span className={styles.aiStatusDot}></span>
          Модуль Аналитики // DeepSync AI Core
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
