export interface User {
    id: string;
    name: string;
    email: string;
    'role-ids': Array<string>;
    'is-service-account': boolean;
    "created-at"?: string;
    "updated-at"?: string;
}

export interface AuthUser {
    "id": string;
    "created-at"?: string;
    "updated-at"?: string;
    "role-ids": Array<string>;
    "is-service-account": boolean;
    "sub": string;
    "preferred_username": string;
    "email": string;
    "password"?: string;
}

export const authUserToUser = (u: AuthUser): User => {
    const x: User = {
        id: u.id,
        name: u["preferred_username"],
        email: u.email,
        'role-ids': u['role-ids'],
        'is-service-account': u['is-service-account'],
    };
    if (u['created-at']) x['created-at'] = u['created-at'];
    if (u['updated-at']) x['updated-at'] = u['updated-at'];
    return x;
};
