package models

import (
	"github.com/jmoiron/sqlx"
)

type Post struct {
	ID          string `db:"id" json:"id"`
	Type        string `db:"type" json:"type"`
	Title       string `db:"title" json:"title"`
	Description string `db:"description" json:"description"`
	Thumbnail   string `db:"thumbnail" json:"thumbnail"`
	Content     string `db:"content" json:"content"`
	Rating      int    `db:"rating" json:"rating"`
	Datetime    int64  `db:"datetime" json:"datetime"`
	Unlisted    bool   `db:"unlisted" json:"unlisted"`
}

func InitializeDatabase(db *sqlx.DB) {
	_, err := db.Exec(`
        CREATE TABLE IF NOT EXISTS posts (
            id TEXT PRIMARY KEY,
			type TEXT NOT NULL,
            title TEXT NOT NULL,
			description TEXT NOT NULL,
            content TEXT NOT NULL,
			thumbnail TEXT NOT NULL,
			rating INTEGER NOT NULL,
			datetime INTEGER NOT NULL,
			unlisted BOOLEAN NOT NULL
        )
    `)
	if err != nil {
		panic(err)
	}
}

func GetUnlistedPosts(db *sqlx.DB) ([]Post, error) {
	var posts []Post
	err := db.Select(&posts, "SELECT * FROM posts WHERE unlisted=FALSE")
	return posts, err
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

func CreatePostWithID(db *sqlx.DB, post *Post) error {
	_, err := db.Exec("INSERT INTO posts (id, type, title, description, content, thumbnail, rating, datetime, unlisted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", post.ID, post.Type, post.Title, post.Description, post.Content, post.Thumbnail, post.Rating, post.Datetime, post.Unlisted)
	return err
}

func UpdatePost(db *sqlx.DB, id int, post *Post) (int64, error) {
	_, err := db.Exec("UPDATE posts SET type=?, title=?, description=?, content=?, thumbnail=?, rating=?, datetime=?, unlisted=? WHERE id=?", post.Type, post.Title, post.Description, post.Content, post.Thumbnail, post.Rating, post.Datetime, post.Unlisted, id)
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
