# 🔐 Sensitive Data Analysis & Encryption Web App (AES & RSA)

## 📌 Overview

This project is a **web application** designed to analyze the sensitivity of input text and provide encryption/decryption features using **AES** (symmetric encryption) and **RSA** (asymmetric encryption).

The app is enhanced with an **intelligent recommendation system** that suggests the most suitable encryption method (AES or RSA) depending on the sensitivity score of the input.

---

## ✨ Features

* 🔎  **Sensitive Data Detection** : Automatically detects sensitive information (emails, phone numbers, credit card numbers, etc.).
* 📊  **Sensitivity Score** : Computes a score based on detected elements.
* 🧠  **Algorithm Recommendation** : Suggests **AES** for low sensitivity and **RSA** for high sensitivity.
* 🔐  **Encryption & Decryption** :
  * **AES** : Supports both custom passwords and auto-generated keys.
  * **RSA** : Supports key generation, encryption with public key, and decryption with private key.
* 📱 **Responsive UI** built with Bootstrap for a smooth user experience.

---

## 🛠️ Tech Stack

### 🔹 Frontend

* HTML5
* CSS3
* JavaScript
* Bootstrap

### 🔹 Backend

* Python
* Flask (REST API)

### 🔹 Security & Cryptography

* PyCryptodome (AES, RSA, PKCS1_OAEP)

### 🔹 Tools

* Git & GitHub (Version Control)
* VS Code (Development)

---

## 🚀 Installation & Usage

### 1️⃣ Clone the repository

<pre class="overflow-visible!" data-start="1622" data-end="1727"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>git </span><span>clone</span><span> https://github.com/asmamasrafi/crypto-algorithms-app.git
</span><span>cd</span><span> crypto-algorithms-app
</span></span></code></div></div></pre>

### 2️⃣ Backend Setup

Make sure you have **Python 3.9+** installed.

 install dependencies:

<pre class="overflow-visible!" data-start="1859" data-end="1985"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>pip install -r requirements.txt</span></span></code></div></div></pre>

Run the Flask backend:

<pre class="overflow-visible!" data-start="2012" data-end="2037"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>python app.py
</span></span></code></div></div></pre>

By default, the server will run at:

👉 `http://127.0.0.1:5000/`

### 3️⃣ Frontend Setup

Open the frontend `index.html` with **Live Server** (VS Code extension) or serve it with any static server.

👉 Default frontend URL: `http://127.0.0.1:5500/index.html`

---

## 📂 Project Structure

crypto-algorithms-app/

│── index.html        # Main frontend page (entry point of the app)

│── readme.md         # Documentation file

│── requirements.txt  # Python dependencies for backend

│── assets/           # Frontend assets

│   ├── css/          # Stylesheets (main design & layout)

│   │   └── main.css

│   ├── img/          # Images & icons used in the UI

│   └── js/           # Frontend logic

│       └── main.js

│── backend/          # Backend logic (Flask-based API)

│   ├── app.py        # Flask backend API (entry point for server)

│   ├── analyse_utils.py  # Sensitive data detection & scoring functions

│   ├── crypto_utils.py   # AES & RSA encryption/decryption functions

│   └── rsa_key_utils.py  # RSA key generation & handling

---

## 🔑 Example Usage

### AES

* Enter text → choose AES → encrypt → app generates key if not provided.
* To decrypt, paste the encrypted text and enter the same key.

### RSA

* Generate RSA keys (public & private).
* Encrypt with  **public key** , decrypt with  **private key** .
