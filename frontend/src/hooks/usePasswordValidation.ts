/**
 * Hook personalizado para validación de contraseñas seguras
 */

export interface PasswordValidation {
    isValid: boolean;
    errors: string[];
    strength: number;
    strengthLabel: string;
}

/**
 * Valida la fortaleza de una contraseña
 */
export function usePasswordValidation(password: string): PasswordValidation {
    const errors: string[] = [];
    let strength = 0;

    // Validar longitud mínima
    if (password.length < 8) {
        errors.push('Mínimo 8 caracteres');
    } else {
        strength++;
    }

    // Validar letra mayúscula
    if (!/[A-Z]/.test(password)) {
        errors.push('Al menos una mayúscula (A-Z)');
    } else {
        strength++;
    }

    // Validar letra minúscula
    if (!/[a-z]/.test(password)) {
        errors.push('Al menos una minúscula (a-z)');
    } else {
        strength++;
    }

    // Validar número
    if (!/[0-9]/.test(password)) {
        errors.push('Al menos un número (0-9)');
    } else {
        strength++;
    }

    // Validar carácter especial
    if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
        errors.push('Al menos un carácter especial (!@#$...)');
    } else {
        strength++;
    }

    // Bonus por longitud adicional
    if (password.length >= 12) {
        strength++;
    }

    // Determinar etiqueta de fortaleza
    let strengthLabel = '';
    if (strength === 0) strengthLabel = 'Muy débil';
    else if (strength <= 2) strengthLabel = 'Débil';
    else if (strength <= 3) strengthLabel = 'Regular';
    else if (strength <= 4) strengthLabel = 'Fuerte';
    else strengthLabel = 'Muy fuerte';

    return {
        isValid: errors.length === 0,
        errors,
        strength: Math.min(strength, 5),
        strengthLabel
    };
}
