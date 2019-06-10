import { User } from './user'


describe('Model: User', () => {
    it('Encryption', async ()=> {
        let user = new User()
        expect(user.key.getPublicKey ().startsWith('-----BEGIN PUBLIC KEY-----'))
        expect(user.key.getPrivateKey().startsWith('-----BEGIN RSA PRIVATE KEY-----'))

        let txt = 'some test!'
        let txt_crypted   = user.key.encrypt(txt)
        let txt_decrypted = user.key.decrypt(txt_crypted)
        expect(txt_decrypted).toBe(txt)
    })
})
