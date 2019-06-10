import './app.styl'
import React from 'react'
import { observer }     from 'mobx-react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import router           from './router'
import sidebars         from 'src/core/sidebars'
import LeftSidebar      from 'src/core/sidebars/components/left-sidebar'
import LayoutCenterMain from './layouts/center/main'


@observer
class App extends React.Component {
    render() {
        return (
            <div className={`app ${sidebars.left.is_opened ? '': 'left-sidebar__is-closed'} ${sidebars.right.is_opened ? '': 'right-sidebar__is-closed'}`}>
                <div className='app__left-sidebar-placeholder'></div>
                <div className='app__left-sidebar'>
                    <LeftSidebar/> 
                </div>
                <div className='app-content'>
                    <div> Empty </div>
                    <Router>
                        <Route path='/' render={ (props) => { 
                            router.setHistory(props.history)
                            setTimeout(() => { router.setValuesFromUrl(props.history.location.pathname) })
                            return null 
                        }} />
                        <Route exact path='/' component={ LayoutCenterMain } />
                    </Router>
                </div>
                <div className='app__rigth-sidebar-placeholder'></div>
                <div className='app__rigth-sidebar'>
                    <Router>
                        <Route path='/' render={ (props) => { 
                            return (<div> right sidebar </div>) 
                        }} />
                    </Router>
                </div>
            </div>
        )
    }
}

export default App
