import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Article from './pages/Article';
import Write from './pages/Write';
// import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';  // NEW
import Settings from './pages/Settings';      // NEW
import './App.css';

function App() {
	return (
		<AuthProvider>
			<Router>
				<div className="app">
					<Navbar />
					<main className="main-content">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
							<Route path="/article/:slug" element={<Article />} />
							<Route path="/write" element={<Write />} />
							<Route path="/edit/:id" element={<Write />} />
							{/* <Route path="/@:username" element={<Profile />} /> */}
							<Route path="/dashboard" element={<Dashboard />} />  NEW
							<Route path="/settings" element={<Settings />} />      {/* NEW */}
							<Route path="*" element={<NotFound />} />
						</Routes>
					</main>
				</div>
			</Router>
		</AuthProvider>
	);
}

function NotFound() {
	return (
		<div className="container-narrow" style={{ textAlign: 'center', padding: '4rem 0' }}>
			<h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
			<h2>Page Not Found</h2>
			<p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
				The page you're looking for doesn't exist.
			</p>
			<a href="/" className="btn btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>
				Go Home
			</a>
		</div>
	);
}

export default App;