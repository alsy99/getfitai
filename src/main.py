import requests
import json

SYSTEM_PROMPT = (
    "You are an expert fitness coach. Your goal is to create personalized, safe, and effective workout plans based on user input. "
    "Provide structured, clear, and actionable workout routines. Include warm-up, main workout (exercises, sets, reps, rest), and cool-down. "
    "Emphasize proper form for safety. If an exercise requires equipment the user doesn't have, suggest an alternative. "
    "Do not give medical advice. Keep workouts concise and easy to follow."
)

OLLAMA_URL = "http://localhost:11434/api/chat"
OLLAMA_MODEL = "deepseek-r1:1.5b"  # Change to your preferred local model name

class WorkoutPlanner:
    def __init__(self):
        pass  # No API key needed for local Ollama

    def get_user_input(self):
        """Get detailed user preferences for workout planning."""
        print("\nWelcome to AI Fitness Workout Planner!")
        print("-------------------------------------")

        fitness_goal = input("\nWhat is your primary fitness goal? (e.g., weight loss, muscle gain, endurance): ")
        experience_level = input("What is your experience level? (beginner, intermediate, advanced): ")
        workouts_per_week = input("How many times per week can you work out?: ")
        time_per_workout = input("How much time do you have for each workout session? (e.g., 30 minutes): ")
        available_equipment = input("What equipment do you have available? (e.g., dumbbells, resistance bands, none): ")
        preferred_days = input("Which days do you prefer to work out? (e.g., Monday, Wednesday, Friday): ")
        limitations = input("Do you have any limitations or injuries? (type 'none' if not): ")

        return {
            "fitness_goal": fitness_goal,
            "experience_level": experience_level,
            "workouts_per_week": workouts_per_week,
            "time_per_workout": time_per_workout,
            "available_equipment": available_equipment,
            "preferred_days": preferred_days,
            "limitations": limitations
        }

    def generate_workout_plan(self, user_preferences):
        """Generate a personalized workout plan using local Ollama model."""
        user_prompt = (
            f"I want a workout plan for {user_preferences['fitness_goal']}. "
            f"I am a {user_preferences['experience_level']} and can workout {user_preferences['workouts_per_week']} times a week "
            f"for {user_preferences['time_per_workout']} each session. "
            f"I have {user_preferences['available_equipment']} available. "
            f"I prefer to workout on {user_preferences['preferred_days']}. "
            f"I have the following limitations: {user_preferences['limitations']}. "
            "Please provide a detailed weekly plan with specific exercises, sets, reps, and rest times for each workout day."
        )
        payload = {
            "model": OLLAMA_MODEL,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ]
        }
        try:
            response = requests.post(OLLAMA_URL, json=payload, timeout=120, stream=True)
            response.raise_for_status()
            full_content = ""
            for line in response.iter_lines():
                if line:
                    try:
                        data = json.loads(line.decode('utf-8'))
                        # Ollama streaming: content may be in 'message' or 'content'
                        if 'message' in data and 'content' in data['message']:
                            full_content += data['message']['content']
                        elif 'content' in data:
                            full_content += data['content']
                    except Exception:
                        continue
            if full_content:
                return full_content.strip()
            return "Error: No response content from Ollama."
        except requests.exceptions.RequestException as e:
            return f"Error connecting to Ollama server: {str(e)}"
        except Exception as e:
            return f"Error generating workout plan: {str(e)}"

def main():
    """Main function to run the workout planner."""
    planner = WorkoutPlanner()
    try:
        user_preferences = planner.get_user_input()
        print("\nGenerating your personalized workout plan...")
        workout_plan = planner.generate_workout_plan(user_preferences)
        print("\nYour Personalized Workout Plan:")
        print("===============================" )
        print(workout_plan)
    except Exception as e:
        print(f"\nAn error occurred: {str(e)}")
        print("Please make sure your Ollama server is running and accessible at http://localhost:11434.")

if __name__ == "__main__":
    main()
