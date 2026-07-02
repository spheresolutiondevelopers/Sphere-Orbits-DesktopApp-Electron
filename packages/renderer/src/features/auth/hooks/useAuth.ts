import { useEffect, useState } from 'react';
import { User } from '@sphere/domain';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    error: null,
  });

  const login = async (email: string, password: string) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const result = await window.electronAPI.login(email, password);
      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }
      setState({
        user: result.data.user,
        token: result.data.token,
        isLoading: false,
        error: null,
      });
      navigate('/dashboard');
    } catch (error: any) {
      setState((s) => ({ ...s, isLoading: false, error: error.message }));
    }
  };

  const logout = async () => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      await window.electronAPI.logout(state.token || '');
      setState({ user: null, token: null, isLoading: false, error: null });
      navigate('/login');
    } catch (error: any) {
      setState((s) => ({ ...s, isLoading: false, error: error.message }));
    }
  };

  const signup = async (data: { email: string; password: string; displayName: string; username: string }) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const result = await window.electronAPI.signup(data);
      if (!result.success) {
        throw new Error(result.error || 'Signup failed');
      }
      setState({
        user: result.data,
        token: null,
        isLoading: false,
        error: null,
      });
      navigate('/dashboard');
    } catch (error: any) {
      setState((s) => ({ ...s, isLoading: false, error: error.message }));
    }
  };

  const validateToken = async (token: string) => {
    try {
      const result = await window.electronAPI.validateToken(token);
      if (result.success && result.data) {
        setState((s) => ({ ...s, user: result.data, token, isLoading: false }));
      }
    } catch {
      // Token invalid
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('sphere-token');
    if (token) {
      validateToken(token);
    } else {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  return {
    ...state,
    login,
    logout,
    signup,
  };
}