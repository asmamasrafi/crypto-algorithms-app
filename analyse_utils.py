import re
import spacy

# Charger le modèle NLP
nlp = spacy.load("en_core_web_sm")

# Détections par regex
patterns = {
    "email": r"\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b",
    "phone": r"\b(?:\+33|0)[1-9](?:\s?\d{2}){4}\b",
    "carte_bancaire": r"\b(?:\d[ -]*?){13,16}\b",
    "iban": r"\b[A-Z]{2}[0-9A-Z]{13,34}\b",
    "mots_secrets": r"\b(mot de passe|confidentiel|secret|privé|sensibles?)\b"
}

# Pondération du risque
scores = {
    "email": 2,
    "phone": 2,
    "carte_bancaire": 4,
    "iban": 4,
    "mots_secrets": 3,
    "person": 1,
    "org": 1,
    "gpe": 1
}

def detect_sensitive_data(text):
    flags = []

    # Analyse NLP
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_.lower() in ["person", "org", "gpe"]:
            flags.append(ent.label_.lower())

    # Détection regex
    for label, pattern in patterns.items():
        if re.search(pattern, text, re.IGNORECASE):
            flags.append(label)

    return list(set(flags))

def compute_sensitivity_score(flags):
    return sum([scores.get(flag, 0) for flag in flags])

def recommend_encryption(score):
    if score >= 5:
        return "RSA"
    elif score >= 2:
        return "AES"
    else:
        return "Libre choix (faible sensibilité)"
