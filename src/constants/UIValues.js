import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import { HeaderValues } from 'app/src/constants/HeaderValues';

export const INSET_BOTTOM = StaticSafeAreaInsets.safeAreaInsetsBottom;

// navbar values
export const NAVBAR_NORMAL = HeaderValues.getHeaderHeight     (true);
export const NAVBAR_LARGE  = HeaderValues.getHeaderHeightLarge(true);

// tabbar values
export const TB_HEIGHT = 65;
export const TB_HEIGHT_ADJ = TB_HEIGHT + INSET_BOTTOM;

// list sticky header values
export const LIST_SECTION_HEIGHT = 27;

// modal values
export const MODAL_HEADER_HEIGHT = 77;
export const MODAL_BOTTOM_PADDING = 100;

