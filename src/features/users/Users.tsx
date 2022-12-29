import { useAppDispatch } from "../../app/hooks";
import { AuthUser, authUserToUser } from "./usersSlice";
import { DataGrid, GridColumns, GridToolbar, GridSelectionModel } from '@mui/x-data-grid';
import {  TrashIcon, SyncIcon, PlusIcon } from '@patternfly/react-icons';
import {
    Title, Spinner, Button, Toolbar, ToolbarContent, Alert,
    ToolbarItem, Modal, Form, FormGroup, TextInput, Checkbox, ActionGroup
} from '@patternfly/react-core';
import { useListUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUsersMutation } from "./usersApi";
import { FunctionComponent, useState } from "react";
import { unixTimeStringtoDate } from "../common/utils";

const rolesStrToRoleIds = (roles: string) => roles.split(',').map(r => r.trim()).filter(r => r.length > 0);

export const Users: FunctionComponent = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
    const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);

    const dispatch = useAppDispatch();
    const { data, error, isLoading, refetch } = useListUsersQuery();
    const [deleteUsers, { isLoading: isDeleting, error: deleteError }] = useDeleteUsersMutation();
    const [createUser, { isLoading: isCreating, error: createError }] = useCreateUserMutation();
    const [updateUser, { isLoading: isUpdating, error: updateError }] = useUpdateUserMutation();

    const columns: GridColumns = [
        { field: 'id', width: 90 },
        {
            field: 'name',
            editable: true,
        },
        {
            field: 'email',
            flex: 1,
            editable: true,
        },
        {
            field: 'role-ids',
            headerName: 'roles',
            flex: 1,
            valueGetter: ({ value }) => value && value.join(','),
            editable: true,
        },
        {
            field: 'is-service-account',
            headerName: 'robot',
            type: 'boolean',
            editable: true,
        },
        {
            field: 'num-failed-attempts',
            headerName: 'num of failed attempts',
            type: 'number',
            editable: true,
        },
        {
            field: 'created-at',
            headerName: 'created at',
            type: 'dateTime',
            valueGetter: ({ value }) => value && unixTimeStringtoDate(value),
            flex: 1,
        },
    ];

    return (<div className="full-height flex-vertical">
        <Title className="padding-1em" headingLevel="h1">Users</Title>
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
        {!isDeleting && deleteError && <Alert variant="danger" title={JSON.stringify(deleteError)} />}
        <div className="flex-grow">{
            error ? (
                <Alert variant="danger" title={JSON.stringify(error)} />
            ) : isLoading ? (
                <Spinner />
            ) : data ? (
                <DataGrid
                    rows={data.map(authUserToUser)}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    checkboxSelection
                    autoPageSize
                    selectionModel={selectedRows}
                    onSelectionModelChange={xs => setSelectedRows(xs)}
                    editMode='row'
                    processRowUpdate={(u) => {
                        console.log('updated user:', u);
                        u['role-ids']= rolesStrToRoleIds(u['role-ids']);
                        console.log('after splitting the roles:', u);
                        updateUser(u);
                        return u;
                    }}
                    disableSelectionOnClick
                    getRowClassName={({ indexRelativeToCurrentPage }) => indexRelativeToCurrentPage % 2 === 0 ? 'table-row-even' : 'table-row-odd'}
                    experimentalFeatures={{ newEditingApi: true }}
                />
            ) : null
        }
        </div>
        <Modal title="Confirm deletion of the users?" isOpen={isOpen} onClose={() => setIsOpen(false)} actions={[
            <Button key="confirm-button" variant="danger" onClick={() => {
                setIsOpen(false);
                deleteUsers(selectedRows as Array<string>);
                setSelectedRows([]);
            }}>Confirm</Button>,
            <Button key="cancel-button" variant="plain" onClick={() => setIsOpen(false)}>Cancel</Button>
        ]}>
            The selected {selectedRows.length} users will be deleted.
            This action cannot be reversed.
        </Modal>
        <Modal title="Create a new user" isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
            <Form noValidate={false} onSubmit={e => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const username = (formData.get('username') || '') as string;
                const password = (formData.get('password') || '') as string;
                const is_service_account = ((formData.get('is_service_account') === 'on') || false) as boolean;
                const rolesStr = (formData.get('roles') || '') as string;
                console.log('creating a user with data:', username, password, is_service_account, rolesStr);
                const newUser: AuthUser = {
                    "id": username,
                    "role-ids": rolesStrToRoleIds(rolesStr),
                    "password": password,
                    "is-service-account": is_service_account,
                    "sub": username,
                    "preferred_username": username,
                    "email": username,
                };
                createUser(newUser);
                setIsCreateOpen(false);
            }}>
                <FormGroup label="username" isRequired>
                    <TextInput type="text" aria-label="username" name="username" isRequired placeholder="john@foo.com" />
                </FormGroup>
                <Checkbox label="is this a service account? (robot)" aria-label="is service account" id="is_service_account" name="is_service_account" />
                <FormGroup label="password">
                    <TextInput type="password" aria-label="password" name="password" placeholder="even if no password is set the user can still login via IDPs" />
                </FormGroup>
                <FormGroup label="roles">
                    <TextInput type="text" aria-label="roles" name="roles" placeholder="role-1, role-2, role-3" />
                </FormGroup>
                <ActionGroup>
                    <Button type="submit">Submit</Button>
                </ActionGroup>
            </Form>
        </Modal>
    </div>);
}
