import React, { ReactNode, useEffect, useState } from 'react'

import Gallary from '../Gallary'
import { getImages } from '../../services/api'
import './style.less'

const Home = ():ReactNode => {
    const [ list, setList ] = useState([])
    useEffect(() => {
        getImages({ user_id: '5dd6b7018807cf0fab4f2334'}).then(res => {
            let data = []
            res.data.map(item => {
                data = data.concat(item.img_url)
            })
            setList(data)
        })
    }, [])

    return (
        <div className='home'>
            <div className="left">
                left
            </div>
            <div className="right">
                <Gallary list={list} showModal={true} />
            </div>
        </div>
    )
}

export default Home