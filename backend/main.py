from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from supabase import create_client
from pydantic import BaseModel
import os

load_dotenv()

app =FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

class PostCreate(BaseModel):
    title: str
    content: str

@app.get("/posts")
def get_posts():
    response = supabase.table("posts").select("*").order("created_at", desc=True).execute()
    return response.data

@app.get("/posts/{post_id}")
def get_post(post_id: int):
    response = supabase.table("posts").select("*").eq("id", post_id).maybe_single().execute()
    if not response or not response.data:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")
    return response.data

@app.post("/posts")
def create_post(post: PostCreate):
    response = supabase.table("posts").insert({
        "title": post.title,
        "content": post.content
    }).execute()
    return response.data[0]

@app.put("/posts/{post_id}")
def update_post(post_id: int, post: PostCreate):
    response = supabase.table("posts").update({
        "title": post.title,
        "content": post.content,
        "updated_at": "now()"
    }).eq("id", post_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")
    return response.data[0]

@app.delete("/posts/{post_id}")
def delete_post(post_id: int):
    response = supabase.table("posts").delete().eq("id", post_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")
    return {"message": "게시글이 삭제됐습니다"}
