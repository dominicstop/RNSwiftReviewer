//import { Header } from 'react-navigation-stack';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';


export class HeaderValues {
  static Constants = {
    headerHeight     : 50 , //Full: 64 , w/o inset: 44
    headerHeightLarge: 115, //Full: 115, w/o inset: 95
  };

  static getHeaderHeight(withInset = false) {
    const { headerHeight } = HeaderValues.Constants;

    return(withInset
      ? headerHeight + StaticSafeAreaInsets.safeAreaInsetsTop
      : headerHeight 
    );
  };

  static getHeaderHeightLarge(withInset = false) {
    const { headerHeightLarge } = HeaderValues.Constants;
    
    return(withInset
      ? headerHeightLarge + StaticSafeAreaInsets.safeAreaInsetsTop
      : headerHeightLarge
    );
  };
};