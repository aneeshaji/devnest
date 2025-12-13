import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { articles } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import '../styles/Write.css';

export default function Write() {
    const { id } = useParams();
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const isEdit = !!id;

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }

        if (isEdit) {
            loadArticle();
        }
    }, [isAuthenticated, isEdit, id]);

    const loadArticle = async () => {
        try {
            const response = await articles.getOne(id);
            const article = response.data;
            setTitle(article.title);
            setContent(article.content);
            setTags(article.tags.join(', '));
            setCoverImage(article.coverImage || '');
        } catch (error) {
            console.error('Error loading article:', error);
            setError('Failed to load article');
        }
    };

    const handleSubmit = async (e, publish = false) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const articleData = {
                title,
                content,
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                coverImage,
                published: publish
            };

            if (isEdit) {
                await articles.update(id, articleData);
            } else {
                const response = await articles.create(articleData);
                navigate(`/article/${response.data.slug}`);
                return;
            }

            navigate(publish ? `/article/${id}` : '/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save article');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="write-page">
            <div className="write-container">
                <div className="write-header">
                    <h1>{isEdit ? 'Edit Article' : 'Write New Article'}</h1>
                    <div className="write-actions">
                        <button
                            onClick={(e) => handleSubmit(e, false)}
                            className="btn btn-ghost"
                            disabled={loading}
                        >
                            Save Draft
                        </button>
                        <button
                            onClick={(e) => handleSubmit(e, true)}
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Publishing...' : 'Publish'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form className="write-form">
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Article Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="title-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Tags (comma separated): react, javascript, tutorial"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="tags-input"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="url"
                            placeholder="Cover Image URL (optional)"
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            className="cover-input"
                        />
                    </div>

                    <div className="editor-container" data-color-mode="light">
                        <MDEditor
                            value={content}
                            onChange={setContent}
                            preview="live"
                            height={600}
                            visibleDragbar={false}
                        />
                    </div>

                    <div className="editor-help">
                        <p>💡 <strong>Tip:</strong> Use Markdown to format your article. Supports code blocks with syntax highlighting!</p>
                    </div>
                </form>
            </div>
        </div>
    );
}