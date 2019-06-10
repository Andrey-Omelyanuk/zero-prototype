import { Model, model, id, field, foreign, many, datetime, number} from 'mobx-orm'
import { Contract } from './contract'
import { JSEncrypt } from 'jsencrypt'

@model
export class User extends Model {
    @id         id          : number
    @field      username    : string
                key         : JSEncrypt

    constructor(init_data?) {
         super(init_data)
         this.key = new JSEncrypt({default_key_size: 512})
         this.key.getKey()
    }

    async createContract(txt): Promise<Contract> {
        let contract = new Contract({txt})
        await contract.save()
        return contract 
    }

    async createAccount() {
    }
}