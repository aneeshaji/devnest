import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { articles, comments as commentsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import '../styles/Article.css';

export default function Article() {
	const { slug } = useParams();
	const { user, isAuthenticated } = useContext(AuthContext);
	const navigate = useNavigate();
	const [article, setArticle] = useState(null);
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadArticle();
		loadComments();
	}, [slug]);

	const loadArticle = async () => {
		try {
			const response = await articles.getOne(slug);
			setArticle(response.data);
		} catch (error) {
			console.error('Error loading article:', error);
		} finally {
			setLoading(false);
		}
	};

	const loadComments = async () => {
		try {
			const response = await commentsAPI.getAll(slug);
			setComments(response.data);
		} catch (error) {
			console.error('Error loading comments:', error);
		}
	};

	const handleCommentSubmit = async (e) => {
		e.preventDefault();
		if (!newComment.trim()) return;

		try {
			await commentsAPI.create(article._id, { content: newComment });
			setNewComment('');
			loadComments();
		} catch (error) {
			console.error('Error posting comment:', error);
		}
	};

	const handleDelete = async () => {
		if (!window.confirm('Are you sure you want to delete this article?')) return;

		try {
			await articles.delete(article._id);
			navigate('/');
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

	if (!article) {
		return (
			<div className="container-narrow" style={{ textAlign: 'center', padding: '4rem 0' }}>
				<h2>Article not found</h2>
				<Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
					Go Home
				</Link>
			</div>
		);
	}

	const isAuthor = user?._id === article.author._id;

	return (
		<div className="article-page">
			<div className="container-narrow">
				{/* Article Header */}
				<header className="article-header">
					<h1 className="article-title">{article.title}</h1>

					<div className="article-meta-bar">
						<div className="article-author-info">
							<img
								src={article.author.profilePicture}
								alt={article.author.username}
								className="author-avatar-large"
							/>
							<div>
								<Link to={`/@${article.author.username}`} className="author-name-large">
									{article.author.displayName || article.author.username}
								</Link>
								<div className="article-date">
									{new Date(article.publishedAt).toLocaleDateString('en-US', {
										month: 'long',
										day: 'numeric',
										year: 'numeric'
									})} · {article.readingTime} min read
								</div>
							</div>
						</div>

						{isAuthor && (
							<div className="article-actions">
								<Link to={`/edit/${article._id}`} className="btn btn-ghost">
									Edit
								</Link>
								<button onClick={handleDelete} className="btn btn-ghost btn-danger">
									Delete
								</button>
							</div>
						)}
					</div>

					<div className="article-tags-header">
						{article.tags.map(tag => (
							<span key={tag} className="tag">#{tag}</span>
						))}
					</div>
				</header>

				{/* Article Content */}
				<div className="article-content">
					<ReactMarkdown
						components={{
							code({ className, children, ...props }: any) {
								const match = /language-(\w+)/.exec(className || '');

								// If NO language → treat as inline code
								if (!match) {
									return (
										<code className={className} {...props}>
											{children}
										</code>
									);
								}

								return (
									<div className="code-block">
										<div className="code-header">
											<span className="code-language">{match[1]}</span>
											<button
												className="code-copy"
												onClick={() => navigator.clipboard.writeText(String(children))}
											>
												Copy
											</button>
										</div>

										<SyntaxHighlighter
											style={vscDarkPlus}
											language={match[1]}
											PreTag="div"
											{...props}
										>
											{String(children).replace(/\n$/, '')}
										</SyntaxHighlighter>
									</div>
								);
							}

						}}
					>
						{article.content}
					</ReactMarkdown>
				</div>

				{/* Article Footer Stats */}
				<div className="article-stats-footer">
					<div className="stat">
						<span className="stat-icon">❤️</span>
						<span>{article.reactions.likes}</span>
					</div>
					<div className="stat">
						<span className="stat-icon">👁️</span>
						<span>{article.views} views</span>
					</div>
					<div className="stat">
						<span className="stat-icon">💬</span>
						<span>{article.commentsCount} comments</span>
					</div>
				</div>

				{/* Comments Section */}
				<section className="comments-section">
					<h2>Comments ({article.commentsCount})</h2>

					{isAuthenticated ? (
						<form onSubmit={handleCommentSubmit} className="comment-form">
							<textarea
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								placeholder="Write a comment..."
								rows={4}
							/>
							<button type="submit" className="btn btn-primary">
								Post Comment
							</button>
						</form>
					) : (
						<div className="comment-prompt">
							<p>
								<Link to="/login">Login</Link> to comment on this article
							</p>
						</div>
					)}

					<div className="comments-list">
						{comments.length === 0 ? (
							<p className="no-comments">No comments yet. Be the first to comment!</p>
						) : (
							comments.map(comment => (
								<div key={comment._id} className="comment">
									<img
										src={comment.author.profilePicture}
										alt={comment.author.username}
										className="comment-avatar"
									/>
									<div className="comment-content">
										<div className="comment-header">
											<Link to={`/@${comment.author.username}`} className="comment-author">
												{comment.author.displayName || comment.author.username}
											</Link>
											<span className="comment-date">
												{new Date(comment.createdAt).toLocaleDateString()}
											</span>
										</div>
										<p className="comment-text">{comment.content}</p>
									</div>
								</div>
							))
						)}
					</div>
				</section>
			</div>
		</div>
	);
}