export interface UserProps {
    id?: string;
    username: string;
    passwordHash: string;
    faceDescriptor: number[]; // El vector de 128 posiciones
    role: 'admin' | 'user'; // Rol del usuario
    createdAt?: Date;
}

export class User {
    constructor(public readonly props: UserProps) {}
}