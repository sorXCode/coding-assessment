//import the libraries
const nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

const user_a_keys_pair = nacl.box.keyPair();
const user_b_keys_pair = nacl.box.keyPair();


function encrypt(plain_text) {
    const shared_key = nacl.box.before(user_b_keys_pair.publicKey, user_a_keys_pair.secretKey);

    //user_a also computes a one time code.
    const one_time_code = nacl.randomBytes(24);

    //Getting the cipher text
    const cipher_text = nacl.box.after(
        nacl.util.decodeUTF8(plain_text),
        one_time_code,
        shared_key
    );

    //message to be transited.
    const message_in_transit = { cipher_text, one_time_code };

    return message_in_transit;
};


function decrypt(message) {
    //Getting user_b's shared key
    const user_b_shared_key = nacl.box.before(user_a_keys_pair.publicKey, user_b_keys_pair.secretKey);

    //Get the decoded message
    let decoded_message = nacl.box.open.after(message.cipher_text, message.one_time_code, user_b_shared_key);

    //Get the human readable message
    let plain_text = nacl.util.encodeUTF8(decoded_message)

    //return the message
    return plain_text;
}



message = "Hello Crypto"
encrypted_message = encrypt(message);
console.log("encrypted_message: ", encrypted_message)

decrypted_message = decrypt(encrypted_message)
console.log("decrypted message: ", decrypted_message)