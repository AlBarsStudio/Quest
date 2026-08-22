// === НАСТРОЙКИ: КООРДИНАТЫ ЦЕЛИ ===
const targetLat = 54.193122; // Пример: Тула (замени на нужные)
const targetLon = 37.617348; // Пример: Тула (замени на нужные)

let currentLat = null;
let currentLon = null;
let deviceHeading = 0;
let watchId = null;

// Элементы интерфейса
const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const radarScreen = document.getElementById('radar-screen');
const arrow = document.getElementById('arrow');
const statusText = document.getElementById('permission-status');

startBtn.addEventListener('click', async () => {
    // Запрос разрешения на компас (обязательно для iOS)
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
            const permissionState = await DeviceOrientationEvent.requestPermission();
            if (permissionState === 'granted') {
                initRadar();
            } else {
                statusText.innerText = "Нужен доступ к компасу!";
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        // Для Android и старых устройств
        initRadar();
    }
});

function initRadar() {
    startScreen.classList.add('hidden');
    radarScreen.classList.remove('hidden');

    // 1. Слушаем компас телефона
    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true); // Фолбэк

    // 2. Слушаем GPS (работает и без интернета, нужны только спутники)
    if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(updatePosition, handleError, {
            enableHighAccuracy: true, // Запрашиваем максимальную точность (GPS)
            maximumAge: 0,
            timeout: 5000
        });
    } else {
        alert("Ваш браузер не поддерживает GPS");
    }
}

function updatePosition(position) {
    currentLat = position.coords.latitude;
    currentLon = position.coords.longitude;
    
    // Обновляем "сырые" данные на экране
    document.getElementById('lat').innerText = currentLat.toFixed(5);
    document.getElementById('lon').innerText = currentLon.toFixed(5);
    document.getElementById('accuracy').innerText = Math.round(position.coords.accuracy);

    // Вычисляем дистанцию и азимут до цели
    const distance = getDistance(currentLat, currentLon, targetLat, targetLon);
    document.getElementById('distance').innerText = Math.round(distance);

    const bearing = getBearing(currentLat, currentLon, targetLat, targetLon);
    document.getElementById('target-bearing').innerText = Math.round(bearing);

    updateArrow(bearing);
}

function handleOrientation(event) {
    // Получаем поворот телефона относительно севера
    let heading = 0;
    if (event.webkitCompassHeading) {
        heading = event.webkitCompassHeading; // Для iOS
    } else if (event.alpha !== null) {
        // Для Android переводим alpha в компасный курс
        heading = 360 - event.alpha;
    }
    deviceHeading = heading;
    document.getElementById('phone-heading').innerText = Math.round(deviceHeading);
    
    if (currentLat !== null) {
        const bearing = getBearing(currentLat, currentLon, targetLat, targetLon);
        updateArrow(bearing);
    }
}

function updateArrow(targetBearing) {
    // Вращаем стрелку: направление на цель минус текущий поворот телефона
    let rotation = targetBearing - deviceHeading;
    arrow.style.transform = `rotate(${rotation}deg)`;
}

function handleError(error) {
    console.warn('GPS Ошибка:', error.message);
}

// === МАТЕМАТИКА (Формула гаверсинусов) ===
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Радиус Земли в метрах
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // в метрах
}

function getBearing(lat1, lon1, lat2, lon2) {
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const λ1 = lon1 * Math.PI/180;
    const λ2 = lon2 * Math.PI/180;
    const y = Math.sin(λ2-λ1) * Math.cos(φ2);
    const x = Math.cos(φ1)*Math.sin(φ2) - Math.sin(φ1)*Math.cos(φ2)*Math.cos(λ2-λ1);
    const θ = Math.atan2(y, x);
    return (θ * 180/Math.PI + 360) % 360; // в градусах от 0 до 360
              }
