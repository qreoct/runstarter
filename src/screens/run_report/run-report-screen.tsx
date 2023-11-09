import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';

import type { ProfileStackParamList } from '@/navigation/profile-navigator';

import { RunReport } from './run-report';

// from https://reactnavigation.org/docs/typescript/
type RunReportScreenProps = NativeStackScreenProps<
  ProfileStackParamList,
  'RunReport'
>;

export const RunReportScreen = ({ route }: RunReportScreenProps) => {
  const { gameId, runId } = route.params;
  return <RunReport gameId={gameId} runId={runId} />;
};
