import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

// wraps children inside a card w/ shadow
class ListCardComp extends React.PureComponent {
  static styles = StyleSheet.create({
    rootContainer: {
      marginHorizontal: 10,
      marginTop: 15,
      backgroundColor: 'white',
      paddingHorizontal: 10,
      paddingTop: 11,
      paddingBottom: 13,
      borderRadius: 10,
      //shadow style
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
    },
  });

  render(){
    const { styles } = ListCardComp;
    const { children, style, ...props } = this.props;

    return(
      <View 
        style={[styles.rootContainer, style]}
        ref={props.innerRef}
        {...props}
      >
        {children}
      </View>
    );
  };
};

export const ListCard = React.forwardRef((props, ref) => (
  <ListCardComp
    innerRef={ref}
    {...props}
  />
));