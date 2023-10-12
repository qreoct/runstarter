import React from 'react';

import { FocusAwareStatusBar } from '@/ui';

import { StepsCounter } from './steps-counter';

export const Steps = () => {
  return (
    <>
      <FocusAwareStatusBar />
      <StepsCounter />
    </>
  );
};
