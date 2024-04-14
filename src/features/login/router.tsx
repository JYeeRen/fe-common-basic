import { RouteObject } from 'react-router-dom';

export const LoginRouter: RouteObject = {
  path: 'login',
  async lazy() {
    const Login = await import('./login');
    return { Component: Login.Page };
  } 
};
