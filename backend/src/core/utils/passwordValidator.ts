/**
 * Utilidades para validación de contraseñas seguras
 * Implementa requisitos de NIST SP 800-63B para contraseñas
 */

export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
}

/**
 * Valida que una contraseña cumpla con los requisitos de seguridad
 * 
 * Requisitos:
 * - Mínimo 8 caracteres
 * - Al menos una letra mayúscula (A-Z)
 * - Al menos una letra minúscula (a-z)
 * - Al menos un número (0-9)
 * - Al menos un carácter especial (!@#$%^&*()_+-=[]{}|;:,.<>?)
 * 
 * @param password - Contraseña a validar
 * @returns Resultado de validación con lista de errores
 */
export function validatePasswordStrength(password: string): PasswordValidationResult {
    const errors: string[] = [];

    // Validar longitud mínima
    if (password.length < 8) {
        errors.push('La contraseña debe tener al menos 8 caracteres');
    }

    // Validar letra mayúscula
    if (!/[A-Z]/.test(password)) {
        errors.push('La contraseña debe contener al menos una letra mayúscula');
    }

    // Validar letra minúscula
    if (!/[a-z]/.test(password)) {
        errors.push('La contraseña debe contener al menos una letra minúscula');
    }

    // Validar número
    if (!/[0-9]/.test(password)) {
        errors.push('La contraseña debe contener al menos un número');
    }

    // Validar carácter especial
    if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
        errors.push('La contraseña debe contener al menos un carácter especial (!@#$%^&*...)');
    }

    // Validar que no sea una contraseña común (lista simplificada)
    const commonPasswords = [
        'password', 'password123', '12345678', 'qwerty123',
        'admin123', 'welcome123', 'letmein123'
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
        errors.push('Esta contraseña es demasiado común. Por favor elige una contraseña más segura');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Calcula el nivel de fortaleza de una contraseña (0-4)
 * 0 = Muy débil, 1 = Débil, 2 = Regular, 3 = Fuerte, 4 = Muy fuerte
 */
export function calculatePasswordStrength(password: string): number {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) strength++;

    return Math.min(strength, 4);
}
