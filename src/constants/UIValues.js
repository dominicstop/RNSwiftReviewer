import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import { HeaderValues } from 'app/src/constants/HeaderValues';

export const INSET_BOTTOM = StaticSafeAreaInsets.safeAreaInsetsBottom;

//#region - navbar values
export const NAVBAR_NORMAL = HeaderValues.getHeaderHeight     (true);
export const NAVBAR_LARGE  = HeaderValues.getHeaderHeightLarge(true);
//#endregion

//#region - tabbar values
export const TB_HEIGHT = 65;
export const TB_HEIGHT_ADJ = TB_HEIGHT + INSET_BOTTOM;
//#endregion

//#region - list sticky header values
export const LIST_SECTION_HEIGHT = 27;
//#endregion