/* 
    组件
    点击出现各种颜色的❤️
*/

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import Heartmove from './heartmove';

const Hearts = (props) => {
    const fontSize = props.fontSize || '18px';
    useEffect(() => {
        const body = document.body;
        document.addEventListener('click', (e) => {
            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.left = e.clientX - parseInt(fontSize)/2 + 'px';
            div.style.top = e.clientY - parseInt(fontSize) + 'px';
            ReactDOM.render(<Heartmove />, div);
            body.appendChild(div);
            setTimeout(() => {
                body.removeChild(div);
            }, 2000);
        });
    }, [])
    return (
        <div style={{ display: 'none' }}></div>
    )
}

export default Hearts;