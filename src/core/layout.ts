import React    from 'react'
import { RouteComponentProps } from 'react-router'
import { observable, autorun } from 'mobx'


export default class Layout extends React.Component<RouteComponentProps> {
    @observable is_loading = true
    unsubscribe_load

    constructor(props) {
        super(props)
        this.unsubscribe_load = autorun(() => {
            this.is_loading = true
            this.load().then(() => this.is_loading = false)
        })
    }

    async load(): Promise<any> {
        return new Promise((resolve, reject) => { resolve() })
    }

    componentWillUnmount() {
        this.unsubscribe_load()
    }
}
