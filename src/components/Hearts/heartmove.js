import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import './style.less';

const HeartMove = (props) => {
    const color = `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`;
    const fontSize = props.fontSize || '18px';
    return (
        <Icon className='heart-move' theme="filled" type="heart" style={{ color, fontSize }} />
    )
}

HeartMove.propTypes = {
    fontSize: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
}

export default HeartMove;