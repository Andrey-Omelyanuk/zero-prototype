import { computed, observable, action }           from 'mobx'
import { Model, model, id, field, foreign, many, datetime, number} from 'mobx-orm'
import { computedDecorator } from 'mobx/lib/internal';


@model
export class User extends Model {
    @id         id          : number
    @field      username    : string
}


@model
export class Key extends Model {
    @id         id      : number
    @datetime   created : Date
    @field      private : string
    @field      public  : string

    constructor(init_data?) {
        super(init_data)
        // TODO: gen key pair
        this.private = 'private'
        this.public  = 'public'
    }

    // return hash of data
    sign(data: any) : string {
        let data_str = JSON.stringify(data)
        // TODO: sign 
        return ''
    }
}

@model 
export class UserKey extends Model {
    @id         id      : number
    @number     user_id : number
    @number     key_id  : number
}

@model
export class Currency extends Model {
    @id         id      : number
    @field      code    : string

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
export class CurrencyKey extends Model {

}

@model
export class CurrencyUser extends Model {

}

@model
export class CurrencyUserKey extends Model {

}

@model 
export class CurrencyAccount extends Model {
    @id         id          : number
    @number     currency_id : number
    @number     number      : number
}

@model
export class Zero extends Model {

}
