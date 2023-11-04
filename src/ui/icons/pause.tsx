import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export const Pause = ({ color = '#000', ...props }: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 -960 960 960" {...props}>
    <Path
      d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"
      fill={color}
    />
  </Svg>
);
