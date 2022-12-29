export interface User {
    id: string;
    name: string;
    email: string;
    'role-ids': Array<string>;
    'is-service-account': boolean;
    "created-at"?: string;
    "updated-at"?: string;
    'num-failed-attempts'?: number;
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
    'num-failed-attempts'?: number;
}

export const authUserToUser = (u: AuthUser): User => {
    const x: User = {
        id: u.id,
        name: u["preferred_username"],
        email: u.email,
        'role-ids': u['role-ids'],
        'is-service-account': u['is-service-account'],
    };
    if ('created-at' in u) x['created-at'] = u['created-at'];
    if ('updated-at' in u) x['updated-at'] = u['updated-at'];
    if ('num-failed-attempts' in u) x['num-failed-attempts'] = u['num-failed-attempts'];
    return x;
};
