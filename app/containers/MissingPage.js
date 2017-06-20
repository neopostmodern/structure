import React from 'react';
import Centered from '../components/Centered';

class MissingPage extends React.Component {
  render() {
    return <Centered text={`No idea where to find ${ this.props.location.pathname }`} />;
  }
}

export default MissingPage;
