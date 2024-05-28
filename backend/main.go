package main

import (
	"fmt"
	"log"

	"micr0.dev/backend/handlers"
	"micr0.dev/backend/models"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db, err := sqlx.Connect("sqlite3", "./posts.db")
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}
	defer db.Close()

	gin.SetMode(gin.ReleaseMode)

	models.InitializeDatabase(db)

	router := gin.Default()

	postsHandler := handlers.NewPostHandler(db)
	router.GET("/posts", postsHandler.GetPosts)
	router.GET("/posts/:id", postsHandler.GetPostByID)
	router.POST("/posts", postsHandler.CreatePost)
	router.PUT("/posts/:id", postsHandler.UpdatePost)
	router.DELETE("/posts/:id", postsHandler.DeletePost)
	router.POST("/posts/:id/rate", postsHandler.RatePost)

	router.Static("/static", "./static")

	fmt.Println("Go server listening on port 8081")
	log.Fatal(router.Run(":8081"))
}
