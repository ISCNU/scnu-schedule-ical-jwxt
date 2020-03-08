import React from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';
import { useAsync } from '@umijs/hooks';

const FinishCircleVariants: Variants = {
  initial: {
    pathLength: 0
  },
  show: {
    pathLength: 1
  }
};

export default function FinishCircle() {
  const circleAnimator = useAnimation();
  const symbolAnimator = useAnimation();

  useAsync(async () => {
    circleAnimator.stop();
    symbolAnimator.stop();
    circleAnimator.set('initial');
    symbolAnimator.set('initial');
    await circleAnimator.start('show', { duration: 0.6 });
    await symbolAnimator.start('show');
  }, []);

  return (
    <svg className="progress-icon" viewBox="0 0 60 60" style={{ height: 128 }}>
      <motion.path
        fill="none"
        strokeWidth="3"
        stroke="white"
        strokeDasharray="0 1"
        d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
        style={{
          rotate: 90,
          translateX: 5,
          translateY: 5,
          scaleX: -1 // Reverse direction of line animation
        }}
        initial="initial"
        animate={circleAnimator}
        variants={FinishCircleVariants}
      />
      <motion.path
        fill="none"
        strokeWidth="5"
        stroke="white"
        d="M14,26 L 22,33 L 35,16"
        strokeDasharray="0 1"
        initial="initial"
        animate={symbolAnimator}
        variants={FinishCircleVariants}
      />
    </svg>
  );
}
