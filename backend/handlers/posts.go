package handlers

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"net/http"
	"os"
	"strconv"
	"time"

	"micr0.dev/backend/models"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

type PostHandler struct {
	DB *sqlx.DB
}

func NewPostHandler(db *sqlx.DB) *PostHandler {
	return &PostHandler{DB: db}
}

func (h *PostHandler) GetPosts(c *gin.Context) {
	posts, err := models.GetPosts(h.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get posts"})
		return
	}
	c.JSON(http.StatusOK, posts)
}

func (h *PostHandler) GetPostByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	post, err := models.GetPostByID(h.DB, id)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get post"})
		return
	}

	c.JSON(http.StatusOK, post)
}

func (h *PostHandler) CreatePost(c *gin.Context) {
	if c.GetHeader("password") != os.Getenv("ADMIN_PASSWORD") {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var newPost models.Post
	err := c.ShouldBindJSON(&newPost)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	newPost.Datetime = time.Now().Unix()

	// Generate a unique ID
	newPost.ID, err = generateUniqueID(h.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate unique ID"})
		return
	}

	// Now insert using the generated ID
	err = models.CreatePostWithID(h.DB, &newPost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create post"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Post created successfully", "id": newPost.ID})
}

func generateUniqueID(db *sqlx.DB) (string, error) {
	for { // Keep trying until a unique ID is found
		id := generateRandomHex(4)
		var exists bool
		err := db.Get(&exists, "SELECT 1 FROM posts WHERE id = ? LIMIT 1", id)
		if err != nil {
			return "", err // Database error
		}
		if !exists {
			return id, nil // Found a unique ID!
		}
		// ID already exists, try again
	}
}

func generateRandomHex(length int) string {
	b := make([]byte, length/2)
	if _, err := rand.Read(b); err != nil {
		panic(err)
	}
	return hex.EncodeToString(b)
}

func (h *PostHandler) UpdatePost(c *gin.Context) {
	if c.GetHeader("password") != os.Getenv("ADMIN_PASSWORD") {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	var updatedPost models.Post
	if err := c.ShouldBindJSON(&updatedPost); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err = models.UpdatePost(h.DB, id, &updatedPost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update post"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Post updated successfully"})
}

func (h *PostHandler) DeletePost(c *gin.Context) {
	if c.GetHeader("password") != os.Getenv("ADMIN_PASSWORD") {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	err = models.DeletePost(h.DB, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete post"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Post deleted successfully"})
}

func (h *PostHandler) RatePost(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	post, err := models.GetPostByID(h.DB, id)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get post"})
		return
	}

	err = models.RatePost(h.DB, id, post.Rating+1)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to rate post"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Post rated successfully"})
}

func (h *PostHandler) GetDBFilesize(c *gin.Context) {
	file, err := os.Open("./posts.db")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get database file size"})
		return
	}
	defer file.Close()

	fi, err := file.Stat()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get database file size"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"size": fi.Size()})
}
