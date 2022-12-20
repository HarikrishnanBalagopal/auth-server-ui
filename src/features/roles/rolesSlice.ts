export interface Metadata {
    "id": string;
    "name": string;
    "description": string;
    "timestamp": string;
}

export interface Role {
    "metadata": Metadata;
    "rules": Array<RoleRule>;
}

export interface RoleRule {
    "resources": Array<string>;
    "verbs": Array<string>;
}

export interface DisplayRole extends RoleRule {
    "id": string;
    "timestamp"?: string;    
}

export const roleToDisplayRole = (role: Role):DisplayRole => {
    return {
        id: role.metadata.id,
        timestamp: role.metadata.timestamp,
        resources: role.rules[0].resources,
        verbs: role.rules[0].verbs,
    };
};
