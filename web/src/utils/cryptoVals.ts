import AES from 'crypto-js/aes'
import CryptoJS from 'crypto-js'

const secret_key = 'UqX46TFlb5yxNbd6SoPF4B5MT4FMMs0C'

export const encrypt = (value:any) => {
    return AES.encrypt(value, secret_key).toString()
}

export const decrypt = (value:any) => {
    return AES.decrypt(value, secret_key).toString(CryptoJS.enc.Utf8)
}