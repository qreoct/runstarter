import React from 'react';
import { SafeAreaView } from 'react-native';

import { ModalHeader } from '@/ui/core/modal/modal-header';

import { RunReport } from './run-report';

type RunReportModalProps = {
  gameId: string;
  runId: string;
  onFinish: () => void;
};

export const RunReportModal = ({
  gameId,
  runId,
  onFinish,
}: RunReportModalProps) => {
  return (
    <SafeAreaView>
      <ModalHeader
        title=""
        dismiss={() => {
          onFinish();
        }}
      />
      <RunReport gameId={gameId} runId={runId} />
    </SafeAreaView>
  );
};
