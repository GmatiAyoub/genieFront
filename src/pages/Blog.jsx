import { useEffect, useState } from "react";
import api from "../api/axiosInstance.js";
import { useLang } from "../context/LangContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { saveToken, getToken } from "../utils/commentTokens.js";

function CommentForm({ onSubmit, onCancel, initialValue = "", submitLabel = "Envoyer" }) {
  const [contenu, setContenu] = useState(initialValue);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await onSubmit(contenu);
      if (!initialValue) setContenu("");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'envoi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-2">
      <textarea
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
        required
        rows={2}
        className="w-full px-3 py-2 border rounded-lg text-sm"
      />
      {error && <p className="text-red-600 text-xs">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm disabled:opacity-50"
        >
          {submitting ? "Envoi..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 border rounded-lg hover:bg-slate-100 text-sm"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}

function SingleComment({ comment, isAdmin, canEdit, onReply, onEdit, onDelete, isReply }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleReplySubmit = async (contenu) => {
    await onReply(comment._id, contenu);
    setShowReplyForm(false);
  };

  const handleEditSubmit = async (contenu) => {
    await onEdit(comment._id, contenu);
    setEditing(false);
  };

  return (
    <div className={isReply ? "bg-white rounded-lg p-2" : "bg-slate-50 rounded-lg p-3"}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-700">{comment.nom}</p>
          {editing ? (
            <CommentForm
              initialValue={comment.contenu}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditing(false)}
              submitLabel="Enregistrer"
            />
          ) : (
            <p className="text-sm text-slate-600">{comment.contenu}</p>
          )}
        </div>
        <div className="flex gap-2 ml-2 shrink-0">
          {canEdit && !editing && (
            <button onClick={() => setEditing(true)} className="text-xs text-blue-600 hover:underline">
              Modifier
            </button>
          )}
          {isAdmin && (
            <button onClick={() => onDelete(comment._id)} className="text-xs text-red-500 hover:underline">
              Supprimer
            </button>
          )}
        </div>
      </div>

      {!isReply && !editing && (
        <button
          onClick={() => setShowReplyForm((v) => !v)}
          className="text-xs text-blue-600 hover:underline mt-1"
        >
          Répondre
        </button>
      )}

      {showReplyForm && (
        <CommentForm onSubmit={handleReplySubmit} onCancel={() => setShowReplyForm(false)} />
      )}
    </div>
  );
}

function CommentSection({ articleId }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/articles/${articleId}/comments`);
      setComments(res.data);
    } catch (err) {
      // silencieux
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  const topLevel = comments.filter((c) => !c.parentComment);
  const repliesOf = (id) => comments.filter((c) => c.parentComment === id);

  const handleNewComment = async (contenu) => {
    const res = await api.post(`/articles/${articleId}/comments`, { contenu });
    saveToken(res.data._id, res.data.editToken);
    setShowCommentForm(false);
    fetchComments();
  };

  const handleReply = async (parentId, contenu) => {
    const res = await api.post(`/articles/${articleId}/comments`, { contenu, parentComment: parentId });
    saveToken(res.data._id, res.data.editToken);
    fetchComments();
  };

  const handleEdit = async (commentId, contenu) => {
    const token = getToken(commentId);
    await api.patch(`/comments/${commentId}`, { contenu, editToken: token });
    fetchComments();
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Supprimer ce commentaire ?")) return;
    try {
      await api.delete(`/comments/${commentId}`);
      fetchComments();
    } catch (err) {
      // silencieux
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">
          Commentaires {topLevel.length > 0 && `(${topLevel.length})`}
        </h3>
        {!showCommentForm && (
          <button
            onClick={() => setShowCommentForm(true)}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm"
          >
            Commenter
          </button>
        )}
      </div>

      {showCommentForm && (
        <CommentForm onSubmit={handleNewComment} onCancel={() => setShowCommentForm(false)} />
      )}

      {!loading && topLevel.length === 0 && (
        <p className="text-sm text-slate-400 mt-3">Aucun commentaire pour l'instant.</p>
      )}

      <div className="space-y-2 mt-3">
        {topLevel.map((c) => (
          <div key={c._id}>
            <SingleComment
              comment={c}
              isAdmin={isAdmin}
              canEdit={isAdmin || !!getToken(c._id)}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isReply={false}
            />
            {repliesOf(c._id).length > 0 && (
              <div className="ml-6 mt-2 space-y-2 border-l-2 border-slate-200 pl-3">
                {repliesOf(c._id).map((r) => (
                  <SingleComment
                    key={r._id}
                    comment={r}
                    isAdmin={isAdmin}
                    canEdit={isAdmin || !!getToken(r._id)}
                    onReply={handleReply}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isReply={true}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Blog() {
  const { t } = useLang();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/articles")
      .then((res) => setArticles(res.data))
      .catch(() => setError("Impossible de charger les actualités."))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
  if (!loading && window.location.hash) {
    const el = document.getElementById(window.location.hash.slice(1));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}, [loading]);

  if (loading) return <p className="text-slate-500">{t("loading")}</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">{t("blogTitle")}</h1>

      {articles.length === 0 && <p className="text-slate-500">{t("noArticles")}</p>}

      <div className="space-y-4">
        {articles.map((a) => (
<article key={a._id} id={`article-${a._id}`} className="bg-white rounded-lg shadow-sm p-5">            <h2 className="text-lg font-bold text-slate-800 mb-2" dir={a.rtl ? "rtl" : "ltr"}>
              {a.titre}
            </h2>
            <p className="text-slate-600 whitespace-pre-line" dir={a.rtl ? "rtl" : "ltr"}>
              {a.contenu}
            </p>
            <p className="text-xs text-slate-400 mt-3">
              {new Date(a.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

            <CommentSection articleId={a._id} />
          </article>
        ))}
      </div>
    </div>
  );
}

export default Blog;