import React, { Component, ReactNode } from 'react';
import { Button } from 'antd'

type Props ={
    list: any[]
}

class Test extends Component<Props, {}> {
    render(): ReactNode {
        return (
            <div>
                <Button type="primary">hhh</Button>
                <button>11</button>
            </div>
        )
    }
}

export default Test;