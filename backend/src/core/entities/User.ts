export interface UserProps {
    id?: string;
    username: string;
    passwordHash: string;
    faceDescriptor: number[];
    role: 'admin' | 'user';

    // Información personal
    firstName: string;
    lastName: string;
    email: string;

    createdAt?: Date;
}

export class User {
    constructor(public props: UserProps) { }

    // Getters para acceder a las propiedades
    get id(): string | undefined {
        return this.props.id;
    }

    get username(): string {
        return this.props.username;
    }

    get firstName(): string {
        return this.props.firstName;
    }

    get lastName(): string {
        return this.props.lastName;
    }

    get email(): string {
        return this.props.email;
    }

    get role(): 'admin' | 'user' {
        return this.props.role;
    }

    // Helper: nombre completo
    get fullName(): string {
        return `${this.props.firstName} ${this.props.lastName}`;
    }
}