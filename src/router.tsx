import React, { ReactNode } from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'

import Home from './containers/Home'
import Box from './containers/Box'
import Test from './containers/Test'
import Socket from './containers/Socket'

type child = {
    path: string,
    com?: any,
}

const Router = (): ReactNode => {

    const config: Array<child> = [
        {
            path: '/',
            com: Home
        },
        {
            path: '/box',
            com: Box
        },
        {
            path: '/test',
            com: Test
        },
        {
            path: '/socket',
            com: Socket
        }
    ]

    return (
        <HashRouter>
            <Switch>
                {
                    config.map(({ path, com }) => <Route exact key={path} path={path} component={com} />)
                }
            </Switch>
        </HashRouter>
    )
}

export default Router