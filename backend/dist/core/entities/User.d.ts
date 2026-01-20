export interface UserProps {
    id?: string;
    username: string;
    passwordHash: string;
    faceDescriptor: number[];
    role: 'admin' | 'user';
    createdAt?: Date;
}
export declare class User {
    readonly props: UserProps;
    constructor(props: UserProps);
}
//# sourceMappingURL=User.d.ts.map