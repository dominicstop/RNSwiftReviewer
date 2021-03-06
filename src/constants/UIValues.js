import { PixelRatio } from 'react-native';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

export const INSET_BOTTOM = StaticSafeAreaInsets.safeAreaInsetsBottom;
export const INSET_TOP    = StaticSafeAreaInsets.safeAreaInsetsTop;

// tabbar values
export const TB_HEIGHT = 65;
export const TB_HEIGHT_ADJ = TB_HEIGHT + INSET_BOTTOM;

// list sticky header values
export const LIST_SECTION_HEIGHT = 27;

// modal values
export const MODAL_HEADER_HEIGHT = 70;
export const MODAL_HEADER_HEIGHT_COMPACT = 20;

export const MODAL_FOOTER_HEIGHT  = 78 + INSET_BOTTOM;
export const MODAL_BOTTOM_PADDING = 100;

export const BORDER_WIDTH = (1 / PixelRatio.get());