import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Teams from './pages/Teams/Teams';
import AuthProvider from './auth/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Login from './pages/Login/Login';

import styles from './App.module.scss';
import NavBar from './components/NavBar/NavBar';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className={styles.app}>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route
                            path="/teams?/:searchQuery"
                            element={
                                <ProtectedRoute>
                                    <NavBar />
                                    <Teams />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
