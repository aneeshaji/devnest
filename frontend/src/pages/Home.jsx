import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { articles } from "../services/api";
import "../styles/Home.css";

export default function Home() {
  const [articleList, setArticleList] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("latest");

  useEffect(() => {
    loadArticles();
    loadTrending();
  }, []);

  const loadArticles = async () => {
    try {
      const response = await articles.getAll();
      setArticleList(response.data.articles);
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTrending = async () => {
    try {
      const response = await articles.getTrending();
      setTrending(response.data);
    } catch (error) {
      console.error("Error loading trending:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="container">
        <div className="home-layout">
          {/* Main Content */}
          <main className="home-main">
            <div className="feed-header">
              <button
                className={`tab ${activeTab === "latest" ? "active" : ""}`}
                onClick={() => setActiveTab("latest")}
              >
                Latest
              </button>
              <button
                className={`tab ${activeTab === "trending" ? "active" : ""}`}
                onClick={() => setActiveTab("trending")}
              >
                Trending
              </button>
            </div>

            <div className="articles-list">
              {articleList.length === 0 ? (
                <div className="empty-state">
                  <h3>No articles yet</h3>
                  <p>Be the first to write an article!</p>
                  <Link to="/write" className="btn btn-primary">
                    Write Article
                  </Link>
                </div>
              ) : (
                articleList.map((article) => (
                  <article key={article._id} className="article-card">
                    <div className="article-author">
                      <img
                        src={article.author.profilePicture}
                        alt={article.author.username}
                        className="author-avatar"
                      />
                      <div>
                        <Link
                          to={`/@${article.author.username}`}
                          className="author-name"
                        >
                          {article.author.displayName ||
                            article.author.username}
                        </Link>
                        <div className="article-meta">
                          {new Date(article.publishedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}{" "}
                          · {article.readingTime} min read
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/article/${article.slug}`}
                      className="article-content"
                    >
                      <h2 className="article-title">{article.title}</h2>
                      <p className="article-excerpt">{article.excerpt}</p>
                    </Link>

                    <div className="article-footer">
                      <div className="article-tags">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="tag">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="article-stats">
                        <span>❤️ {article.reactions.likes}</span>
                        <span>👁️ {article.views}</span>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="home-sidebar">
            <div className="sidebar-card">
              <h3>Trending Articles</h3>
              <div className="trending-list">
                {trending.slice(0, 5).map((article, index) => (
                  <Link
                    key={article._id}
                    to={`/article/${article.slug}`}
                    className="trending-item"
                  >
                    <span className="trending-number">{index + 1}</span>
                    <div>
                      <h4>{article.title}</h4>
                      <p className="trending-meta">
                        {article.views} views · {article.reactions.likes} likes
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="sidebar-card">
              <h3>Popular Tags</h3>
              <div className="tags-cloud">
                {[
                  "javascript",
                  "react",
                  "nodejs",
                  "python",
                  "typescript",
                  "webdev",
                  "tutorial",
                  "programming",
                ].map((tag) => (
                  <span key={tag} className="tag-cloud-item">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
