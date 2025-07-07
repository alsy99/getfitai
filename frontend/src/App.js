import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

function App() {
    const [form, setForm] = useState({
        fitness_goal: "",
        experience_level: "",
        workouts_per_week: "",
        time_per_workout: "",
        available_equipment: "",
        preferred_days: "",
        limitations: "",
    });
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPlan("");
        setError("");
        try {
            const res = await fetch(
                "https://2d0e-49-207-227-12.ngrok-free.app/api/generate-workout",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                }
            );
            const data = await res.json();
            if (data.plan) setPlan(data.plan);
            else setError(data.error || "Unknown error");
        } catch (err) {
            setError("Failed to connect to backend.");
        }
        setLoading(false);
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f6f8fa",
                padding: 0,
                margin: 0,
            }}
        >
            <div
                style={{
                    maxWidth: 600,
                    margin: "40px auto",
                    fontFamily: "Inter, Arial, sans-serif",
                    background: "#fff",
                    borderRadius: 12,
                    boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                    padding: 32,
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: 32,
                        color: "#222",
                    }}
                >
                    <span role="img" aria-label="dumbbell">
                        🏋️‍♂️
                    </span>{" "}
                    AI Fitness Workout Planner
                </h2>
                <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
                    <div style={{ display: "grid", gap: 18 }}>
                        <label>
                            <span style={{ fontWeight: 500 }}>
                                Primary Fitness Goal:
                            </span>
                            <select
                                name="fitness_goal"
                                value={form.fitness_goal}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: 8,
                                    marginTop: 4,
                                    borderRadius: 6,
                                    border: "1px solid #ccc",
                                }}
                            >
                                <option value="">Select a goal</option>
                                <option value="weight_loss">Weight Loss</option>
                                <option value="muscle_gain">Muscle Gain</option>
                                <option value="improve_cardio">Improve Cardio</option>
                                <option value="increase_strength">Increase Strength</option>
                                <option value="improve_flexibility">Improve Flexibility</option>
                                <option value="other">Other (please specify)</option>
                            </select>
                        </label>
                        <label>
                            <span style={{ fontWeight: 500 }}>
                                Experience Level:
                            </span>
                            <select
                                name="experience_level"
                                value={form.experience_level}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: 8,
                                    marginTop: 4,
                                    borderRadius: 6,
                                    border: "1px solid #ccc",
                                }}
                            >
                                <option value="">Select experience level</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </label>
                        <label>
                            <span style={{ fontWeight: 500 }}>
                                Workouts Per Week:
                            </span>
                            <select
                                name="workouts_per_week"
                                value={form.workouts_per_week}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: 8,
                                    marginTop: 4,
                                    borderRadius: 6,
                                    border: "1px solid #ccc",
                                }}
                            >
                                <option value="">Select frequency</option>
                                <option value="1-2">1-2 times</option>
                                <option value="3-4">3-4 times</option>
                                <option value="5-6">5-6 times</option>
                                <option value="7">7 times</option>
                            </select>
                        </label>
                        <label>
                            <span style={{ fontWeight: 500 }}>
                                Time Per Workout:
                            </span>
                            <select
                                name="time_per_workout"
                                value={form.time_per_workout}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: 8,
                                    marginTop: 4,
                                    borderRadius: 6,
                                    border: "1px solid #ccc",
                                }}
                            >
                                <option value="">Select duration</option>
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="45">45 minutes</option>
                                <option value="60">60 minutes</option>
                            </select>
                        </label>
                        <label>
                            <span style={{ fontWeight: 500 }}>
                                Available Equipment:
                            </span>
                            <select
                                name="available_equipment"
                                value={form.available_equipment}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: 8,
                                    marginTop: 4,
                                    borderRadius: 6,
                                    border: "1px solid #ccc",
                                }}
                            >
                                <option value="">Select equipment</option>
                                <option value="none">None</option>
                                <option value="dumbbells">Dumbbells</option>
                                <option value="resistance_bands">Resistance Bands</option>
                                <option value="treadmill">Treadmill</option>
                                <option value="full_gym">Full Gym</option>
                            </select>
                        </label>
                        <label>
                            <span style={{ fontWeight: 500 }}>
                                Preferred Days:
                            </span>
                            <select
                                name="preferred_days"
                                value={form.preferred_days}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: 8,
                                    marginTop: 4,
                                    borderRadius: 6,
                                    border: "1px solid #ccc",
                                }}
                            >
                                <option value="">Select days</option>
                                <option value="weekdays">Weekdays</option>
                                <option value="weekends">Weekends</option>
                                <option value="flexible">Flexible</option>
                            </select>
                        </label>
                        <label>
                            <span style={{ fontWeight: 500 }}>
                                Limitations or Injuries:
                            </span>
                            <select
                                name="limitations"
                                value={form.limitations}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: 8,
                                    marginTop: 4,
                                    borderRadius: 6,
                                    border: "1px solid #ccc",
                                }}
                            >
                                <option value="">Select limitation</option>
                                <option value="none">None</option>
                                <option value="back_pain">Back Pain</option>
                                <option value="knee_pain">Knee Pain</option>
                                <option value="shoulder_injury">Shoulder Injury</option>
                                <option value="other">Other (please specify)</option>
                            </select>
                        </label>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                background: "#2563eb",
                                color: "#fff",
                                border: "none",
                                borderRadius: 6,
                                padding: "12px 0",
                                fontWeight: 600,
                                fontSize: 16,
                                cursor: loading ? "not-allowed" : "pointer",
                                marginTop: 8,
                                transition: "background 0.2s",
                            }}
                        >
                            {loading ? "Generating..." : "Generate Plan"}
                        </button>
                    </div>
                </form>
                {plan && (
                    <div style={{ marginTop: 30 }}>
                        <h3
                            style={{
                                color: "#222",
                                borderBottom: "1px solid #eee",
                                paddingBottom: 8,
                            }}
                        >
                            Your Personalized Workout Plan
                        </h3>
                        <div
                            style={{
                                background: "#f4f4f4",
                                padding: 20,
                                borderRadius: 8,
                                fontSize: 16,
                                lineHeight: 1.7,
                                overflowX: "auto",
                            }}
                        >
                            <ReactMarkdown>{plan}</ReactMarkdown>
                        </div>
                    </div>
                )}
                {error && (
                    <div
                        style={{
                            color: "#e11d48",
                            marginTop: 20,
                            textAlign: "center",
                        }}
                    >
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
