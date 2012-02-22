# Cryptocat
### Protocol Specification
### Nadim Kobeissi
### 1st Revision, 21/02/2012
### Non-final Draft

### Introduction
[Cryptocat](https://crypto.cat) is an open source web application intended to allow secure, encrypted online chatting. Cryptocat encrypts chats on the client side inside the browser, only trusting the server side with already-encrypted data. This specification will describe the Cryptocat protocol, including encryption, decryption, authentication and other relevant facets.

The protocol is developed with the following design goals:

* Provide an encrypted chat environment made for use in web browsers.
* Provide public key cryptography with perfect forward secrecy from chat to chat.
* Provide the ability for multi-party chat (more than two parties.)

Cryptocat deploys various technologies:

* AES-CBC is used for encryption and decryption with 256 bit keys and the ISO 10126 padding scheme.
* Diffie-Hellman is used for public key generation using a 4096 bit Sophie Germain prime.
* HMAC-SHA256 is used in order to generate message integrity hashes and in order to detect replay attacks.
* The Fortuna pseudo-randomness generator is recommended, and may be seeded via a combination of user behaviour and other erratic variables.

Cryptocat, including software and documentation, a trademark of and is developed by Nadim Kobeissi. It is released under the [Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-nc-sa/3.0/).

### User Identification and Key Pairs
Cryptocat relies on the Diffie-Hellman key agreement scheme in order to generate key pairs. The following 4096 bit Sophie Germain prime `p`, given in hexadecimal, with a generator `g = 2` (both generated using `ssh-keygen(1)`) may be used, although the security of the protocol is not affected if another 4096 bit Sophie Germain prime (so that `2p + 1` is also prime) is correctly chosen:

`p = `
`C41F45CE6AA3AEB23A9202F8152779A4E42223354306AE1DC3BCC95568518345`
`80A65E95D6EACA6845EA6DD53E21E01AEE47B58A20E02DCC092337B6D41BDF24`
`EB04A96C0C83F39E08EA00604A9E4D6D0E78E1515F89C2822AB96C6AD78D8364`
`EDFCC788C28CAA234A17807119C6ECD43CDF5210347E59145B7B8E37B497A617`
`A7CBA65CCE00BBA7693D9DECE37EF9D185689A2E6B2FCCF97830520FE2859863`
`CD370DE738C417B52320D728CFCA51808946A5DA1A94E5D27EFF02B607F178AC`
`CCB8237D8A756B918B22E1A88F5162CB2557F665889D56E18C622355AEEF2B83`
`4F0876E6B7CD0FD7B5C98AE6C27787BED4725394F0052D79159409EEFEED5861`
`96DBF39EDEB01507E1F99922B1EA1FB1B3ECF99820596A2F28EEE0AA136909F6`
`CEA12199207CA8348637473207611A7E97351C4B326FE69A32FFB2F98B3E52F9`
`EED788B34A5208D67C0E613AA8D21277A84BE24A5B2B5C8FD4E7BE4F53815DBD`
`B1A413C8EC99C47A530657D8C178DDD09E0F6D76C938504B0E59E7D6500E47BC`
`456C2C798F6898E1889DEABFAF39EF1147FD6705B85288C3156C307ECA33C3DE`
`9830AF6C261FCC11A760A809EF83633F32BD8BAF3339E7537F81F5BC1FE0158B`
`D4AE88D99C7EA8C19117D2DFE39775A3D0BA00CDFB244D36EF8AEABFB111C5FF`
`3771B3BAF8AFBAA33C1D1AF159FD577902A3DC600813EB83C93BAF4CB394C6D3`

Generating the private key `prikey` (a random number consisting of at least 24 base ten digits) relies critically on a strong random number generator, seeded using reliable levels of entropy. We have chosen the Fortuna RNG using AES-256 in CTR mode as the stream cipher and SHA-256 as the hashing function. For entropy sources, we may rely on mouse movement or keyboard input (including key press/depress timings.) Private keys are never preserved and are only used for a single chat.

Each user's `prikey` is stored within their client and is never shared. The user's public key, `pubkey`, is then generated as follows:

`pubkey = g^(prikey) mod p`

After being generated, `pubkey` is stored in base 64 and is communicated to the server in the following format, with nick as the user's chosen nickname:

`nick:pubkey|`

The server is responsible of dedicating line 0 of the chat session to storing the nicknames and keys of all current participants in the chat, in the following format (for a chat with n participants):

`nick1:pubkey1|nick2:pubkey2|[...]nickn:pubkeyn|`

Line 0 is sent to all users upon the joining or parting of any user. Once a user n logs out of the chat, `nickn:pubkeyn|` is deleted from line 0. The client is responsible for receiving the list of keys and storing them in an accessible manner for use in encryption. Note: nicknames may only be 1 to 12 lowercase alphabetic characters (`^[a-z]{1,12}$`). The following regular expression may be used to verify any key input:

`^[a-z]{1,12}:(\w|\/|\+|\?|\(|\)|\=)+\|$`

### Fingerprints
Cryptocat clients can generate public key fingerprints for each user using the following technique:

`fingerprintn += SHA256(pubkeyn).substring(10, 18) + ":";`
`fingerprintn += SHA256(pubkeyn).substring(20, 28) + ":";`
`fingerprintn += SHA256(pubkeyn).substring(30, 38) + ":";`
`fingerprintn += SHA256(pubkeyn).substring(40, 48) + ":";`
`fingerprintn += SHA256(pubkeyn).substring(50, 58);`

Here is an example of a public key `pubkeye` and its fingerprint `fingerprinte`:

`pubkeye =` 
`5yqf063mX6rWYzfnKdO=exhs\_ISQm1Xhw6bYzV0t7z13wfuh2jNtZqy=Bbeh`
`BX3OaIU9PxRlSIIJwStvLbPS4epZmdu7CBzfFRp68SE1=aIzvuKBsNjOJJNWx`
`GnyXONCGw\_5LL\_XHDv452MdLLHxDMsn8yyJQC4Y13X1q1ahEPu\_GYSNMmn`
`EVdxYaLnGPvCO9zOrs6I80U8xV8ehbbWytAlFvl6qMSJss3VdUP4kGuyQ4V7q`
`BeOg7HkkUPpnplVm2ePirC4AbllIfE\_mDlW6Kq5yztogMiya5hZSKovYFMLa`
`Xb39u=UoGzTcZLJGGRN73T6xeJDoB7lhKfumdQB8XAXk7hlYawGX6hcQVXMLa`
`1NvLy86PCZR9hEagHE2zNzhmyKkQNLjkQvJK0Crqzh7tkQUpm4txMvVZzXCa2`
`0P\_yPsCYz43elOjSZyuzmCGIHLQEwYf8nKHK=2kLI2kSE7x06xrYr9E0hdVH`
`UfHg0D4r8p6T86seVV\_=7wqmU36hxayho7j5YQHiCBFcfz9cVe0fPRXJDUy5`
`4vs0GzQR4wSm0fUEPFsL8PMVGZv50k9ddd9KCPc4CT7Z22pHA\_Fo6cxkoVtL`
`MV0l3lU4zmNWeK408NXp09HG3pstjGx=B2CwRAvpS7ZRbPpMD2FQjSbT\_HnB`
`ILGHmtzPg57xeXKYb2vTV`

`fingerprinte = `
`FF2423A:1B5964E2:78643536:421747A6:F540BAA7`

If a user's public key is less than 680 characters or more than 690 characters, or does not match the regular expression `^(\w|\/|\+|\?|\(|\)|\=)*$`, the client displays a warning to other users and the fingerprint is not calculated.

### Shared Secrets
A shared secret is the single key used to encrypt messages between two parties. It is extremely sensitive and should never be exposed. To calculate the shared secret between Alice and Bob (with key pairs `prikeya`, `pubkeyb` and `prikeyb`, `pubkeyb` respectively,) Alice uses the following formula:

`secretab = pubkeyb^(prikeya) mod p`

Bob uses the following formula:

`secretab = pubkeya^(prikeyb) mod p`

Both parties will obtain the same shared secret `secretab`, since `pubkeyb^(prikeya) mod p = pubkeya^(prikeyb) mod p`. Before being used for encryption or decryption, the shared secret is hashed using SHA256 and the result is truncated to 256 bits and then used as the key for AES-CBC-256 operations. The last ciphertext block is padded according to ISO 10126: the last block is padded with random bytes, with the last byte defining the padding boundary. For example, the following last block (shown in hexadecimal, with CC indicating ciphertext bytes) requires padding for 6 bytes:

`CC CC CC CC CC CC CC CC CC CC 0A DE 55 A3 81 06`

### HMAC Generation
Message authentication hashes are generated using HMAC-SHA256. The message passed through HMAC is the ciphertext, not the plaintext. This is done for security reasons. The HMAC key is the same shared secret that is used between the sender and the recipient in order to encrypt the message.

Upon the reception of each HMAC, the recipient's client compares the HMAC with all previously-received HMACs. If there is a match, then a replay attack is detected and the message is discarded. If there is no match, then the HMAC is added to the list of received HMACs. If the verification of the HMAC is successful, the message is decrypted using the shared secret. If the HMAC check fails, an error is displayed.

### Joins and Parts
Once a user joins with nickname nick, the server must append the following line to the chat (join and part notifications are not encrypted):

`> nick has arrived`

Conversely, upon a user leaving, the following line is appended to the chat:

`> nick has left`

The parting notification is followed by a removal of nick's entry in line 0. The following regular expression may be used to identify these lines by the client:

`^(\&gt\;|\&lt\;) [a-z]{1,12} (has arrived|has left)$`

Note that the above regular expression assumes that the characters '>' and '<' have been converted to their HTML entities for safe usage within a web browser.

### Messaging
In a conversation with participants alice, bob, and eve, a single message sent by alice is formatted as such:

`alice|N1OlZwFw: [:3](bob)messageb|hmacb(eve)messagee|hmace[:3]`

`alice` is the sender’s nickname.
`N1OlZwFw` is an example of a randomly generated nonce used to confirm message reception. These nonces must match the regular expression `^\w{8}$`.
`[:3]`s signal the start and end of encrypted content.

`(bob)` signals that `messageb|hmacb` are meant for bob. `messageb` is encrypted using bob's public key, while `hmacb` is the HMAC intended to verify the authenticity of messageb. AES ciphertext is sent in base 64, while the HMAC-SHA256 hash is sent in hexadecimal.

Once alice sends the message (as formatted above) to the server, the server verifies the message using the following regular expression:

`^[a-z]{1,12}\|\w{8}:\s\[:3\]((\w|\/|\+|\?|\(|\)|\=)*\|?(\d|a|b|c|d|e|f)*)*\[:3\]$`

The server processes the message and sends the following to bob...

`alice: [:3]messageb|hmacb[:3]`

...and the following to eve:

`alice: [:3]messagee|hmace[:3]`

Recipient clients can verify messages using the following regular expression:

`^[a-z]{1,12}\:\s\[:3\](\w|\/|\+|\?|\=)*\|?(\d|a|b|c|d|e|f)*\[:3\]$`

The server finally sends alice the message nonce (`N1OlZwFw`) in order for her client to validate message reception.

Cryptocat also supports private messaging, which allows for a message to be sent to a single recipient even in a chat with more than two parties. If the sender prefixes their message with an `@` followed by the recipient's nickname (_@eve hey, how's it going?_), the client automatically encrypts, MACs and sends the message only to the intended recipient (thus formatting the server request as if the chat contained only eve as a recipient.) The recipient's client then notices the `@` followed by the recipient's nickname upon message reception, and notifies the user that they have been sent a private message.

Files may be sent simply by converting them into base 64 encoded Data URIs and sending the Data URI as a private message. The client detects the Data URI header and interprets the message as a file accordingly. We do not recommend allowing the protocol to send or receive any file except .zip files and certain types of image files. This is to mitigate the possible security concerns related to the web browser access to file extensions with a history of insecure browser handling, such as .pdf and .swf.

The server is required to securely wipe the entire chat session from the hard disk upon 60 minutes of user inactivity. Secure wipe is defined as overwriting the entire chat data with seven passes: `0xF6, 0x00, 0xFF, random, 0x00, 0xFF, random`.

### Endnotes
Special thanks to Jacob Appelbaum, Meredith L. Patterson and Marsh Ray for their helpful comments and insight.

[Cryptocat](https://crypto.cat)

[Source code](https://github.com/kaepora/cryptocat/)

[Email](mailto:nadim@nadim.cc)