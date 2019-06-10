import { store } from 'mobx-orm'
import { User } from './user'


describe('Model: contract', () => {
    let userA : User, userB : User, userC : User

    beforeAll(async function() {
        store.clearModel('User')
        store.clearModel('Contract')
        store.clearModel('ContractSign')
        userA = new User({username: 'A'}); await userA.save()
        userB = new User({username: 'B'}); await userB.save()
        userC = new User({username: 'C'}); await userC.save()
    })

    it('Create and sign contract', async ()=> {
        let contract = await userA.createContract('test contract')
        contract.registerSign(userA)
        contract.registerSign(userB)
        contract.registerSign(userC)

    })
})
