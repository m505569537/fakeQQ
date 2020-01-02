import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { Icon, message } from 'antd';

import './style.less';

class ImageSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.inputRef = createRef();
        this.labelRef = createRef();
    }

    handleFile = () => {
        let file = this.inputRef.current.files[0];
        if(!file){
            return;
        }
        const suffix = /\.(png|jpg|svg|gif)$/g;
        const name = file.name.toLowerCase();
        if(!suffix.test(name)) {
            message.error('请选择图片文件');
            this.inputRef.current.value = '';
        } else {
            const { getImg } = this.props
            if(window.FileReader) {
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (e) => {
                    getImg(file)
                    this.labelRef.current.style.backgroundImage = `url(${e.target.result})`;
                    this.labelRef.current.style.display = 'block';
                }
            }
        }
    }

    render() {
        return (
            <div className='image-select'>
                <input id={"upload"} type='file' style={{ display: 'none' }} onChange={this.handleFile} ref={this.inputRef} />
                <label htmlFor={"upload"}>
                    <Icon type="plus" style={{ fontSize: '40px', color: '#999999' }} />
                    <div ref={this.labelRef}></div>
                </label>
            </div>
        )
    }
}

ImageSelect.propTypes = {
    getImg: PropTypes.func,
}

export default ImageSelect;