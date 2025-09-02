'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  staggerDelay?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className,
  delay = 0,
  duration = 0.05,
  staggerDelay = 0.02,
}) => {
  const letters = text.split('');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: staggerDelay,
      },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.25, 0.25, 0, 1],
      },
    },
  };

  return (
    <motion.span
      className={cn(className)}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={child}
          className={letter === ' ' ? 'inline-block w-2' : 'inline-block'}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.span>
  );
};

interface TypewriterTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  className,
  delay = 0,
  speed = 0.1,
}) => {
  return (
    <motion.span
      className={cn(className)}
      initial={{ width: 0 }}
      animate={{ width: 'auto' }}
      transition={{
        delay,
        duration: text.length * speed,
        ease: 'linear',
      }}
      style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
    >
      {text}
    </motion.span>
  );
};