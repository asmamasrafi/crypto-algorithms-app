from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.PublicKey import RSA
from Crypto.Random import get_random_bytes
from Crypto.Protocol.KDF import PBKDF2
import base64
from hashlib import sha256

# AES
def aes_encrypt(text, password=None):
    if password:
        key = sha256(password.encode()).digest()
        generated_key = None
    else:
        key = get_random_bytes(32)  # AES-256
        generated_key = base64.b64encode(key).decode()

    cipher = AES.new(key, AES.MODE_EAX)
    ciphertext, tag = cipher.encrypt_and_digest(text.encode())

    result = base64.b64encode(cipher.nonce + tag + ciphertext).decode()

    response = {"result": result}
    if generated_key:  # si une clé auto a été générée
        response["generated_key"] = generated_key
    return response


def aes_decrypt(enc_text, password):
    try:
        raw = base64.b64decode(enc_text)
        nonce, tag, ciphertext = raw[:16], raw[16:32], raw[32:]

        # Vérifier si la clé est en Base64 (clé générée automatiquement)
        try:
            decoded_key = base64.b64decode(password)
            if len(decoded_key) in (16, 24, 32):  # clé AES valide
                key = decoded_key
            else:
                # sinon on considère que c'est un mot de passe classique
                key = sha256(password.encode()).digest()
        except Exception:
            # si décodage échoue → mot de passe classique
            key = sha256(password.encode()).digest()

        cipher = AES.new(key, AES.MODE_EAX, nonce=nonce)
        decrypted = cipher.decrypt_and_verify(ciphertext, tag)
        return decrypted.decode()

    except Exception as e:
        raise Exception("AES decryption failed: " + str(e))

# RSA
def generate_rsa_keys():
    key = RSA.generate(2048)
    private_key = key.export_key()
    public_key = key.publickey().export_key()
    return private_key, public_key

def rsa_encrypt(plain_text, pub_key):
    public_key = RSA.import_key(pub_key)
    cipher = PKCS1_OAEP.new(public_key)
    encrypted = cipher.encrypt(plain_text.encode())
    return base64.b64encode(encrypted).decode()


def rsa_decrypt(enc_text, priv_key):
    try:
        # Importer la clé privée, compatible PKCS#1 et PKCS#8
        private_key = RSA.import_key(priv_key.strip())
        
        # Créer le déchiffreur avec PKCS#1 OAEP
        cipher = PKCS1_OAEP.new(private_key)
        
        # Déchiffrer et renvoyer le texte clair
        decrypted = cipher.decrypt(base64.b64decode(enc_text))
        return decrypted.decode("utf-8")
    
    except (ValueError, IndexError) as e:
        return f"Error: RSA decryption failed - {str(e)}"