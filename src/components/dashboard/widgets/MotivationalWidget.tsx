import React, { useState, useEffect } from 'react';
import { Target, Calendar, Zap } from 'lucide-react';
import { MOTIVATIONAL_QUOTES } from '../../../utils/constants';

export const MotivationalWidget: React.FC = () => {
  const [quote, setQuote] = useState('');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    // Set random quote
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setQuote(randomQuote);

    // Calculate time left (6 months from now - you can adjust this date)
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + 6);
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Motivación Diaria</h3>
        <Zap className="w-6 h-6" />
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-white bg-opacity-20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">Tiempo Restante</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-2xl font-bold">{timeLeft.days}</div>
              <div className="text-xs opacity-80">días</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{timeLeft.hours}</div>
              <div className="text-xs opacity-80">horas</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{timeLeft.minutes}</div>
              <div className="text-xs opacity-80">min</div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-white bg-opacity-20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Frase del Día</span>
          </div>
          <p className="text-sm leading-relaxed italic">
            "{quote}"
          </p>
        </div>
      </div>
    </div>
  );
};