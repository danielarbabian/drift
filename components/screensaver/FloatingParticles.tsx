import { useEffect, useState, memo } from 'react';
import { ANIMATION_CONSTANTS } from '@/lib/constants';

type Particle = {
  id: number;
  left: number;
  top: number;
  animationDelay: number;
  animationDuration: number;
};

interface FloatingParticlesProps {
  isClient: boolean;
}

function FloatingParticlesComponent({ isClient }: FloatingParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isClient) {
      const newParticles: Particle[] = Array.from(
        { length: ANIMATION_CONSTANTS.PARTICLE_COUNT },
        (_, i) => ({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          animationDelay: i * ANIMATION_CONSTANTS.PARTICLE_DELAY_MULTIPLIER,
          animationDuration:
            ANIMATION_CONSTANTS.PARTICLE_BASE_DURATION +
            Math.random() * ANIMATION_CONSTANTS.PARTICLE_RANDOM_DURATION,
        })
      );
      setParticles(newParticles);
    }
  }, [isClient]);

  return (
    <div className="absolute inset-0">
      {isClient &&
        particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-float"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.animationDelay}s`,
              animationDuration: `${particle.animationDuration}s`,
            }}
          />
        ))}
    </div>
  );
}

export const FloatingParticles = memo(FloatingParticlesComponent);
