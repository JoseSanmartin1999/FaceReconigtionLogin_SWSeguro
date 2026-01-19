export interface UserProps {
    id?: string;
    username: string;
    passwordHash: string;
    faceDescriptor: number[]; // El vector de 128 posiciones
    createdAt?: Date;
}

export class User {
    constructor(public readonly props: UserProps) {}
}