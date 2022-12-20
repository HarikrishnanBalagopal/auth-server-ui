import { useAppDispatch } from "../../app/hooks";
import { Role, roleToDisplayRole } from "./rolesSlice";
import { DataGrid, GridColumns, GridToolbar, GridSelectionModel } from '@mui/x-data-grid';
import { TrashIcon, SyncIcon, PlusIcon } from '@patternfly/react-icons';
import {
    Title, Spinner, Button, Toolbar, ToolbarContent, Alert,
    ToolbarItem, Modal, Form, FormGroup, TextInput, ActionGroup
} from '@patternfly/react-core';
import { useListRolesQuery, useCreateRoleMutation, useUpdateRoleMutation, useDeleteRolesMutation } from "./rolesApi";
import { useState } from "react";
import { unixTimeStringtoDate } from "../common/utils";
import { FunctionComponent } from "react";

const splitAndTrim = (commaSeperated: string) => commaSeperated.split(',').map(r => r.trim()).filter(r => r.length > 0);

export const Roles: FunctionComponent = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
    const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);

    const dispatch = useAppDispatch();
    const { data, error, isLoading, refetch } = useListRolesQuery();
    const [deleteRoles] = useDeleteRolesMutation();
    const [createRole, { isLoading: isCreating, error: createError }] = useCreateRoleMutation();
    const [updateRole, { isLoading: isUpdating, error: updateError }] = useUpdateRoleMutation();

    const columns: GridColumns = [
        { field: 'id', flex: 1 },
        {
            field: 'resources',
            flex: 1,
            valueGetter: ({ value }) => value && value.join(','),
            editable: true,
        },
        {
            field: 'verbs',
            flex: 1,
            valueGetter: ({ value }) => value && value.join(','),
            editable: true,
        },
        {
            field: 'timestamp',
            headerName: 'created at',
            type: 'dateTime',
            valueGetter: ({ value }) => value && unixTimeStringtoDate(value),
            flex: 1,
        },
    ];

    return (<div className="full-height flex-vertical">
        <Title className="padding-1em" headingLevel="h1">Roles</Title>
        <Toolbar>
            <ToolbarContent>
                <ToolbarItem>
                    <Button onClick={() => dispatch(refetch)}><SyncIcon /> refresh</Button>
                </ToolbarItem>
                <ToolbarItem>
                    <Button onClick={() => selectedRows.length > 0 && setIsOpen(true)} variant="danger"><TrashIcon /> delete</Button>
                </ToolbarItem>
                <ToolbarItem>
                    <Button onClick={() => setIsCreateOpen(true)} variant="secondary"><PlusIcon /> create</Button>
                </ToolbarItem>
            </ToolbarContent>
        </Toolbar>
        <Alert variant="info" title="Double click a cell to edit it! Press Enter once you are done to commit the changes."/>
        {!isCreating && createError && <Alert variant="danger" title={JSON.stringify(createError)} />}
        {!isUpdating && updateError && <Alert variant="danger" title={JSON.stringify(updateError)} />}
        <div className="flex-grow">{
            error ? (
                <Alert variant="danger" title={JSON.stringify(error)} />
            ) : isLoading ? (
                <Spinner />
            ) : data ? (
                <DataGrid
                    rows={data.map(roleToDisplayRole)}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    checkboxSelection
                    autoPageSize
                    selectionModel={selectedRows}
                    onSelectionModelChange={xs => setSelectedRows(xs)}
                    editMode='row'
                    processRowUpdate={(u) => {
                        console.log('updated role:', u);
                        u['resources'] = splitAndTrim(u['resources']);
                        u['verbs'] = splitAndTrim(u['verbs']);
                        console.log('after splitting the resources and verbs:', u);
                        const authRole: Role = {
                            metadata: { "id": u.id, "name": "", description: "", timestamp: "" },
                            rules: [{
                                'resources': u['resources'],
                                'verbs': u['verbs'],
                            }],
                        };
                        console.log('the auth server roles:', authRole);
                        updateRole(authRole);
                        return u;
                    }}
                    disableSelectionOnClick
                    getRowClassName={({ indexRelativeToCurrentPage }) => indexRelativeToCurrentPage % 2 === 0 ? 'table-row-even' : 'table-row-odd'}
                    experimentalFeatures={{ newEditingApi: true }}
                />
            ) : null
        }
        </div>
        <Modal title="Confirm deletion of the roles?" isOpen={isOpen} onClose={() => setIsOpen(false)} actions={[
            <Button key="confirm-button" variant="danger" onClick={() => {
                setIsOpen(false);
                deleteRoles(selectedRows as Array<string>);
                setSelectedRows([]);
            }}>Confirm</Button>,
            <Button key="cancel-button" variant="plain" onClick={() => setIsOpen(false)}>Cancel</Button>
        ]}>
            The selected {selectedRows.length} roles will be deleted.
            This action cannot be reversed.
        </Modal>
        <Modal title="Create a new role" isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
            <Form noValidate={false} onSubmit={e => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const roleId = (formData.get('id') || '') as string;
                const resourcesStr = (formData.get('resources') || '') as string;
                const verbsStr = (formData.get('verbs') || '') as string;
                console.log('creating a role with data:', roleId, resourcesStr, verbsStr);
                const newRole: Role = {
                    "metadata": { "id": roleId, "name": "", "description": "", "timestamp": "" },
                    "rules": [{
                        "resources": splitAndTrim(resourcesStr),
                        "verbs": splitAndTrim(verbsStr),
                    }],
                };
                createRole(newRole);
                setIsCreateOpen(false);
            }}>
                <FormGroup label="id" isRequired>
                    <TextInput type="text" aria-label="id" name="id" isRequired placeholder="role-1" />
                </FormGroup>
                <FormGroup label="resources">
                    <TextInput type="text" aria-label="resources" name="resources" placeholder="resources the role gives access to" />
                </FormGroup>
                <FormGroup label="verbs">
                    <TextInput type="text" aria-label="verbs" name="verbs" placeholder="verbs that are allowed on the resources" />
                </FormGroup>
                <ActionGroup>
                    <Button type="submit">Submit</Button>
                </ActionGroup>
            </Form>
        </Modal>
    </div>);
}
