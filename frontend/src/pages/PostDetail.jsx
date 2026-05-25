import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPost, deletePost } from '../api/posts'

function PostDetail() {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await getPost(id)
      setPost(response.data)
    } catch (error) {
      console.error('게시글 불러오기 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제할까요?')) return
    try {
      await deletePost(id)
      navigate('/')
    } catch (error) {
      console.error('삭제 실패:', error)
    }
  }

  if (loading) return <div style={{ padding: '2.5rem', color: '#555' }}>불러오는 중...</div>
  if (!post) return <div style={{ padding: '2.5rem', color: '#555' }}>게시글을 찾을 수 없습니다.</div>

  return (
    <div>
      {/* 네비게이션 */}
      <nav className="nav">
        <span className="nav-logo">BLOG</span>
        <button className="btn-ghost" onClick={() => navigate('/')}>← 목록으로</button>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '4rem 2.5rem' }}>

        {/* 메타 정보 */}
        <p style={{ fontSize: '12px', color: '#555', letterSpacing: '0.08em', marginBottom: '1.2rem' }}>
          {new Date(post.created_at).toLocaleDateString('ko-KR', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}
        </p>

        {/* 제목 */}
        <h1 style={{ fontSize: '36px', fontWeight: '300', lineHeight: '1.2', letterSpacing: '-0.02em', marginBottom: '3rem' }}>
          {post.title}
        </h1>

        <div style={{ height: '0.5px', background: '#2a2a2a', marginBottom: '3rem' }} />

        {/* 본문 */}
        <p style={{ fontSize: '16px', color: '#ccc', lineHeight: '1.9', whiteSpace: 'pre-wrap' }}>
          {post.content}
        </p>

        <div style={{ height: '0.5px', background: '#2a2a2a', margin: '3rem 0' }} />

        {/* 버튼 */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-primary" onClick={() => navigate(`/posts/${id}/edit`)}>수정</button>
          <button className="btn-danger" onClick={handleDelete}>삭제</button>
        </div>

      </div>
    </div>
  )
}

export default PostDetail