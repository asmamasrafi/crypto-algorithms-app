from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.PublicKey import RSA
from Crypto.Random import get_random_bytes
from Crypto.Protocol.KDF import PBKDF2
import base64

# AES
def aes_encrypt(text, password):
    salt = get_random_bytes(16)
    key = PBKDF2(password, salt, dkLen=32)
    cipher = AES.new(key, AES.MODE_CBC)
    iv = cipher.iv
    padded_text = text + ' ' * (16 - len(text) % 16)
    encrypted = cipher.encrypt(padded_text.encode())
    result = base64.b64encode(salt + iv + encrypted).decode()
    return result

def aes_decrypt(enc_text, password):
    raw = base64.b64decode(enc_text)
    salt = raw[:16]
    iv = raw[16:32]
    enc = raw[32:]
    key = PBKDF2(password, salt, dkLen=32)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    decrypted = cipher.decrypt(enc).decode().rstrip()
    return decrypted

# RSA
def generate_rsa_keys():
    key = RSA.generate(2048)
    private_key = key.export_key()
    public_key = key.publickey().export_key()
    return private_key, public_key

def rsa_encrypt(text, pub_key):
    recipient_key = RSA.import_key(pub_key)
    cipher = PKCS1_OAEP.new(recipient_key)
    encrypted = cipher.encrypt(text.encode())
    return base64.b64encode(encrypted).decode()

def rsa_decrypt(enc_text, priv_key):
    private_key = RSA.import_key(priv_key)
    cipher = PKCS1_OAEP.new(private_key)
    decrypted = cipher.decrypt(base64.b64decode(enc_text))
    return decrypted.decode()
