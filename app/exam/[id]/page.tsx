"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";  // import to get user session

type Choice = { letter: string; text: string };

type Question = {
  _id?: string;
  type: "choice" | "text";
  questionText: string;
  choices: Choice[];
  correctAnswer?: string;
};

export default function ExamPage() {
  const { id } = useParams(); // jobId
  const { data: session } = useSession(); // get user session here
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [evaluation, setEvaluation] = useState<
    { questionId: string; isCorrect: boolean; correctAnswer?: string }[]
  >([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`/api/quiz/questions/${id}`)
      .then((res) => {
        setQuestions(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load questions", err);
        alert("Failed to load questions");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitAnswers = async () => {
    if (submitted) return; // prevent resubmission
    if (!session?.user?.id) {
      alert("You must be logged in to submit.");
      return;
    }
    try {
      let correctCount = 0;
      const evalList = [];

      for (const q of questions) {
        const userAnswer = answers[q._id || ""];
        if (userAnswer) {
          await axios.post("/api/quiz/answers", {
            questionId: q._id,
            userAnswer,
          });

          const isCorrect =
            userAnswer.trim().toLowerCase() ===
            (q.correctAnswer || "").trim().toLowerCase();

          if (isCorrect) correctCount++;

          evalList.push({
            questionId: q._id || "",
            isCorrect,
            correctAnswer: q.correctAnswer,
          });
        }
      }
 const averagePercentScore = (correctCount / questions.length) * 100;
      setScore(correctCount);
      setEvaluation(evalList);
      setSubmitted(true);

      // Now save the exam attempt to backend
      await axios.post("/api/quiz/attempt", {
        userId: session.user.id,
        jobId: id,
        score: averagePercentScore,
      });

      alert(`✅ Submitted! You got ${correctCount} out of ${questions.length} correct.`);
    } catch (err) {
      console.error("Submit failed", err);
      alert("Failed to submit answers");
    }
  };

  const averageScore = score !== null ? (score / questions.length) * 100 : null;

  if (loading) return <p>Loading questions...</p>;
  if (questions.length === 0) return <p>No questions found for this quiz.</p>;

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h2>Exam for Job ID: {id}</h2>

      {!submitted && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitAnswers();
          }}
        >
          {questions.map((q, idx) => (
            <div
              key={q._id}
              style={{
                marginBottom: 20,
                padding: 15,
                border: "1px solid #ccc",
                borderRadius: 8,
                background: "#fafafa",
              }}
            >
              <p>
                <strong>
                  {idx + 1}. {q.questionText}
                </strong>
              </p>

              {q.type === "choice" &&
                q.choices?.map((choice) => (
                  <label
                    key={choice.letter}
                    style={{ display: "block", marginTop: 6, cursor: "pointer" }}
                  >
                    <input
                      type="radio"
                      name={q._id}
                      value={choice.letter}
                      checked={answers[q._id || ""] === choice.letter}
                      onChange={(e) => handleAnswerChange(q._id || "", e.target.value)}
                      style={{ marginRight: 8 }}
                    />
                    {choice.letter}. {choice.text}
                  </label>
                ))}

              {q.type === "text" && (
                <textarea
                  placeholder="Your answer..."
                  className="border p-2 rounded-lg w-full mt-2"
                  rows={2}
                  value={answers[q._id || ""] || ""}
                  onChange={(e) => handleAnswerChange(q._id || "", e.target.value)}
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            style={{
              backgroundColor: "#16a34a",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            Submit Answers
          </button>
        </form>
      )}

      {submitted && (
        <div
          style={{
            marginTop: 30,
            padding: 20,
            backgroundColor: "#e0f2fe",
            borderRadius: 8,
            border: "1px solid #38bdf8",
          }}
        >
          <h3>
            🎉 You scored {score} out of {questions.length} ({averageScore?.toFixed(2)}%)
          </h3>

          <ul style={{ marginTop: 15 }}>
            {evaluation.map(({ questionId, isCorrect, correctAnswer }) => {
              const question = questions.find((q) => q._id === questionId);
              return (
                <li key={questionId} style={{ marginBottom: 12 }}>
                  <strong>{question?.questionText}</strong> —{" "}
                  {isCorrect ? (
                    <span style={{ color: "green" }}>Correct</span>
                  ) : (
                    <span style={{ color: "red" }}>
                      Wrong (Correct: {correctAnswer || "N/A"})
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
