import './app.styl'
import React from 'react'
import { observer }     from 'mobx-react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import router           from './router'
import sidebars         from 'src/core/sidebars'
import LeftSidebar      from 'src/core/sidebars/components/left-sidebar'


@observer
class App extends React.Component {
  render() {
    return (
        <div className={`app ${sidebars.left.is_opened ? '': 'left-sidebar__is-closed'}`}>
            {/* app__left-sidebar-placeholder overlaps app__left-sidebar, we need it for good animation */}
            <div className='app__left-sidebar-placeholder'></div>
            <div className='app__left-sidebar'>
                <LeftSidebar/> 
            </div>
            <div className='app-content'>
                <div> Empty </div>
                <Router>
                <Route       path='/' render={ (props) => { 
                    router.setHistory(props.history)
                    setTimeout(() => { router.setValuesFromUrl(props.history.location.pathname) })
                    return null 
                }} />
                </Router>
            </div>
      </div>
    )
  }
}

export default App
