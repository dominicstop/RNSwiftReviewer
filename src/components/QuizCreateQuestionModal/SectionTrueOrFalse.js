import React from 'react';
import PropTypes from 'prop-types';

import SegmentedControlIOS from '@react-native-community/segmented-control';

import { ModalSection } from 'app/src/components/ModalSection';

import * as Colors   from 'app/src/constants/Colors';
import * as Helpers  from 'app/src/functions/helpers';


export class SectionTrueOrFalse extends React.PureComponent {
  constructor(props){
    super(props);
    
    this.state = {
      selectedIndex: (
        props.initialValue? 0 : 1
      ),
    };
  };

  getAnswerValue = () => {
    const { selectedIndex } = this.state;
    return( selectedIndex == 0 );
  };

  _handleOnChange = ({nativeEvent}) => {
    this.setState({
      selectedIndex: nativeEvent.selectedSegmentIndex
    });
  };

  render(){
    const { selectedIndex } = this.state;

    return(
      <ModalSection showBorderTop={false}>
        <SegmentedControlIOS
          style={{height: 35}}
          values={['True', 'False']}
          activeTextColor={Colors.BLUE[1000]}
          onChange={this._handleOnChange}
          {...{selectedIndex}}
        />
      </ModalSection>
    );
  };
};