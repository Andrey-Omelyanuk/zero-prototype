import { observable, reaction } from 'mobx'


class SideBar {
    @observable is_opened = true
    toggle() { this.is_opened = ! this.is_opened }
    close () { this.is_opened = false }
    open  () { this.is_opened = true  }
}


class SideBars {
    left  = new SideBar()
    right = new SideBar()
}

let sidebars = new SideBars()
export default sidebars
declare let window
(window as any).sidebars = sidebars

let left_is_opened = localStorage.getItem('left-sidebar') 
if (left_is_opened)
    sidebars.left.is_opened = (left_is_opened === 'true')

reaction(
    () => sidebars.left.is_opened,
    () => localStorage.setItem('left-sidebar', sidebars.left.is_opened.toString()) 
)