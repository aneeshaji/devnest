import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { articles } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import '../styles/Dashboard.css';

export default function Dashboard() {
	const { user } = useContext(AuthContext);
	const [myArticles, setMyArticles] = useState([]);
	const [drafts, setDrafts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState('published');

	useEffect(() => {
		loadArticles();
	}, []);

	const loadArticles = async () => {
		try {
			// Get all articles by current user
			const response = await articles.getAll({ author: user._id });
			const allArticles = response.data.articles;

			setMyArticles(allArticles.filter(a => a.published));
			setDrafts(allArticles.filter(a => !a.published));
		} catch (error) {
			console.error('Error loading articles:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Are you sure you want to delete this article?')) return;

		try {
			await articles.delete(id);
			loadArticles();
		} catch (error) {
			console.error('Error deleting article:', error);
		}
	};

	if (loading) {
		return (
			<div className="loading">
				<div className="spinner"></div>
			</div>
		);
	}

	const displayArticles = activeTab === 'published' ? myArticles : drafts;
	const totalViews = myArticles.reduce((sum, a) => sum + a.views, 0);
	const totalLikes = myArticles.reduce((sum, a) => sum + a.reactions.likes, 0);

	return (
		<div className="dashboard">
			<div className="container">
				<div className="dashboard-header">
					<div>
						<h1>Dashboard</h1>
						<p>Manage your articles and track performance</p>
					</div>
					<Link to="/write" className="btn btn-primary">
						✍️ Write New Article
					</Link>
				</div>

				{/* Stats Cards */}
				<div className="stats-grid">
					<div className="stat-card">
						<div className="stat-icon">📝</div>
						<div className="stat-content">
							<div className="stat-value">{myArticles.length}</div>
							<div className="stat-label">Published Articles</div>
						</div>
					</div>

					<div className="stat-card">
						<div className="stat-icon">📄</div>
						<div className="stat-content">
							<div className="stat-value">{drafts.length}</div>
							<div className="stat-label">Drafts</div>
						</div>
					</div>

					<div className="stat-card">
						<div className="stat-icon">👁️</div>
						<div className="stat-content">
							<div className="stat-value">{totalViews}</div>
							<div className="stat-label">Total Views</div>
						</div>
					</div>

					<div className="stat-card">
						<div className="stat-icon">❤️</div>
						<div className="stat-content">
							<div className="stat-value">{totalLikes}</div>
							<div className="stat-label">Total Likes</div>
						</div>
					</div>
				</div>

				{/* Articles Tabs */}
				<div className="dashboard-content">
					<div className="tabs-header">
						<button
							className={`tab ${activeTab === 'published' ? 'active' : ''}`}
							onClick={() => setActiveTab('published')}
						>
							Published ({myArticles.length})
						</button>
						<button
							className={`tab ${activeTab === 'drafts' ? 'active' : ''}`}
							onClick={() => setActiveTab('drafts')}
						>
							Drafts ({drafts.length})
						</button>
					</div>

					<div className="articles-table">
						{displayArticles.length === 0 ? (
							<div className="empty-state">
								<h3>No {activeTab} articles</h3>
								<p>Start writing your first article!</p>
								<Link to="/write" className="btn btn-primary">
									Write Article
								</Link>
							</div>
						) : (
							displayArticles.map(article => (
								<div key={article._id} className="article-row">
									<div className="article-info">
										<Link to={`/article/${article.slug}`} className="article-row-title">
											{article.title}
										</Link>
										<div className="article-row-meta">
											{new Date(article.createdAt).toLocaleDateString()} ·
											{article.readingTime} min read ·
											👁️ {article.views} ·
											❤️ {article.reactions.likes}
										</div>
									</div>
									<div className="article-actions">
										<Link to={`/edit/${article._id}`} className="btn btn-ghost btn-sm">
											Edit
										</Link>
										<button
											onClick={() => handleDelete(article._id)}
											className="btn btn-ghost btn-sm btn-danger"
										>
											Delete
										</button>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
}