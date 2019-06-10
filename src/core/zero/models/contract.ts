import { computed, observable, action } from 'mobx'
import { Model, model, id, field, foreign, many, datetime, number} from 'mobx-orm'
import { User } from './user'
import CryptoJS from 'crypto-js'


@model
export class Contract extends Model {
    @id         id          : number
    @field      txt         : string

    @computed({keepAlive: true}) get hash() {
        return CryptoJS.MD5(this.txt)
    }

    @many('ContractSign', 'contract_id') signs: ContractSign[]

    async registerSign(user) {
        let contract_sign = new ContractSign({
            contract_id : this.id,
            timestamp   : new Date(),
            user,
            sign        : user.key.encrypt(this.hash)
        })
        await contract_sign.save()
        return contract_sign
    }
}

@model
export class ContractSign extends Model {
    @id         id          : number
    @number     contract_id : number
    @number     user_id     : number
    @datetime   timestamp   : Date
    @field      sign        : string

    @foreign('Contract') constract: Contract
    @foreign('User'    ) user     : User
}