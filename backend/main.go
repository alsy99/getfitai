package main

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"
)

const (
	OllamaURL    = "http://localhost:11434/api/chat"
	OllamaModel  = "deepseek-r1:1.5b" // Change to your preferred local model name
	SystemPrompt = "You are an expert fitness coach. Your goal is to create personalized, safe, and effective workout plans based on user input. Provide structured, clear, and actionable workout routines. Include warm-up, main workout (exercises, sets, reps, rest), and cool-down. Emphasize proper form for safety. If an exercise requires equipment the user doesn't have, suggest an alternative. Do not give medical advice. Keep workouts concise and easy to follow."
)

type UserPreferences struct {
	FitnessGoal        string `json:"fitness_goal"`
	ExperienceLevel    string `json:"experience_level"`
	WorkoutsPerWeek    string `json:"workouts_per_week"`
	TimePerWorkout     string `json:"time_per_workout"`
	AvailableEquipment string `json:"available_equipment"`
	PreferredDays      string `json:"preferred_days"`
	Limitations        string `json:"limitations"`
}

type OllamaMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type OllamaPayload struct {
	Model    string          `json:"model"`
	Messages []OllamaMessage `json:"messages"`
}

type WorkoutResponse struct {
	Plan  string `json:"plan"`
	Error string `json:"error,omitempty"`
}

func generateUserPrompt(prefs UserPreferences) string {
	return "I want a workout plan for " + prefs.FitnessGoal + ". " +
		"I am a " + prefs.ExperienceLevel + " and can workout " + prefs.WorkoutsPerWeek + " times a week " +
		"for " + prefs.TimePerWorkout + " each session. " +
		"I have " + prefs.AvailableEquipment + " available. " +
		"I prefer to workout on " + prefs.PreferredDays + ". " +
		"I have the following limitations: " + prefs.Limitations + ". " +
		"Please provide a detailed weekly plan with specific exercises, sets, reps, and rest times for each workout day."
}

func generateWorkoutPlan(prefs UserPreferences) (string, error) {
	userPrompt := generateUserPrompt(prefs)
	payload := OllamaPayload{
		Model: OllamaModel,
		Messages: []OllamaMessage{
			{Role: "system", Content: SystemPrompt},
			{Role: "user", Content: userPrompt},
		},
	}
	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}

	client := &http.Client{Timeout: 120 * time.Second}
	req, err := http.NewRequest("POST", OllamaURL, io.NopCloser(bytes.NewReader(jsonPayload)))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", err
	}

	var fullContent string
	dec := json.NewDecoder(resp.Body)
	for {
		var m map[string]interface{}
		if err := dec.Decode(&m); err != nil {
			break
		}
		if msg, ok := m["message"].(map[string]interface{}); ok {
			if content, ok := msg["content"].(string); ok {
				fullContent += content
			}
		} else if content, ok := m["content"].(string); ok {
			fullContent += content
		}
	}
	if fullContent == "" {
		return "Error: No response content from Ollama.", nil
	}
	return fullContent, nil
}

func cleanAIResponse(raw string) string {
	// Remove <think>...</think> blocks
	re := regexp.MustCompile(`(?s)<think>.*?</think>\s*`)
	cleaned := re.ReplaceAllString(raw, "")

	// Fix markdown headers (ensure a space after #)
	cleaned = strings.ReplaceAll(cleaned, "###", "\n### ")
	cleaned = strings.ReplaceAll(cleaned, "####", "\n#### ")
	cleaned = strings.ReplaceAll(cleaned, "**", "")     // Remove bold for plain text
	cleaned = strings.ReplaceAll(cleaned, "  \n", "\n") // Remove double spaces before newlines
	cleaned = strings.TrimSpace(cleaned)
	return cleaned
}

func handleGenerateWorkout(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	var prefs UserPreferences
	if err := json.NewDecoder(r.Body).Decode(&prefs); err != nil {
		json.NewEncoder(w).Encode(WorkoutResponse{Error: "Invalid input"})
		return
	}
	plan, err := generateWorkoutPlan(prefs)
	if err != nil {
		json.NewEncoder(w).Encode(WorkoutResponse{Error: err.Error()})
		return
	}
	cleanedPlan := cleanAIResponse(plan)
	json.NewEncoder(w).Encode(WorkoutResponse{Plan: cleanedPlan})
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	http.HandleFunc("/api/generate-workout", handleGenerateWorkout)
	log.Printf("Go backend running on http://localhost:%s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
