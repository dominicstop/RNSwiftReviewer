import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

export class IconTextView extends React.PureComponent {
  static propTypes = {
    text          : PropTypes.string,
    iconDistance  : PropTypes.number,
    containerStyle: PropTypes.object,
    textStyle     : PropTypes.object,
  };

  static defaultProps = {
    iconDistance: 10,
    text: 'Lorum Ipsum',
  };

  static styles = StyleSheet.create({
    rootContainer: {
      flexDirection: 'row',
    },
  });

  render(){
    const { styles } = IconTextView;
    const props = this.props;

    const children = React.Children.toArray(props.children);

    const textStyle = {
      marginLeft: props.iconDistance
    };

    return(
      <View style={[styles.rootContainer, props.containerStyle]}>
        {children[0]}
        <Text 
          style={[styles.text, textStyle, props.textStyle]}
          numberOfLines={1}
        >
          {props.text}
        </Text>
      </View>
    );
  };
};