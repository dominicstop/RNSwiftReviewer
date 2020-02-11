import React from 'react';
import { G, Path } from 'react-native-svg';

export const SVG_KEYS = {
  // news-paper
  NewsPaperOutline: 'NewsPaperOutline',
  NewsPaperFilled : 'NewsPaperFilled' ,
  // document-text
  DocumentTextOutline: 'DocumentTextOutline',
  DocumentTextFilled : 'DocumentTextFilled' ,
};

export default {
  [SVG_KEYS.NewsPaperOutline]: {
    viewBox: "0 0 512 512",
    svg: (
      <G>
        <Path
          d="M368 415.86V72a24.07 24.07 0 00-24-24H72a24.07 24.07 0 00-24 24v352a40.12 40.12 0 0040 40h328"
          fill="none"
          stroke="#000"
          strokeLinejoin="round"
          strokeWidth={32}
        />
        <Path
          d="M416 464h0a48 48 0 01-48-48V128h72a24 24 0 0124 24v264a48 48 0 01-48 48z"
          fill="none"
          stroke="#000"
          strokeLinejoin="round"
          strokeWidth={32}
        />
        <Path
          fill="none"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={32}
          d="M240 128h64M240 192h64M112 256h192M112 320h192M112 384h192"
        />
        <Path d="M176 208h-64a16 16 0 01-16-16v-64a16 16 0 0116-16h64a16 16 0 0116 16v64a16 16 0 01-16 16z" />
      </G>
    ),
  },
  [SVG_KEYS.NewsPaperFilled]: {
    viewBox: "0 0 512 512",
    svg: (
      <G>
        <Path d="M439.91 112h-23.82a.09.09 0 00-.09.09V416a32 32 0 0032 32 32 32 0 0032-32V152.09A40.09 40.09 0 00439.91 112z" />
        <Path d="M384 416V72a40 40 0 00-40-40H72a40 40 0 00-40 40v352a56 56 0 0056 56h342.85a1.14 1.14 0 001.15-1.15 1.14 1.14 0 00-.85-1.1A64.11 64.11 0 01384 416zM96 128a16 16 0 0116-16h64a16 16 0 0116 16v64a16 16 0 01-16 16h-64a16 16 0 01-16-16zm208 272H112.45c-8.61 0-16-6.62-16.43-15.23A16 16 0 01112 368h191.55c8.61 0 16 6.62 16.43 15.23A16 16 0 01304 400zm0-64H112.45c-8.61 0-16-6.62-16.43-15.23A16 16 0 01112 304h191.55c8.61 0 16 6.62 16.43 15.23A16 16 0 01304 336zm0-64H112.45c-8.61 0-16-6.62-16.43-15.23A16 16 0 01112 240h191.55c8.61 0 16 6.62 16.43 15.23A16 16 0 01304 272zm0-64h-63.55c-8.61 0-16-6.62-16.43-15.23A16 16 0 01240 176h63.55c8.61 0 16 6.62 16.43 15.23A16 16 0 01304 208zm0-64h-63.55c-8.61 0-16-6.62-16.43-15.23A16 16 0 01240 112h63.55c8.61 0 16 6.62 16.43 15.23A16 16 0 01304 144z" />
      </G>
    ),
  },
  [SVG_KEYS.DocumentTextOutline]: {
    viewBox: "0 0 512 512",
    svg: (
      <G>
        <Path
          d="M416 221.25V416a48 48 0 01-48 48H144a48 48 0 01-48-48V96a48 48 0 0148-48h98.75a32 32 0 0122.62 9.37l141.26 141.26a32 32 0 019.37 22.62z"
          fill="none"
          stroke="#000"
          strokeLinejoin="round"
          strokeWidth={32}
        />
        <Path
          d="M256 56v120a32 32 0 0032 32h120M176 288h160M176 368h160"
          fill="none"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={32}
        />
      </G>
    ),
  },
  [SVG_KEYS.DocumentTextFilled]: {
    viewBox: "0 0 512 512",
    svg: (
      <G>
        <Path d="M428 224H288a48 48 0 01-48-48V36a4 4 0 00-4-4h-92a64 64 0 00-64 64v320a64 64 0 0064 64h224a64 64 0 0064-64V228a4 4 0 00-4-4zm-92 160H176a16 16 0 010-32h160a16 16 0 010 32zm0-80H176a16 16 0 010-32h160a16 16 0 010 32z" />
        <Path d="M419.22 188.59L275.41 44.78a2 2 0 00-3.41 1.41V176a16 16 0 0016 16h129.81a2 2 0 001.41-3.41z" />
      </G>
    ),
  },
};