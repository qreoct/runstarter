import React from 'react';
import { SafeAreaView } from 'react-native';

import { ModalHeader } from '@/ui/core/modal/modal-header';

import { RunReport } from './run-report';

type RunReportModalProps = {
  runId: string;
  onFinish: () => void;
};

export const RunReportModal = ({ runId, onFinish }: RunReportModalProps) => {
  return (
    <SafeAreaView>
      <ModalHeader
        title=""
        dismiss={() => {
          onFinish();
        }}
      />
      <RunReport runId={runId} />
    </SafeAreaView>
  );
};
