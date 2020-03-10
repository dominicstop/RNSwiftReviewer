import { Header } from 'react-navigation-stack';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';


export class HeaderValues {
  static Constants = {
    headerHeight     : Header.HEIGHT     , //Full: 64 , w/o inset: 44
    headerHeightLarge: Header.HEIGHT + 72, //Full: 115, w/o inset: 95 //+51
  };

  static getHeaderHeight(withInset = false) {
    const { headerHeight } = HeaderValues.Constants;

    return(withInset
      ? headerHeight 
      : headerHeight - StaticSafeAreaInsets.safeAreaInsetsTop
    );
  };

  static getHeaderHeightLarge(withInset = false) {
    const { headerHeightLarge } = HeaderValues.Constants;
    
    return(withInset
      ? headerHeightLarge
      : headerHeightLarge - StaticSafeAreaInsets.safeAreaInsetsTop
    );
  };
};