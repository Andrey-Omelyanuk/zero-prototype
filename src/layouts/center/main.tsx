import React        from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react'
import { store } from 'mobx-orm'
import Layout from 'src/core/layout'
import { User, Key } from 'src/core/zero/models'

store.clear()

@observer
export default class LayoutCenterMain extends Layout {
    @computed get users() : User[] { return User.all() as User[] }

    async load(): Promise<any> {
        let userA = new User({username: 'A'}); await userA.save()
        let userB = new User({username: 'B'}); await userB.save()
        let userC = new User({username: 'C'}); await userC.save()
    }

    render() {
        return (
            <div>
                {this.users.length}
            </div>
        )
    }
}
