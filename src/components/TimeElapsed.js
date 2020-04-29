import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

import moment from "moment";

import * as Helpers from 'app/src/functions/helpers';


export class TimeElasped extends React.Component {
  static propTypes = {
    startTime: PropTypes.number.isRequired,
  };

  constructor(props){
    super(props);
    this.state = {
      time: this.getTimeElapsed(),
    };

    this.interval = null;
  };

  shouldComponentUpdate(nextProps, nextState){
    const prevProps = this.props;
    const prevState = this.state;

    return (
      (prevProps.startTime != nextProps.startTime) ||
      (prevState.time      != nextState.time     )
    );
  };

  componentDidMount(){
    this.start();
  };

  componentWillUnmount(){
    this.stop();
  };

  getTimeElapsed = () => {
    const { startTime } = this.props;

    const date        = new Date();
    const currentTime = date.getTime();

    const diffTime = (currentTime - startTime);
    const duration = moment.duration(diffTime, 'milliseconds');

    const hours    = Helpers.addLeadingZero(duration.hours  ());
    const minutes  = Helpers.addLeadingZero(duration.minutes());
    const seconds  = Helpers.addLeadingZero(duration.seconds());

    return(`${hours}:${minutes}:${seconds}`);
  };

  start = () => {
    //stop if there's already a timer
    if(this.interval) return;

    this.interval = setInterval(() => {
      const time = this.getTimeElapsed();
      this.setState({time});
    }, 1000);
  };

  stop(){
    if(this.interval){
      clearInterval(this.interval);
      this.interval = null;
    };
  };

  render(){
    const { startTime, ...textProps } = this.props;
    const { time } = this.state;

    return(
      <Text {...textProps}>
        {time}
      </Text>
    );
  };
};