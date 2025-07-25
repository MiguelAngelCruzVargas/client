import React, { useState, useEffect } from "react";

// Mensajes de saludo dinámicos
const GREETING_MESSAGES = [
  "¡Hola jefe! 👋",
  "¡Bienvenido Admin! 🌟",
  "¡Qué bueno verte! 😊",
  "¡Listo para trabajar! 💪",
  "¡Admin power ON! ⚡",
  "¡Hora de brillar! ✨",
  "¡A conquistar el día! 🚀",
  "¡Tu reino te espera! 👑"
];

// Mensajes según la hora
const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "¡Buenos días! ☀️";
  if (hour < 18) return "¡Buenas tardes! 🌤️";
  return "¡Buenas noches! 🌙";
};

export default function AnimatedAvatar({
  src,
  alt = "Avatar",
  size = 64,
  className = "",
  fallbackText = "",
  isGreeting = true, // Nueva prop para activar el saludo
  greetingText = "", // Texto personalizable del saludo (si está vacío usa aleatorio)
  onGreetingComplete, // Callback cuando termine el saludo
}) {
  const [isWaving, setIsWaving] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('bounce'); // 'bounce', 'wave', 'pulse'
  const [particlesVisible, setParticlesVisible] = useState(false);
  const [currentGreeting, setCurrentGreeting] = useState("");
  const [hasGreeted, setHasGreeted] = useState(false); // Nueva variable para evitar repetición

  // Generar mensaje de saludo dinámico
  const generateGreeting = () => {
    if (greetingText) return greetingText; // Usar mensaje personalizado si se proporciona
    
    // 50% probabilidad de usar mensaje basado en hora, 50% aleatorio
    if (Math.random() > 0.5) {
      return getTimeBasedGreeting();
    } else {
      const randomIndex = Math.floor(Math.random() * GREETING_MESSAGES.length);
      return GREETING_MESSAGES[randomIndex];
    }
  };

  useEffect(() => {
    if (isGreeting && !hasGreeted) { // Solo ejecutar si no ha saludado antes
      // Marcar que ya saludó para evitar repetición
      setHasGreeted(true);
      
      // Generar nuevo mensaje de saludo
      setCurrentGreeting(generateGreeting());
      
      // Secuencia de animaciones de saludo
      const sequence = async () => {
        // Fase 1: Bounce inicial
        setAnimationPhase('bounce');
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Fase 2: Mostrar saludo y wave
        setShowGreeting(true);
        setIsWaving(true);
        setParticlesVisible(true);
        setAnimationPhase('wave');
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        // Fase 3: Ocultar saludo y continuar con pulse sutil
        setShowGreeting(false);
        setIsWaving(false);
        setParticlesVisible(false);
        setAnimationPhase('pulse');
        
        // Callback cuando termine el saludo
        if (onGreetingComplete) {
          onGreetingComplete();
        }
      };
      
      sequence();
    }
  }, [isGreeting]); // Remover onGreetingComplete de las dependencias

  // Efecto separado para resetear si isGreeting cambia de false a true
  useEffect(() => {
    if (!isGreeting) {
      setHasGreeted(false); // Resetear cuando isGreeting es false
    }
  }, [isGreeting]);

  const getAnimationClass = () => {
    switch (animationPhase) {
      case 'bounce':
        return 'animate-avatar-bounce';
      case 'wave':
        return 'animate-avatar-wave';
      case 'pulse':
        return 'animate-avatar-pulse';
      default:
        return '';
    }
  };
  return (
    <div className="relative z-40" style={{ overflow: 'visible', height: size, width: 'auto', minWidth: size + 200 }}>
      {/* Avatar principal con animaciones */}
      <div
        className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-200 via-purple-200 to-indigo-100 shadow-lg border-3 border-indigo-300 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${getAnimationClass()} ${className}`}
        style={{ width: size, height: size, minWidth: size, minHeight: size }}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover rounded-full"
            style={{ animation: "avatarFadeIn 0.8s" }}
          />
        ) : (
          <span className="text-indigo-700 font-bold select-none" style={{ fontSize: size * 0.4 }}>
            {fallbackText}
          </span>
        )}

        {/* Efectos visuales decorativos */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
        
        {/* Anillo de brillo cuando está saludando */}
        {isWaving && (
          <div className="absolute -inset-2 rounded-full border-2 border-yellow-400 animate-ping opacity-75"></div>
        )}
      </div>

      {/* Mano saludando */}
      {isWaving && (
        <div 
          className="absolute -top-2 -right-2 text-2xl animate-wave-hand"
          style={{ fontSize: size * 0.3 }}
        >
          👋
        </div>
      )}

      {/* Burbuja de saludo */}
      {showGreeting && (
        <div className="absolute -top-4 left-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-2xl px-3 py-2 animate-greeting-bubble z-[9999] pointer-events-none min-w-max max-w-xs">
          <div className="text-xs font-semibold flex items-center gap-1 leading-tight">
            <span className="animate-bounce text-sm">👋</span>
            <span className="whitespace-nowrap">{currentGreeting}</span>
            <span className="animate-pulse text-sm">✨</span>
          </div>
          {/* Flecha de la burbuja apuntando hacia el avatar */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-3 border-b-3 border-r-3 border-transparent border-r-blue-500"></div>
        </div>
      )}

      {/* Partículas de celebración mejoradas */}
      {particlesVisible && (
        <div className="absolute inset-0 pointer-events-none z-[9998]">
          <div className="absolute -top-2 right-4 text-yellow-400 animate-float-up animation-delay-100">✨</div>
          <div className="absolute top-1/4 right-8 text-blue-400 animate-float-up animation-delay-300">⭐</div>
          <div className="absolute -top-1 right-12 text-purple-400 animate-float-up animation-delay-500">💫</div>
          <div className="absolute top-1/2 right-16 text-green-400 animate-float-up animation-delay-700">🌟</div>
          <div className="absolute bottom-1/4 right-6 text-pink-400 animate-float-up animation-delay-900">✨</div>
        </div>
      )}
      {/* Animaciones CSS mejoradas */}
      <style>
        {`
          @keyframes avatarBounce {
            0% { transform: scale(0.8) rotate(-5deg); opacity: 0.5; }
            30% { transform: scale(1.2) rotate(2deg); opacity: 0.8; }
            60% { transform: scale(1.1) rotate(-1deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          
          @keyframes avatarWave {
            0%, 100% { transform: scale(1) rotate(0deg); }
            25% { transform: scale(1.05) rotate(2deg); }
            50% { transform: scale(1.1) rotate(-1deg); }
            75% { transform: scale(1.05) rotate(1deg); }
          }
          
          @keyframes avatarPulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4); }
            50% { transform: scale(1.02); box-shadow: 0 0 0 8px rgba(79, 70, 229, 0); }
          }
          
          @keyframes waveHand {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(20deg); }
            50% { transform: rotate(-15deg); }
            75% { transform: rotate(25deg); }
          }
          
          @keyframes greetingBubble {
            0% { opacity: 0; transform: scale(0.8); }
            10% { opacity: 1; transform: scale(1.05); }
            15% { transform: scale(1); }
            85% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.8); }
          }
          
          @keyframes floatUp {
            0% { opacity: 1; transform: translateY(0px) scale(0.8); }
            50% { opacity: 1; transform: translateY(-20px) scale(1); }
            100% { opacity: 0; transform: translateY(-40px) scale(0.6); }
          }
          
          @keyframes avatarFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .animate-avatar-bounce {
            animation: avatarBounce 0.8s cubic-bezier(.68,-0.55,.27,1.55);
          }
          
          .animate-avatar-wave {
            animation: avatarWave 2s ease-in-out infinite;
          }
          
          .animate-avatar-pulse {
            animation: avatarPulse 3s ease-in-out infinite;
          }
          
          .animate-wave-hand {
            animation: waveHand 0.6s ease-in-out infinite;
            transform-origin: 70% 70%;
          }
          
          .animate-greeting-bubble {
            animation: greetingBubble 2s ease-in-out;
            z-index: 9999 !important;
            position: relative;
          }
          
          .animate-float-up {
            animation: floatUp 1.5s ease-out infinite;
          }
          
          .animation-delay-100 { animation-delay: 0.1s; }
          .animation-delay-300 { animation-delay: 0.3s; }
          .animation-delay-500 { animation-delay: 0.5s; }
          .animation-delay-700 { animation-delay: 0.7s; }
          .animation-delay-900 { animation-delay: 0.9s; }
          
          /* Efecto hover adicional */
          .animate-avatar-bounce:hover {
            animation: avatarWave 0.6s ease-in-out;
          }
          
          .animate-avatar-pulse:hover {
            animation: avatarBounce 0.6s ease-in-out;
          }
        `}
      </style>
    </div>
  );
} 