import { store } from 'mobx-orm'
import { User, Contract, ContractSign  } from './models'



describe('Zero: models', () => {

    beforeEach(function() {
        store.clearModel('User')
        store.clearModel('Contract')
        store.clearModel('ContractSign')
    })

    it('...', async ()=> {
        let userA = new User({username: 'A'}); await userA.save()
        let userB = new User({username: 'B'}); await userB.save()
        let userC = new User({username: 'C'}); await userC.save()


        expect(true).toBeTruthy()
    })
})
