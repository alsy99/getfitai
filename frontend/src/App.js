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
                "http://localhost:8080/api/generate-workout",
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
                            <input
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
                            />
                        </label>
                        <label>
                            <span style={{ fontWeight: 500 }}>
                                Experience Level:
                            </span>
                            <input
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
                            />
                        </label>
                        <label>
                            <span style={{ fontWeight: 500 }}>
                                Workouts Per Week:
                            </span>
                            <input
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
                            />
                        </label>
                        <label>
                            <span style={{ fontWeight: 500 }}>
                                Time Per Workout:
                            </span>
                            <input
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
                            />
                        </label>
                        <label>
                            <span style={{ fontWeight: 500 }}>
                                Available Equipment:
                            </span>
                            <input
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
                            />
                        </label>
                        <label>
                            <span style={{ fontWeight: 500 }}>
                                Preferred Days:
                            </span>
                            <input
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
                            />
                        </label>
                        <label>
                            <span style={{ fontWeight: 500 }}>
                                Limitations or Injuries:
                            </span>
                            <input
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
                            />
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
