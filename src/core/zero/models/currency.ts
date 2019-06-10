import { computed, observable, action }           from 'mobx'
import { Model, model, id, field, foreign, many, datetime, number} from 'mobx-orm'


@model
export class Currency extends Model {
    @id         id      : number
    @field      code    : string

    /**
     * Only main and zero accounts can be negative balance.
     * Main account for create new money from nothing.
     * Zero account for zero node.
     */
    @number     account_main_id : number
    @number     account_zero_id : number
    @foreign('CurrencyAccount') account_main: CurrencyAccount
    @foreign('CurrencyAccount') account_zero: CurrencyAccount

    constructor(init_data?) {
        super(init_data)
        // TODO: create currency key
        // TODO: create main user and key for it
        // TODO: create account for main user 
    }

    registerUser() { }
    registerKey() { }
    createAccount() { }
}

@model 
export class CurrencyAccount extends Model {
    @id         id          : number
    @number     currency_id : number
    @number     number      : number

    async request() {

    }
}