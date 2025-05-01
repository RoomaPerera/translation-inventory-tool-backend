import spacy

# Load the NLP model
nlp = spacy.load('en_core_web_md')

def find_similar_translations(new_text, translations):
    """Finds similar translations using semantic similarity."""
    new_doc = nlp(new_text)
    similarities = []

    for translation in translations:
        translation_doc = nlp(translation['translatedText'])
        similarity = new_doc.similarity(translation_doc)
        similarities.append((translation, similarity))

    # Sort by similarity score
    similarities.sort(key=lambda x: x[1], reverse=True)
    return [s[0] for s in similarities[:5]]  # Return top 5 matches

def extract_key_terms(text):
    """Extracts important keywords from a translation."""
    doc = nlp(text)
    key_terms = [token.text for token in doc if token.pos_ in ['NOUN', 'VERB', 'ADJ']]
    return list(set(key_terms))  # Remove duplicates
