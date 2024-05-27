package models

import (
	"github.com/jmoiron/sqlx"
)

// Post represents a blog post in the database.
type Post struct {
	ID      int    `db:"id" json:"id"`
	Title   string `db:"title" json:"title"`
	Content string `db:"content" json:"content"`
}

// InitializeDatabase creates the 'posts' table if it doesn't exist.
func InitializeDatabase(db *sqlx.DB) {
	_, err := db.Exec(`
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL
        )
    `)
	if err != nil {
		panic(err) // Handle the error appropriately in a real application.
	}
}

// GetPosts retrieves all posts from the database.
func GetPosts(db *sqlx.DB) ([]Post, error) {
	var posts []Post
	err := db.Select(&posts, "SELECT * FROM posts")
	return posts, err
}

// GetPostByID retrieves a single post by its ID from the database.
func GetPostByID(db *sqlx.DB, id int) (Post, error) {
	var post Post
	err := db.Get(&post, "SELECT * FROM posts WHERE id=?", id)
	return post, err
}

// CreatePost creates a new post in the database.
func CreatePost(db *sqlx.DB, post *Post) (int64, error) {
	result, err := db.Exec("INSERT INTO posts (title, content) VALUES (?, ?)", post.Title, post.Content)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}
