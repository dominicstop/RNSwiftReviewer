import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import { iOSUIKit         } from 'react-native-typography';
import { Divider          } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

import * as Colors  from 'app/src/constants/Colors';
import * as Helpers from 'app/src/functions/helpers';


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


export class TableLabelValue extends React.Component {
  static propTypes = {
    labelValueMap: PropTypes.array,
  };
  
  static styles = StyleSheet.create({
    rowContainer: {
      flexDirection: 'row',
    },
    columnLeftContainer: {
      flex: 1,
      marginRight: 5,
    },
    columnRightContainer: {
      flex: 1,
      marginLeft: 5,
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
      color: Colors.GREY[800]
    },
  });

  render(){
    const { styles } = TableLabelValue;
    const props = this.props;

    let labelValueItems = transformLabelValueMap(props.labelValueMap);

    return(
      <View>
        {labelValueItems.map((row, indexRow) => (
          <View style={styles.rowContainer}>
            {row.map((col, indexCol) => (
              <View style={[
                styles.textDetailContainer, 
                (indexCol == 0) && styles.columnLeftContainer ,
                (indexCol == 1) && styles.columnRightContainer,
              ]}>
                <Text
                  style={styles.textDetailLabel}
                  numberOfLines={1}
                >
                  {col[0]}
                </Text>
                <Text
                  style={styles.textDetail}
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

