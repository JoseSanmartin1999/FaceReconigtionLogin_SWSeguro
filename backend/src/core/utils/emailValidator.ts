/**
 * Utilidad de validación de emails
 * Implementa validación según RFC 5322 (simplificado)
 */

export interface EmailValidationResult {
    isValid: boolean;
    error?: string;
}

/**
 * Valida que un email cumpla con formato correcto
 * 
 * @param email - Email a validar
 * @returns Resultado de validación
 */
export function validateEmail(email: string): EmailValidationResult {
    // Validar que no esté vacío
    if (!email || email.trim().length === 0) {
        return { isValid: false, error: 'El email es requerido' };
    }

    const trimmedEmail = email.trim();

    // Validar longitud máxima
    if (trimmedEmail.length > 255) {
        return {
            isValid: false,
            error: 'Email demasiado largo (máximo 255 caracteres)'
        };
    }

    // Regex para validación de formato
    // Permite: letras, números, puntos, guiones, guiones bajos, + y %
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(trimmedEmail)) {
        return {
            isValid: false,
            error: 'Formato de email inválido. Ejemplo válido: usuario@dominio.com'
        };
    }

    // Validar que no tenga puntos consecutivos
    if (trimmedEmail.includes('..')) {
        return {
            isValid: false,
            error: 'El email no puede contener puntos consecutivos'
        };
    }

    // Validar estructura con @ (debe haber exactamente uno)
    const atIndex = trimmedEmail.indexOf('@');
    if (atIndex === -1) {
        return {
            isValid: false,
            error: 'El email debe contener un símbolo @'
        };
    }

    // Extraer partes local y dominio
    const localPart = trimmedEmail.substring(0, atIndex);
    const domainPart = trimmedEmail.substring(atIndex + 1);

    // Validar que ninguna parte esté vacía
    if (localPart.length === 0 || domainPart.length === 0) {
        return {
            isValid: false,
            error: 'Email inválido: parte local o dominio vacío'
        };
    }

    // Validar que no empiece o termine con punto
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
        return {
            isValid: false,
            error: 'El email no puede empezar o terminar con un punto'
        };
    }

    // Todo válido
    return { isValid: true };
}

/**
 * Normaliza un email (trim y lowercase)
 * 
 * @param email - Email a normalizar
 * @returns Email normalizado
 */
export function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}
