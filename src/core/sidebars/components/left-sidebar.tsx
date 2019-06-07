import './left-sidebar.styl'
import React from 'react'
import { observer } from 'mobx-react'
import sidebars from '../index'


@observer
class LeftSidebar extends React.Component {
    render() {
        return (
            <div className='left-sidebar'>
                <button onClick={()=> {sidebars.left.toggle()}}>Sidebar</button>
            </div>
        )
    }
}

export default LeftSidebar
