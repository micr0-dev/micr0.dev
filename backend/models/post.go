package models

import (
	"github.com/jmoiron/sqlx"
)

type Post struct {
	ID          int    `db:"id" json:"id"`
	Type        string `db:"type" json:"type"`
	Title       string `db:"title" json:"title"`
	Description string `db:"description" json:"description"`
	Thumbnail   string `db:"thumbnail" json:"thumbnail"`
	Content     string `db:"content" json:"content"`
	Rating      int    `db:"rating" json:"rating"`
}

func InitializeDatabase(db *sqlx.DB) {
	_, err := db.Exec(`
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
			type TEXT NOT NULL,
            title TEXT NOT NULL,
			description TEXT NOT NULL,
            content TEXT NOT NULL,
			thumbnail TEXT NOT NULL,
			rating INTEGER NOT NULL
        )
    `)
	if err != nil {
		panic(err)
	}
}

func GetPosts(db *sqlx.DB) ([]Post, error) {
	var posts []Post
	err := db.Select(&posts, "SELECT * FROM posts")
	return posts, err
}

func GetPostByID(db *sqlx.DB, id int) (Post, error) {
	var post Post
	err := db.Get(&post, "SELECT * FROM posts WHERE id=?", id)
	return post, err
}

func CreatePost(db *sqlx.DB, post *Post) (int64, error) {
	result, err := db.Exec("INSERT INTO posts (type, title, description, content, thumbnail, rating) VALUES (?, ?, ?, ?, ?, ?)", post.Type, post.Title, post.Description, post.Content, post.Thumbnail, post.Rating)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

func UpdatePost(db *sqlx.DB, id int, post *Post) (int64, error) {
	_, err := db.Exec("UPDATE posts SET type=?, title=?, description=?, content=?, thumbnail=?, rating=? WHERE id=?", post.Type, post.Title, post.Description, post.Content, post.Thumbnail, post.Rating, id)
	return int64(id), err
}

func DeletePost(db *sqlx.DB, id int) error {
	_, err := db.Exec("DELETE FROM posts WHERE id=?", id)
	return err
}

func RatePost(db *sqlx.DB, id, rating int) error {
	_, err := db.Exec("UPDATE posts SET rating=? WHERE id=?", rating, id)
	return err
}
