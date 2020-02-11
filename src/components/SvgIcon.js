import React from 'react';
import SvgIcon from 'react-native-svg-icon';

import svgs from 'app/src/components/SvgIcons';

const Icon = (props) => (
  <SvgIcon 
    width ={props.size}
    height={props.size}
    //pass down other props
    {...{svgs, ...props}}   
  />
);

export default Icon;