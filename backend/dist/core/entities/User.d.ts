export interface UserProps {
    id?: string;
    username: string;
    passwordHash: string;
    faceDescriptor: number[];
    role: 'admin' | 'user';
    firstName: string;
    lastName: string;
    email: string;
    createdAt?: Date;
}
export declare class User {
    props: UserProps;
    constructor(props: UserProps);
    get id(): string | undefined;
    get username(): string;
    get firstName(): string;
    get lastName(): string;
    get email(): string;
    get role(): 'admin' | 'user';
    get fullName(): string;
}
//# sourceMappingURL=User.d.ts.map