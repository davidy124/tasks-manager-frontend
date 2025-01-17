import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Login from './pages/Login';
import TaskBoard from './pages/TaskBoard';
import UserManagement from './pages/UserManagement';
import UserForm from './components/UserForm';
import TasksManagement from './pages/TasksManagement';
import TaskForm from './components/TaskForm';
import TaskDetails from './components/TaskDetails';
import TaskList from './pages/TaskList';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      useErrorBoundary: (error) => {
        return error.message !== 'Invalid username or password';
      },
    },
    mutations: {
      useErrorBoundary: (error) => {
        return error.message !== 'Invalid username or password';
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <ErrorBoundary>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <>
                        <Header />
                        <Routes>
                          <Route path="/" element={<TaskList />} />
                          <Route path="/board" element={<TaskBoard />} />
                          <Route path="/users" element={<UserManagement />} />
                          <Route path="/users/new" element={<UserForm />} />
                          <Route path="/users/edit/:id" element={<UserForm />} />
                          <Route path="/tasks-management" element={<TasksManagement />} />
                          <Route path="/tasks/new" element={<TaskForm />} />
                          <Route path="/tasks/edit/:id" element={<TaskForm />} />
                          <Route path="/tasks/:id" element={<TaskDetails />} />
                        </Routes>
                      </>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </ErrorBoundary>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
