# AI Fitness Workout Planner

A personalized AI-powered workout planner that generates customized workout routines based on your goals, available equipment, and time constraints.

## Features

-   Personalized workout plan generation based on:
    -   Fitness goals (weight loss, muscle gain, etc.)
    -   Available equipment
    -   Time constraints
-   Uses OpenAI's GPT API for intelligent workout planning
-   Simple command-line interface

## Setup

1. Clone this repository
2. Create a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use: venv\Scripts\activate
    ```
3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4. Create a `.env` file in the project root and add your OpenAI API key:
    ```
    OPENAI_API_KEY=your_api_key_here
    ```

## Usage

Run the application:

```bash
python src/main.py
```

Follow the prompts to:

1. Enter your fitness goals
2. Specify available equipment
3. Set your time constraints
4. Get your personalized workout plan

## License

MIT
