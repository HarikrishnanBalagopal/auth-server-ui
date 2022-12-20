import '@patternfly/react-core/dist/styles/base.css';
import { NavLink, Routes, Route } from 'react-router-dom';
import { Users } from './features/users/Users';
import { Roles } from './features/roles/Roles';
import { ErrorPage } from './error-page';
import {
  Page,
  Masthead,
  MastheadToggle,
  MastheadMain,
  MastheadBrand,
  MastheadContent,
  PageSidebar,
  PageSection,
  PageToggleButton,
  Spinner,
  Avatar,
  Form,
  Button,
} from '@patternfly/react-core';
import { FunctionComponent } from 'react';
import { BarsIcon } from '@patternfly/react-icons/dist/esm/icons/bars-icon';
import { Nav, NavItem, NavList } from '@patternfly/react-core';
import { useGetUserInfoQuery } from './features/users/usersApi';
import { Support } from './features/support/Support';
import img_avatar_url from './assets/images/img_avatar.svg';

export const App: FunctionComponent = () => {
  const { data, isLoading, error } = useGetUserInfoQuery();

  const header = (
    <Masthead>
      <MastheadToggle>
        <PageToggleButton><BarsIcon /></PageToggleButton>
      </MastheadToggle>
      <MastheadMain>
        <MastheadBrand>
          Auth Server
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <span className="margin-left-auto">
          {
            error ? (
              <a href="/auth-server/user-login">Login</a>
            ) : isLoading ? (
              <Spinner />
            ) : data ? (
              <span className="flex-center-vertical">
                {data.email}
                <Avatar src={img_avatar_url} alt='profile picture' />
                <Form method='POST' action='/auth-server/user-logout'>
                  <Button type='submit'>Logout</Button>
                </Form>
              </span>
            ) : null
          }
        </span>
      </MastheadContent>
    </Masthead>
  );
  const sidebarContent = (
    <Nav>
      <NavList>
        <NavLink to="users">{({ isActive }) => <NavItem isActive={isActive}><span>Users</span></NavItem>}</NavLink>
        <NavLink to="roles">{({ isActive }) => <NavItem isActive={isActive}><span>Roles</span></NavItem>}</NavLink>
        <NavLink to="support">{({ isActive }) => <NavItem isActive={isActive}><span>Support</span></NavItem>}</NavLink>
      </NavList>
    </Nav>
  );
  const sidebar = (<PageSidebar nav={sidebarContent} />);
  return (
    <Page isManagedSidebar={true} header={header} sidebar={sidebar}>
      <PageSection isFilled={true}>
        <Routes>
          <Route path='/' element={<Users />} />
          <Route path='users' element={<Users />} />
          <Route path='roles' element={<Roles />} />
          <Route path='support' element={<Support />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </PageSection>
      <footer>Footer</footer>
    </Page>
  );
}
