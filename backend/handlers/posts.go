package handlers

import (
	"database/sql"
	"net/http"
	"strconv"

	"micr0.dev/backend/models" // Assuming your models package is in the same directory

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

// PostHandler handles API requests related to blog posts.
type PostHandler struct {
	DB *sqlx.DB
}

// NewPostHandler creates a new PostHandler with the provided database connection.
func NewPostHandler(db *sqlx.DB) *PostHandler {
	return &PostHandler{DB: db}
}

// GetPosts retrieves all posts.
func (h *PostHandler) GetPosts(c *gin.Context) {
	posts, err := models.GetPosts(h.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get posts"})
		return
	}
	c.JSON(http.StatusOK, posts)
}

// GetPostByID retrieves a single post by its ID.
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

// CreatePost creates a new post.
func (h *PostHandler) CreatePost(c *gin.Context) {
	var newPost models.Post
	if err := c.ShouldBindJSON(&newPost); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Insert the new post into the database
	insertID, err := models.CreatePost(h.DB, &newPost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create post"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Post created successfully", "id": insertID})
}

func (h *PostHandler) UpdatePost(c *gin.Context) {
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

	// Update the post in the database
	_, err = models.UpdatePost(h.DB, id, &updatedPost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update post"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Post updated successfully"})
}

func (h *PostHandler) DeletePost(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	// Delete the post from the database
	err = models.DeletePost(h.DB, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete post"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Post deleted successfully"})
}

// increment the rating by one for the post with the given ID
func (h *PostHandler) RatePost(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	// Get the current rating of the post
	post, err := models.GetPostByID(h.DB, id)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get post"})
		return
	}

	// Increment the rating by one
	err = models.RatePost(h.DB, id, post.Rating+1)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to rate post"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Post rated successfully"})
}
