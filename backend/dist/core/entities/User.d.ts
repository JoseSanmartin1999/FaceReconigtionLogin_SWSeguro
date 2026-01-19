export interface UserProps {
    id?: string;
    username: string;
    passwordHash: string;
    faceDescriptor: number[];
    createdAt?: Date;
}
export declare class User {
    readonly props: UserProps;
    constructor(props: UserProps);
}
//# sourceMappingURL=User.d.ts.map