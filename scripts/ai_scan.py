import os
import sys
import joblib
import pandas as pd
import numpy as np
from scipy.sparse import hstack # Necesario para unir texto + lenguaje

# --- CONFIGURACIÓN ---
MODELO_PATH = 'models/vulnerability_detector.pkl'
VECTORIZADOR_PATH = 'models/vectorizer_detector.pkl'
ENCODER_PATH = 'models/language_encoder.pkl'

def cargar_artefactos():
    try:
        print("⏳ Cargando cerebro (Modelo, Vectorizador y Encoder)...")
        modelo = joblib.load(MODELO_PATH)
        vectorizador = joblib.load(VECTORIZADOR_PATH)
        encoder = joblib.load(ENCODER_PATH)
        print("✅ Artefactos cargados correctamente.")
        return modelo, vectorizador, encoder
    except Exception as e:
        print(f"❌ Error fatal cargando modelos: {e}")
        print("Asegúrate de tener en 'models/': vulnerability_detector.pkl, vectorizer_detector.pkl Y language_encoder.pkl")
        sys.exit(1)

def obtener_extension(filename):
    # Extrae la extensión (ej: .py) y quita el punto para que coincida con el encoder (ej: 'py')
    return filename.split('.')[-1]

def analizar_repositorio():
    modelo, vectorizador, encoder = cargar_artefactos()
    es_vulnerable = False
    archivos_peligrosos = []

    print("🔍 Iniciando análisis híbrido (Código + Lenguaje)...")

    for root, dirs, files in os.walk("."):
        if ".git" in root or "models" in root or "scripts" in root:
            continue

        for file in files:
            if file.endswith((".py", ".js", ".java", ".php", ".cpp", ".cs")):
                path = os.path.join(root, file)
                try:
                    # 1. Leer contenido
                    with open(path, "r", errors="ignore") as f:
                        contenido = f.read()

                    # 2. Preparar el Texto (1000 features)
                    features_texto = vectorizador.transform([contenido])

                    # 3. Preparar el Lenguaje (1 feature)
                    ext = obtener_extension(file)
                    try:
                        # Intentamos transformar la extensión (ej: 'py') a número
                        feature_lenguaje = encoder.transform([ext]).reshape(-1, 1)
                    except:
                        # Si es una extensión nueva que el modelo no conoce, usamos 0 o -1
                        feature_lenguaje = np.array([[0]])

                    # 4. COMBINAR TODO (1000 + 1 = 1001 features)
                    # Usamos hstack porque el vectorizador devuelve una matriz dispersa
                    features_finales = hstack([features_texto, feature_lenguaje])

                    # 5. Predecir
                    prediccion = modelo.predict(features_finales)[0]

                    if prediccion == 1:
                        print(f"⚠️ AMENAZA DETECTADA en: {file}")
                        es_vulnerable = True
                        archivos_peligrosos.append(file)

                except Exception as e:
                    print(f"❌ Error analizando {file}: {e}")
                    # IMPORTANTE: Si falla el análisis técnico, fallamos el pipeline por seguridad
                    sys.exit(1)

    if es_vulnerable:
        print(f"\n⛔ RECHAZADO: Archivos vulnerables: {archivos_peligrosos}")
        sys.exit(1)
    else:
        print("\n✅ APROBADO: Sistema seguro.")
        sys.exit(0)

if __name__ == "__main__":
    analizar_repositorio()