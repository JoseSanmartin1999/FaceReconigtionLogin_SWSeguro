/**
 * Utilidad para comparar descriptores faciales
 * Usa distancia euclidiana para determinar similitud entre rostros
 */

/**
 * Calcula la distancia euclidiana entre dos descriptores faciales
 * @param descriptor1 - Primer descriptor facial (array de 128 números)
 * @param descriptor2 - Segundo descriptor facial (array de 128 números)
 * @returns La distancia euclidiana entre los dos descriptores
 */
export function calculateEuclideanDistance(
    descriptor1: number[],
    descriptor2: number[]
): number {
    if (descriptor1.length !== descriptor2.length) {
        throw new Error('Los descriptores deben tener la misma longitud');
    }

    let sum = 0;
    for (let i = 0; i < descriptor1.length; i++) {
        const val1 = descriptor1[i];
        const val2 = descriptor2[i];

        if (val1 === undefined || val2 === undefined) {
            throw new Error('Descriptor inválido: contiene valores undefined');
        }

        const diff = val1 - val2;
        sum += diff * diff;
    }

    return Math.sqrt(sum);
}

/**
 * Determina si dos rostros son similares comparando sus descriptores
 * @param descriptor1 - Primer descriptor facial
 * @param descriptor2 - Segundo descriptor facial
 * @param threshold - Umbral de similitud (default: 0.6, mismo que face-api.js)
 * @returns true si los rostros son similares (distancia < threshold)
 */
export function areFacesSimilar(
    descriptor1: number[],
    descriptor2: number[],
    threshold: number = 0.6
): boolean {
    const distance = calculateEuclideanDistance(descriptor1, descriptor2);
    console.log(`    🔢 Distancia euclidiana: ${distance.toFixed(4)}, Umbral: ${threshold}, Similar: ${distance < threshold}`);
    return distance < threshold;
}
