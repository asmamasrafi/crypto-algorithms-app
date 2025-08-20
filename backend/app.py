from flask import Flask, request, jsonify
from flask_cors import CORS
from analyse_utils import detect_sensitive_data, compute_sensitivity_score, recommend_encryption
from crypto_utils import aes_encrypt, aes_decrypt, rsa_encrypt, rsa_decrypt
from rsa_key_utils import generate_rsa_keys


app = Flask(__name__)

# Pour le dev : autoriser ton live-server (127.0.0.1:5500) — et localhost au cas où
CORS(app, resources={r"/*": {"origins": "*"}})


# storage temporaire (uniquement pour tests)
rsa_keys_store = {}

@app.route("/analyse", methods=["POST"])
def analyse():
    data = request.json or {}
    text = data.get("text", "")
    flags = detect_sensitive_data(text)
    score = compute_sensitivity_score(flags)
    method = recommend_encryption(score)
    return jsonify({"flags": flags, "score": score, "recommended": method})

@app.route("/encrypt", methods=["POST"])
def encrypt():
    try:
        data = request.get_json()
        text = data.get("text", "")
        method = data.get("method", "")
        password = data.get("password", None)
        public_key = data.get("public_key", None)

        if not text:
            return jsonify({"error": "No text provided"}), 400

        if method == "AES":
            result = aes_encrypt(text, password)
            return jsonify(result)

        elif method == "RSA":
            if not public_key:
                return jsonify({"error": "RSA public key is required"}), 400
            result = rsa_encrypt(text, public_key)
            return jsonify({"result": result})

        else:
            return jsonify({"error": f"Unsupported method {method}"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route("/decrypt", methods=["POST"])
def decrypt():
    data = request.json or {}
    text = data.get("text", "")
    method = data.get("method", "")
    try:
        if method == "AES":
            return jsonify({"result": aes_decrypt(text, data["password"])})
        elif method == "RSA":
            return jsonify({"result": rsa_decrypt(text, data["private_key"])})
        else:
            return jsonify({"error": "Méthode inconnue"}), 400
    except Exception as e:
        app.logger.exception("decrypt error")
        return jsonify({"error": str(e)}), 500

@app.route("/generate_rsa_keys", methods=["GET"])
def generate_keys():
    public_key, private_key = generate_rsa_keys()
    return jsonify({
        "public_key": public_key,
        "private_key": private_key  # en prod : NE PAS stocker côté serveur
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
