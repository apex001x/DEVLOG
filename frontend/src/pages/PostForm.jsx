import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPost, createPost, updatePost } from '../api/posts'

function PostForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()

  const isEdit = !!id

  useEffect(() => {
    if (isEdit) fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await getPost(id)
      setTitle(response.data.title)
      setContent(response.data.content)
    } catch (error) {
      console.error('게시글 불러오기 실패:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return alert('제목과 내용을 입력해주세요')
    setLoading(true)
    try {
      if (isEdit) {
        await updatePost(id, { title, content })
      } else {
        await createPost({ title, content })
      }
      navigate('/')
    } catch (error) {
      console.error('저장 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* 네비게이션 */}
      <nav className="nav">
        <span className="nav-logo">BLOG</span>
        <button className="btn-ghost" onClick={() => navigate('/')}>← 목록으로</button>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '4rem 2.5rem' }}>

        {/* 타이틀 */}
        <p style={{ fontSize: '12px', color: '#555', letterSpacing: '0.08em', marginBottom: '1.2rem' }}>
          {isEdit ? 'EDIT POST' : 'NEW POST'}
        </p>
        <h1 style={{ fontSize: '36px', fontWeight: '300', letterSpacing: '-0.02em', marginBottom: '3rem' }}>
          {isEdit ? '게시글 수정' : '새 글 쓰기'}
        </h1>

        <div style={{ height: '0.5px', background: '#2a2a2a', marginBottom: '3rem' }} />

        {/* 폼 */}
        <div onSubmit={handleSubmit}>

          {/* 제목 입력 */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ fontSize: '12px', color: '#555', letterSpacing: '0.08em', display: 'block', marginBottom: '0.8rem' }}>
              TITLE
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '0.5px solid #2a2a2a',
                color: '#f0f0f0',
                fontSize: '20px',
                fontWeight: '300',
                padding: '0.5rem 0',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* 내용 입력 */}
          <div style={{ marginBottom: '3rem' }}>
            <label style={{ fontSize: '12px', color: '#555', letterSpacing: '0.08em', display: 'block', marginBottom: '0.8rem' }}>
              CONTENT
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              rows={16}
              style={{
                width: '100%',
                background: 'transparent',
                border: '0.5px solid #2a2a2a',
                borderRadius: '6px',
                color: '#f0f0f0',
                fontSize: '15px',
                lineHeight: '1.9',
                padding: '1rem',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* 버튼 */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleSubmit}
              className="btn-primary"
              disabled={loading}
              style={{ opacity: loading ? 0.5 : 1 }}
            >
              {loading ? '저장 중...' : isEdit ? '수정 완료' : '발행하기'}
            </button>
            <button className="btn-ghost" onClick={() => navigate('/')}>취소</button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default PostForm