import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import { iOSUIKit } from 'react-native-typography';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';

// converts: [['label', 'value'], ['label', 'value'], ...]
function transformLabelValueMap(labelValueMap){
  let labelValueItems = labelValueMap.slice();

  let rows = [];
  let cols = [];
  
  while(labelValueItems.length != 0){
    if(cols.length < 2){
      cols.push(
        labelValueItems.shift()
      );

    } else {
      // col full, reset col
      rows.push(cols);
      cols = [];
    };
  };

  //push last col, if any
  if(cols.length > 0){
    rows.push(cols);
    cols = [];
  };

  return rows;
};

// displays a row/col of: 
// (Label:  value  Label: value) elements
export class TableLabelValue extends React.PureComponent {
  static propTypes = {
    labelValueMap: PropTypes.array,
  };
  
  static styles = StyleSheet.create({
    rowContainer: {
      flexDirection: 'row',
    },
    columnLeftContainer: {
      flex: 1,
      marginRight: 8,
    },
    columnRightContainer: {
      flex: 1,
      marginLeft: 8,
    },
    textDetailContainer: {
      flexDirection: 'row',
      flex: 1,
    },
    textDetailLabel: {
      ...iOSUIKit.subheadEmphasizedObject,
      flex: 1,
      color: Colors.GREY[900]
    },
    textDetail: {
      ...iOSUIKit.subheadObject,
      color: Colors.GREY[700]
    },
  });

  render(){
    const { styles } = TableLabelValue;
    const props = this.props;

    let labelValueItems = transformLabelValueMap(props.labelValueMap);

    return(
      <View style={props.containerStyle}>
        {labelValueItems.map((row, indexRow) => (
          <View 
            key={`row-${indexRow}`}
            style={styles.rowContainer}
          >
            {row.map((col, indexCol) => (
              <View
                key={`row-${indexRow}-col-${indexCol}`}
                style={[
                  styles.textDetailContainer, 
                  (indexCol == 0) && styles.columnLeftContainer ,
                  (indexCol == 1) && styles.columnRightContainer,
                ]}
              >
                <Text
                  key={`label-${indexRow}-${indexCol}`}
                  style={[styles.textDetailLabel, props.textDetailLabelStyle]}
                  numberOfLines={1}
                >
                  {col[0]}
                </Text>
                <Text
                  key={`detail-${indexRow}-${indexCol}`}
                  style={[styles.textDetail, props.textDetailStyle]}
                  numberOfLines={1}
                >
                  {col[1]}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };
};

