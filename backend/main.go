package main

import (
	"fmt"
	"log"

	"micr0.dev/backend/handlers"
	"micr0.dev/backend/models"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3" // SQLite driver
)

func main() {
	// Database setup
	db, err := sqlx.Connect("sqlite3", "./posts.db")
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}
	defer db.Close()

	// Initialize database tables (if they don't exist)
	models.InitializeDatabase(db)

	router := gin.Default()

	// API endpoints
	postsHandler := handlers.NewPostHandler(db) // Pass the database connection
	router.GET("/posts", postsHandler.GetPosts)
	router.GET("/posts/:id", postsHandler.GetPostByID)
	router.POST("/posts", postsHandler.CreatePost)
	router.PUT("/posts/:id", postsHandler.UpdatePost)
	router.DELETE("/posts/:id", postsHandler.DeletePost)

	// Serve static files (from the 'static' directory)
	router.Static("/static", "./static")

	// Run the Go server (on a different port than Apache)
	fmt.Println("Go server listening on port 8081")
	log.Fatal(router.Run(":8081"))
}
