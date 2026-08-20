import { useState, useEffect, useRef } from 'react';
import styles from './Ecosystem.module.css';

// 1. БОЛЬШАЯ БАЗА ДАННЫХ ФАЙЛОВОЙ СИСТЕМЫ (40+ ПАПОК, 100+ ФАЙЛОВ)
const FILE_SYSTEM = {
  'UE5_Gamedev_Vault': {
    type: 'folder',
    desc: 'Архив проектов и игровых движков Unreal Engine 5',
    children: {
      'Core_Blueprints': {
        type: 'folder',
        desc: 'Игровая логика и нодовые графы',
        children: {
          'PlayerController_Main.uasset': { type: 'file', ext: 'uasset', size: '14.2 MB', desc: 'Главный контроллер персонажа с расширенной физикой движения и инверсной кинематикой.', is3D: false },
          'CameraGyro_PixelStream.uasset': { type: 'file', ext: 'uasset', size: '8.4 MB', desc: 'Модуль синхронизации камеры с гироскопом мобильного устройства через WebSocket.', is3D: false },
          'DialogueTree_11Endings.uasset': { type: 'file', ext: 'uasset', size: '24.1 MB', desc: 'Нелинейное дерево квестовых диалогов со сложной системой ветвления реплик.', is3D: false },
          'VaRest_JsonProtocol.uasset': { type: 'file', ext: 'uasset', size: '3.1 MB', desc: 'Парсер REST API для взаимодействия игрового клиента с сервером.', is3D: false },
          'SaveGame_EncryptedState.uasset': { type: 'file', ext: 'uasset', size: '1.2 MB', desc: 'Модуль бинарной сериализации и криптозащиты игровых сохранений.', is3D: false }
        }
      },
      'Niagara_VFX_Systems': {
        type: 'folder',
        desc: 'Системы визуальных эффектов и симуляции частиц',
        children: {
          'Portal_Distortion_VFX.fx': { type: 'file', ext: 'fx', size: '32.8 MB', desc: 'Симуляция пространственного преломления света и гравитационных линз.', is3D: true, mesh: 'torus' },
          'LaserShield_Ecosystem.fx': { type: 'file', ext: 'fx', size: '18.4 MB', desc: 'Многослойный щит отражения атак с динамической сеткой триангуляции.', is3D: true, mesh: 'sphere' },
          'CyberHeart_Particles.fx': { type: 'file', ext: 'fx', size: '42.1 MB', desc: 'Эмиттер на 250 000 частиц, образующих пульсирующее неоновое сердце.', is3D: true, mesh: 'octa' },
          'Volumetric_Fog_Matrix.fx': { type: 'file', ext: 'fx', size: '12.0 MB', desc: 'Объемный туман с трассировкой лучей в реальном времени.', is3D: false }
        }
      },
      'Shaders_HLSL': {
        type: 'folder',
        desc: 'Кастомные шейдеры и материалы HLSL',
        children: {
          'CRT_Scanlines_PostProcess.hlsl': { type: 'file', ext: 'hlsl', size: '42 KB', desc: 'Пост-процесс эффект сканлиний ретро-монитора и хроматических аберраций.', is3D: false },
          'HolographicGrid_Matrix.mat': { type: 'file', ext: 'mat', size: '512 KB', desc: 'Процедурный материал светящейся неоновой координатной сетки.', is3D: true, mesh: 'cube' },
          'Triplanar_Snow_Ice.hlsl': { type: 'file', ext: 'hlsl', size: '84 KB', desc: 'Трипланарный шейдер динамического снега с тесселяцией поверхности.', is3D: false },
          'Anisotropic_BrushedMetal.mat': { type: 'file', ext: 'mat', size: '310 KB', desc: 'PBR материал полированного металла с анизотропным бликом.', is3D: true, mesh: 'cube' }
        }
      },
      'Level_Design_Maps': {
        type: 'folder',
        desc: 'Игровые уровни и локации',
        children: {
          'CyberCity_Hangar_Blockout.umap': { type: 'file', ext: 'umap', size: '184 MB', desc: 'Блокаут масштабного индустриального ангара в киберпанк-стилистике.', is3D: true, mesh: 'cube' },
          'PhilosophersStone_SecretRoom.umap': { type: 'file', ext: 'umap', size: '310 MB', desc: 'Ремастер тайной комнаты Хогвартса с воссозданным освещением Lumen.', is3D: true, mesh: 'octa' },
          'AmusementPark_IsometricView.umap': { type: 'file', ext: 'umap', size: '94 MB', desc: 'Изометрическая сцена парка аттракционов с колесом обозрения.', is3D: true, mesh: 'torus' }
        }
      }
    }
  },
  '3D_Modeling_Pipeline': {
    type: 'folder',
    desc: 'Исходники 3D моделей, риггинг и текстурные атласы',
    children: {
      'Blender_Workspaces': {
        type: 'folder',
        desc: 'Файлы проектов Blender 3D',
        children: {
          'Industrial_Sprayer_HighPoly.blend': { type: 'file', ext: 'blend', size: '68 MB', desc: 'Высокополигональная модель безвоздушного окрасочного аппарата с микрофасками.', is3D: true, mesh: 'octa' },
          'Mech_Drivetrain_Kinematics.blend': { type: 'file', ext: 'blend', size: '45 MB', desc: 'Механический привод с настроенными физическими ограничителями движения.', is3D: true, mesh: 'torus' },
          'FerrisWheel_Isometric_Assets.blend': { type: 'file', ext: 'blend', size: '52 MB', desc: 'Набор модульных ассетов аттракционов для векторной изометрии.', is3D: true, mesh: 'sphere' }
        }
      },
      '3dsMax_Structures': {
        type: 'folder',
        desc: 'Инженерные металлоконструкции Autodesk',
        children: {
          'Hangar_Steel_Framework.max': { type: 'file', ext: 'max', size: '124 MB', desc: 'Пространственный каркас стального ангара с детализацией узлов сопряжения.', is3D: true, mesh: 'cube' },
          'AdvanceSteel_AnchorBolts.max': { type: 'file', ext: 'max', size: '34 MB', desc: 'Параметрические анкерные группы фундаментов по ГОСТ.', is3D: false },
          'Roof_Truss_Calculations.max': { type: 'file', ext: 'max', size: '58 MB', desc: 'Фермы покрытия с расчетом снеговых и ветровых нагрузок.', is3D: true, mesh: 'cube' }
        }
      },
      'Maya_Rigging_Anims': {
        type: 'folder',
        desc: 'Скелетный риггинг и анимационные циклы',
        children: {
          'Character_WeightPaints_Rig.mb': { type: 'file', ext: 'mb', size: '82 MB', desc: 'Скелет с кинематикой IK/FK и идеальной развесовкой вершин скина.', is3D: true, mesh: 'octa' },
          'Facial_Blendshapes_Sync.mb': { type: 'file', ext: 'mb', size: '64 MB', desc: '52 морф-таргета стандарта Apple ARKit для лицевой анимации.', is3D: true, mesh: 'sphere' },
          'RunCycle_Combat_4Directions.anim': { type: 'file', ext: 'anim', size: '12 MB', desc: 'Бесшовный анимационный цикл бега во все 4 направления.', is3D: false }
        }
      },
      'PBR_Textures_4K': {
        type: 'folder',
        desc: 'Текстурные карты сверхвысокого разрешения',
        children: {
          'Scratched_DarkMetal_Albedo.png': { type: 'file', ext: 'png', size: '28 MB', desc: '4K карта базового цвета потертого темного титана.', is3D: false },
          'Industrial_Steel_Normal_DirectX.dds': { type: 'file', ext: 'dds', size: '21 MB', desc: '16-битная карта нормалей с микрорельефом сварных швов.', is3D: false },
          'Roughness_Metallic_Packed.exr': { type: 'file', ext: 'exr', size: '35 MB', desc: 'Сжатая карта шероховатости и металличности в линейном спектре.', is3D: false },
          'Emissive_NeonCore_Glow.png': { type: 'file', ext: 'png', size: '18 MB', desc: 'Карта самосвечения для элементов кибернетического интерфейса.', is3D: false }
        }
      }
    }
  },
  'Production_Video_Audio': {
    type: 'folder',
    desc: 'Монтаж, моушн-дизайн и аудиосэмплы',
    children: {
      'Premiere_Pro_Edits': {
        type: 'folder',
        desc: 'Таймлайны и проекты монтажа Premiere',
        children: {
          'Cinematic_Intro_FinalCut.prproj': { type: 'file', ext: 'prproj', size: '16 MB', desc: 'Смонтированный вступительный ролик с цветокоррекцией Lumetri Color.', is3D: false },
          'Glitch_Transitions_Pack.prfpset': { type: 'file', ext: 'prfpset', size: '2.4 MB', desc: 'Авторские пресеты цифровых помех и динамических переходов.', is3D: false }
        }
      },
      'AfterEffects_Motion': {
        type: 'folder',
        desc: 'Композитинг и эффекты After Effects',
        children: {
          'HUD_Widgets_Tracker.aep': { type: 'file', ext: 'aep', size: '44 MB', desc: 'Проекты трекинга интерфейса футуристического терминала.', is3D: true, mesh: 'torus' },
          'StarParallax_Field_VFX.aep': { type: 'file', ext: 'aep', size: '38 MB', desc: 'Многослойный параллакс звездного поля с эффектом глубины резкости.', is3D: false }
        }
      },
      'Audio_Synthesizers': {
        type: 'folder',
        desc: 'Сэмплы, каверы и звуковой саунд-дизайн',
        children: {
          'Lida_BassBoost_SynthLead.wav': { type: 'file', ext: 'wav', size: '54 MB', desc: 'Энергичный синтезаторный лид с плотной сатурацией в стиле Лиды.', is3D: false },
          'Nerves_Acoustic_Guitar_Loop.mp3': { type: 'file', ext: 'mp3', size: '8.4 MB', desc: 'Теплая акустическая гитарная дорожка для атмосферных уровней.', is3D: false },
          'MichaelJackson_Beat_DrumKit.flac': { type: 'file', ext: 'flac', size: '42 MB', desc: 'Плотный фанковый бит со звонким снейром и перкуссией.', is3D: false },
          'SciFi_SubDrop_Impact.wav': { type: 'file', ext: 'wav', size: '18 MB', desc: 'Низкочастотный саб-дроп для кульминационных моментов квеста.', is3D: false }
        }
      }
    }
  },
  'Web_Frontend_Stack': {
    type: 'folder',
    desc: 'React приложения, WebGL шейдеры и коммерческие проекты',
    children: {
      'React_Vite_Architect': {
        type: 'folder',
        desc: 'Компоненты веб-интерфейса',
        children: {
          'AppRouter_Core.jsx': { type: 'file', ext: 'jsx', size: '28 KB', desc: 'Менеджер состояний и маршрутизация между всеми экранами квеста.', is3D: false },
          'HeartOS_StateEngine.tsx': { type: 'file', ext: 'tsx', size: '45 KB', desc: 'Реактивный движок обработки пользовательского ввода и таймингов.', is3D: false },
          'CyberBentoGrid_System.css': { type: 'file', ext: 'css', size: '34 KB', desc: 'Адаптивная сетка Bento Grid со стеклянными карточками Glassmorphism.', is3D: false }
        }
      },
      'WebGL_ThreeJS': {
        type: 'folder',
        desc: '3D графика для браузера',
        children: {
          'HologramIcosahedron.js': { type: 'file', ext: 'js', size: '18 KB', desc: 'Рендерер 3D икосаэдра с процедурным свечением вершин.', is3D: true, mesh: 'octa' },
          'Radar_ShaderPass.js': { type: 'file', ext: 'js', size: '22 KB', desc: 'Кастомный шейдерный проход для кругового сканирующего радара.', is3D: true, mesh: 'sphere' },
          'GyroMatrixParser.ts': { type: 'file', ext: 'ts', size: '14 KB', desc: 'Обработчик кватернионов наклона смартфона для управления сценой.', is3D: false }
        }
      },
      'Client_Projects': {
        type: 'folder',
        desc: 'Коммерческая разработка и сервисы',
        children: {
          'AmusementPark_ScheduleApp.zip': { type: 'file', ext: 'zip', size: '14 MB', desc: 'Автономное веб-приложение для управления графиками персонала парка.', is3D: false },
          'Proletarsky_Subcontract_Calc.xlsx': { type: 'file', ext: 'xlsx', size: '2.4 MB', desc: 'Калькулятор сметных расчетов механизированной покраски фасадов.', is3D: false },
          'Website_Redesign_Showcase.tsx': { type: 'file', ext: 'tsx', size: '64 KB', desc: 'Прототипы лендингов с интерактивной 3D-типографикой.', is3D: false }
        }
      }
    }
  },
  'CLASSIFIED_CORE_DATA': {
    type: 'folder',
    desc: 'Секретный сектор: Ядро безопасности и личные артефакты',
    children: {
      'System_Kernel_Restricted': {
        type: 'folder',
        desc: 'Ядро операционной системы ALBARS',
        children: {
          'Root_Certificate_SHA512.crt': { type: 'file', ext: 'crt', size: '8 KB', desc: 'Мастер-сертификат наивысшего уровня доверия с цифровой подписью Насти.', is3D: false },
          'Memory_Allocation_Log.bin': { type: 'file', ext: 'bin', size: '128 MB', desc: 'Дамп оперативной памяти ядра во время отражения кибератаки.', is3D: false }
        }
      },
      'Memories_Vault_2026': {
        type: 'folder',
        desc: 'Зашифрованные личные записи',
        children: {
          'Secret_Coordinates_Tula.nav': { type: 'file', ext: 'nav', size: '1 KB', desc: 'Точные навигационные координаты для следующего этапа квеста в реальном мире.', is3D: false },
          'Our_Favorite_Moments.dat': { type: 'file', ext: 'dat', size: '512 MB', desc: 'Защищенный архив со всеми важными датами, моментами и воспоминаниями.', is3D: false }
        }
      },
      'sys.core_key.hrt': {
        type: 'file',
        ext: 'hrt',
        size: '1.0 B',
        desc: 'ГЛАВНЫЙ АРТЕФАКТ: Ключ абсолютного контроля над ALBARS_CORE. Разблокирует переход в Дашборд!',
        isMasterKey: true,
        is3D: true,
        mesh: 'octa'
      }
    }
  }
};

// 2. БАЗА РЕПЛИК И ФОНОВЫХ ДЕЙСТВИЙ GEMINI AI
const BACKGROUND_AI_THOUGHTS = [
  "Оптимизирую компиляцию шейдеров Unreal Engine 5. Выделено 16 потоков CPU.",
  "Обучаю локальную нейросеть распознаванию счастливых улыбок. Точность: 99.98%.",
  "Фоновый процесс: рендеринг физики частиц Niagara завершен на 78%.",
  "Датчики биометрии: пульс Саши стабилизировался после успешного отражения атаки.",
  "Слушаю фоновый плейлист: акустические сэмплы звучат отлично в терминале.",
  "Температура ядра ALBARS_CORE: 41.2°C. Охлаждение работает штатно.",
  "Анализ дискового пространства: найдено 5 лет непрерывного IT-творчества.",
  "Хакерская группировка заблокирована в изолированной песочнице. Угрозы нет.",
  "Уровень кофеина в крови создателя: 84%. Рекомендуется заварить еще кружку чая.",
  "Синхронизирую ключи шифрования RSA-4096 с профилем Анастасии."
];

const FOLDER_REACTIONS = {
  'UE5_Gamedev_Vault': "Вы открыли архив Unreal Engine 5! Здесь сотни часов архитектуры игровых миров и логики.",
  'Core_Blueprints': "Осторожно с этими блюпринтами! Тут зашита сложная логика поворота камеры и диалоговых деревьев.",
  'Niagara_VFX_Systems': "Сектор спецэффектов. Эти частицы создают магию в реальном времени.",
  '3D_Modeling_Pipeline': "Святая святых 3D-моделирования: от Blender до сложнейших сборок в 3ds Max и Maya.",
  'Blender_Workspaces': "Рабочие сцены Blender! Здесь рождались высокополигональные модели оборудования и парка.",
  'Production_Video_Audio': "Модуль продакшена. Здесь треки Лиды, Нервов и плотные биты Майкла Джексона.",
  'Web_Frontend_Stack': "Стек веб-разработки: чистый React, Tailwind, Vite и трехмерные шейдеры Three.js.",
  'CLASSIFIED_CORE_DATA': "ВНИМАНИЕ: Закрытый сектор ядра! Доступ разрешен только по биометрии невесты. Найдите главный ключ!"
};

export default function Ecosystem({ onHeartClick, results }) {
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [victoryModal, setVictoryModal] = useState(false);

  // Телеметрия
  const [heartRate, setHeartRate] = useState(74);
  const [caffeine, setCaffeine] = useState(86);
  const [vram, setVram] = useState(21.4);
  const [cpuUsage, setCpuUsage] = useState(42);
  const [ecgOffset, setEcgOffset] = useState(0);
  const [hexMemory, setHexMemory] = useState('0x7F 0x4A 0xDE 0x12 0x90 0xBC');

  // ИИ Ассистент
  const [aiSpeech, setAiSpeech] = useState("Приветствую в хранилище ALBARS_CORE! Ядро спасено, исследуйте архивы или найдите мастер-ключ.");
  const [aiLogs, setAiLogs] = useState([
    { id: 1, text: "SYS: Авторизован доступ оператора АНАСТАСИЯ.", time: "12:00:01" },
    { id: 2, text: "AI: Запуск фонового мониторинга файловой системы.", time: "12:00:03" }
  ]);

  const canvasViewerRef = useRef(null);

  // Получение текущей папки
  const getCurrentFolder = () => {
    let current = FILE_SYSTEM;
    for (const segment of currentPath) {
      if (current[segment] && current[segment].children) {
        current = current[segment].children;
      }
    }
    return current;
  };

  // Переход в папку
  const handleOpenFolder = (folderName) => {
    const newPath = [...currentPath, folderName];
    setCurrentPath(newPath);
    if (FOLDER_REACTIONS[folderName]) {
      setAiSpeech(FOLDER_REACTIONS[folderName]);
      addAiLog(`FOLDER: Переход в [${folderName}].`);
    } else {
      setAiSpeech(`Исследуем директорию ${folderName}...`);
    }
  };

  // Навигация по хлебным крошкам
  const handleBreadcrumbClick = (index) => {
    if (index === -1) {
      setCurrentPath([]);
      setAiSpeech("Возврат в корневой каталог ALBARS_CORE.");
    } else {
      const newPath = currentPath.slice(0, index + 1);
      setCurrentPath(newPath);
      setAiSpeech(`Переход в каталог ${newPath[newPath.length - 1]}.`);
    }
  };

  // Добавление лога ИИ
  const addAiLog = (text) => {
    const time = new Date().toLocaleTimeString();
    setAiLogs(prev => [...prev.slice(-8), { id: Date.now(), text, time }]);
  };

  // Клик по файлу
  const handleFileClick = (fileName, fileData) => {
    if (fileData.isMasterKey) {
      setAiSpeech("ОБНАРУЖЕН МАСТЕР-КЛЮЧ! Инициирую протокол победы и синхронизацию с Дашбордом!");
      addAiLog("SECURITY: Мастер-ключ sys.core_key.hrt активирован!");
      setVictoryModal(true);
      return;
    }

    setSelectedFile({ name: fileName, ...fileData });
    setAiSpeech(`Файл [${fileName}]: ${fileData.desc}`);
    addAiLog(`INSPECT: Открыт файл ${fileName} (${fileData.size}).`);
  };

  // Фоновые мысли ИИ
  useEffect(() => {
    const thoughtInterval = setInterval(() => {
      const randomThought = BACKGROUND_AI_THOUGHTS[Math.floor(Math.random() * BACKGROUND_AI_THOUGHTS.length)];
      addAiLog(`AI.TASK: ${randomThought}`);
    }, 7000);

    return () => clearInterval(thoughtInterval);
  }, []);

  // Живая анимация телеметрии (ЭКГ, HEX, Нагрузка)
  useEffect(() => {
    const telemetryInterval = setInterval(() => {
      setHeartRate(prev => Math.floor(70 + Math.random() * 8));
      setCaffeine(prev => Math.min(100, Math.max(75, Math.floor(prev + (Math.random() * 2 - 1)))));
      setCpuUsage(prev => Math.floor(35 + Math.random() * 25));
      setVram(prev => +(21.0 + Math.random() * 0.8).toFixed(1));
      setEcgOffset(prev => (prev + 4) % 100);

      // HEX-генератор
      const hexChars = '0123456789ABCDEF';
      let hexStr = '';
      for (let i = 0; i < 6; i++) {
        hexStr += '0x' + hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)] + ' ';
      }
      setHexMemory(hexStr.trim());
    }, 200);

    return () => clearInterval(telemetryInterval);
  }, []);

  // 3. 3D Интерактивный рендерер сетки в окне просмотра файла
  useEffect(() => {
    if (!selectedFile || !selectedFile.is3D || !canvasViewerRef.current) return;
    const canvas = canvasViewerRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let rotX = 0;
    let rotY = 0;

    let vertices = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
    ];
    let edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    if (selectedFile.mesh === 'octa') {
      vertices = [[0, 1.4, 0], [0, -1.4, 0], [1.4, 0, 0], [-1.4, 0, 0], [0, 0, 1.4], [0, 0, -1.4]];
      edges = [[0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [1, 3], [1, 4], [1, 5], [2, 4], [4, 3], [3, 5], [5, 2]];
    } else if (selectedFile.mesh === 'sphere' || selectedFile.mesh === 'torus') {
      vertices = [
        [-1.2, 0, 0], [1.2, 0, 0], [0, -1.2, 0], [0, 1.2, 0],
        [0, 0, -1.2], [0, 0, 1.2], [-0.8, -0.8, 0], [0.8, 0.8, 0],
        [-0.8, 0.8, 0], [0.8, -0.8, 0]
      ];
      edges = [[0, 2], [2, 1], [1, 3], [3, 0], [4, 0], [4, 1], [5, 0], [5, 1], [6, 7], [8, 9]];
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rotX += 0.02;
      rotY += 0.03;

      const fov = 180;
      const size = canvas.width / 2;

      const projected = vertices.map(([x, y, z]) => {
        let y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
        let z1 = y * Math.sin(rotX) + z * Math.cos(rotX);

        let x2 = x * Math.cos(rotY) + z1 * Math.sin(rotY);
        let z2 = -x * Math.sin(rotY) + z1 * Math.cos(rotY);

        let scale = fov / (fov + z2 + 2.5);
        return [x2 * scale * 34 + size, y1 * scale * 34 + size];
      });

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.6;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#f59e0b';

      edges.forEach(([i, j]) => {
        ctx.beginP