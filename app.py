from flask import Flask, request, jsonify
from flask_cors import CORS
from analyse_utils import detect_sensitive_data, compute_sensitivity_score, recommend_encryption
from crypto_utils import aes_encrypt, aes_decrypt, rsa_encrypt, rsa_decrypt

app = Flask(__name__)
CORS(app)

@app.route("/analyse", methods=["POST"])
def analyse():
    data = request.json
    text = data.get("text", "")
    flags = detect_sensitive_data(text)
    score = compute_sensitivity_score(flags)
    method = recommend_encryption(score)
    return jsonify({
        "flags": flags,
        "score": score,
        "recommended": method
    })

@app.route("/encrypt", methods=["POST"])
def encrypt():
    data = request.json
    text = data.get("text", "")
    method = data.get("method", "")
    if method == "AES":
        return jsonify({"result": aes_encrypt(text, data["password"])})
    elif method == "RSA":
        return jsonify({"result": rsa_encrypt(text, data["public_key"])})
    return jsonify({"error": "Méthode inconnue"}), 400

@app.route("/decrypt", methods=["POST"])
def decrypt():
    data = request.json
    text = data.get("text", "")
    method = data.get("method", "")
    if method == "AES":
        return jsonify({"result": aes_decrypt(text, data["password"])})
    elif method == "RSA":
        return jsonify({"result": rsa_decrypt(text, data["private_key"])})
    return jsonify({"error": "Méthode inconnue"}), 400

if __name__ == "__main__":
    app.run(debug=True)
