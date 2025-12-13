import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { auth as authAPI } from '../services/api';
import '../styles/Settings.css';

export default function Settings() {
	const { user, logout } = useContext(AuthContext);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	const [formData, setFormData] = useState({
		displayName: '',
		bio: '',
		location: '',
		website: '',
		github: '',
		linkedin: '',
		twitter: '',
		skills: ''
	});

	useEffect(() => {
		if (user) {
			setFormData({
				displayName: user.displayName || '',
				bio: user.bio || '',
				location: user.location || '',
				website: user.socialLinks?.website || '',
				github: user.socialLinks?.github || '',
				linkedin: user.socialLinks?.linkedin || '',
				twitter: user.socialLinks?.twitter || '',
				skills: user.skills?.join(', ') || ''
			});
		}
	}, [user]);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage('');
		setError('');

		try {
			const updateData = {
				displayName: formData.displayName,
				bio: formData.bio,
				location: formData.location,
				skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
				socialLinks: {
					website: formData.website,
					github: formData.github,
					linkedin: formData.linkedin,
					twitter: formData.twitter
				}
			};

			await authAPI.updateProfile(updateData);
			setMessage('Profile updated successfully!');

			// Reload page to refresh user data
			setTimeout(() => {
				window.location.reload();
			}, 1500);
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to update profile');
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	return (
		<div className="settings">
			<div className="container-narrow">
				<div className="settings-header">
					<h1>Settings</h1>
					<p>Manage your account settings and profile</p>
				</div>

				{message && (
					<div className="alert alert-success">
						✅ {message}
					</div>
				)}

				{error && (
					<div className="alert alert-error">
						❌ {error}
					</div>
				)}

				<div className="settings-card">
					<h2>Profile Information</h2>

					<form onSubmit={handleSubmit} className="settings-form">
						<div className="form-group">
							<label htmlFor="displayName">Display Name</label>
							<input
								id="displayName"
								name="displayName"
								type="text"
								value={formData.displayName}
								onChange={handleChange}
								placeholder="Your display name"
							/>
						</div>

						<div className="form-group">
							<label htmlFor="bio">Bio</label>
							<textarea
								id="bio"
								name="bio"
								value={formData.bio}
								onChange={handleChange}
								placeholder="Tell us about yourself..."
								rows={4}
							/>
							<small>{formData.bio.length}/200 characters</small>
						</div>

						<div className="form-group">
							<label htmlFor="location">Location</label>
							<input
								id="location"
								name="location"
								type="text"
								value={formData.location}
								onChange={handleChange}
								placeholder="City, Country"
							/>
						</div>

						<div className="form-group">
							<label htmlFor="skills">Skills (comma separated)</label>
							<input
								id="skills"
								name="skills"
								type="text"
								value={formData.skills}
								onChange={handleChange}
								placeholder="JavaScript, React, Node.js"
							/>
						</div>

						<h3>Social Links</h3>

						<div className="form-group">
							<label htmlFor="website">Website</label>
							<input
								id="website"
								name="website"
								type="url"
								value={formData.website}
								onChange={handleChange}
								placeholder="https://yourwebsite.com"
							/>
						</div>

						<div className="form-group">
							<label htmlFor="github">GitHub</label>
							<input
								id="github"
								name="github"
								type="url"
								value={formData.github}
								onChange={handleChange}
								placeholder="https://github.com/username"
							/>
						</div>

						<div className="form-group">
							<label htmlFor="linkedin">LinkedIn</label>
							<input
								id="linkedin"
								name="linkedin"
								type="url"
								value={formData.linkedin}
								onChange={handleChange}
								placeholder="https://linkedin.com/in/username"
							/>
						</div>

						<div className="form-group">
							<label htmlFor="twitter">Twitter</label>
							<input
								id="twitter"
								name="twitter"
								type="url"
								value={formData.twitter}
								onChange={handleChange}
								placeholder="https://twitter.com/username"
							/>
						</div>

						<button type="submit" className="btn btn-primary btn-block" disabled={loading}>
							{loading ? 'Saving...' : 'Save Changes'}
						</button>
					</form>
				</div>

				<div className="settings-card danger-zone">
					<h2>Danger Zone</h2>
					<p>Once you logout, you'll need to login again to access your account.</p>
					<button onClick={handleLogout} className="btn btn-danger">
						Logout
					</button>
				</div>
			</div>
		</div>
	);
}