import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPosts, deletePost } from '../api/posts'

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await getPosts()
      setPosts(response.data)
    } catch (error) {
      console.error('게시글 불러오기 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제할까요?')) return
    try {
      await deletePost(id)
      setPosts(posts.filter(post => post.id !== id))
    } catch (error) {
      console.error('삭제 실패:', error)
    }
  }

  if (loading) return <div style={{ padding: '2.5rem', color: '#ffffff' }}>불러오는 중...</div>

  return (
    <div>
      {/* 네비게이션 */}
      <nav className="nav">
        <span className="nav-logo">DEVLOG</span>
        <button className="nav-btn" onClick={() => navigate('/posts/new')}>+ 글쓰기</button>
      </nav>

      {/* 히어로 */}
      <div style={{ padding: '5rem 2.5rem 4rem' }}>
        <p style={{ fontSize: '12px', color: '#ffffff', letterSpacing: '0.12em', marginBottom: '1.2rem' }}>DEVELOPMENT LOG</p>
        <h1 style={{ fontSize: '48px', fontWeight: '300', lineHeight: '1.15', letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
          생각을 기록하는<br /><strong style={{ fontWeight: '600' }}>공간.</strong>
        </h1>
        <p style={{ fontSize: '15px', color: '#ffffff', lineHeight: '1.7', maxWidth: '400px' }}>
          개발하면서 배운 것들, 느낀 것들을 천천히 정리합니다.
        </p>
      </div>

      <div style={{ height: '0.5px', background: '#ffffff', margin: '0 2.5rem' }} />

      {/* 게시글 목록 */}
      <div style={{ padding: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '13px', color: '#ffffff', letterSpacing: '0.08em' }}>ALL POSTS</span>
        </div>

        {posts.length === 0 && (
          <p style={{ color: '#c0c0c0', fontSize: '14px' }}>아직 게시글이 없습니다.</p>
        )}

        {posts.map((post, index) => (
          <div
            key={post.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.4rem',
              borderBottom: '0.5px solid #c3c3c3ba',
              transition: 'transform 0.15s',
              background: '#7474742d',
              borderRadius: '10px',
              marginBottom: '0.7rem',
              cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateX(-0.7rem)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
            onClick={() => navigate(`/posts/${post.id}`)}
          >
            {/* 왼쪽: 번호 + 제목 + 미리보기 */}
            <div
              onClick={() => navigate(`/posts/${post.id}`)}
              style={{ flex: 1, cursor: 'pointer' }}
            >
              <p style={{ fontSize: '11px', color: '#ffffff', marginBottom: '0.4rem' }}>
                {String(index + 1).padStart(3, '0')}
              </p>
              <p style={{ fontSize: '16px', color: '#f0f0f0', marginBottom: '0.3rem' }}>
                {post.title}
              </p>
              <p style={{ fontSize: '13px', color: '#c4c4c4', lineHeight: '1.5' }}>
                {post.content.length > 60 ? post.content.slice(0, 60) + '...' : post.content}
              </p>
            </div>

            {/* 오른쪽: 날짜 + 버튼 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginLeft: '2rem',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: '12px', color: '#ffffff' }}>
                {new Date(post.created_at).toLocaleDateString('ko-KR')}
              </span>
              <button className="btn-ghost" onClick={() => navigate(`/posts/${post.id}/edit`)}>
                수정
              </button>
              <button className="btn-danger" onClick={() => handleDelete(post.id)}>
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home