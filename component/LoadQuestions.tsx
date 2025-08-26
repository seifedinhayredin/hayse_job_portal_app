"use client";
import React, { useState } from "react";
import axios from "axios";
//import { ShowEmployeeJobsAppliedFor } from "./showEmployeeJobsAppliedFor";

type Choice = { letter: string; text: string };

type Question = {
  _id?: string;
  id?: number;
  type: "choice" | "text";
  questionText: string;
  selectedOption?: string;
  answerText?: string;
  choices: Choice[];
  correctAnswer?: string;
};

const LoadQuestions = ({ jobId }: { jobId: string }) => {
  const [savedQuestions, setSavedQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [evaluation, setEvaluation] = useState<
    { questionId: string; isCorrect: boolean; correctAnswer?: string }[]
  >([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Question>>({});

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quiz/questions?jobId=${jobId}`);
      const data = await res.json();
      setSavedQuestions(data);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const handleUserAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitAnswers = async () => {
    try {
      let correct = 0;
      const evalList: {
        questionId: string;
        isCorrect: boolean;
        correctAnswer?: string;
      }[] = [];

      for (const q of savedQuestions) {
        const userAnswer = answers[q._id || ""];
        if (userAnswer) {
          await fetch("/api/quiz/answers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questionId: q._id, userAnswer }),
          });

          const isCorrect =
            userAnswer.trim().toLowerCase() === (q.correctAnswer || "").trim().toLowerCase();

          if (isCorrect) correct++;

          evalList.push({
            questionId: q._id || "",
            isCorrect,
            correctAnswer: q.correctAnswer,
          });
        }
      }

      setScore(correct);
      setEvaluation(evalList);
      setSubmitted(true);
      alert(`✅ Submitted! You got ${correct} correct out of ${savedQuestions.length}.`);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit answers");
    }
  };

  const handleEditClick = (q: Question) => {
    setEditingQuestionId(q._id || null);
    setEditForm({ ...q });
  };

  const handleEditChange = (field: string, value: any) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleChoiceChange = (index: number, value: string) => {
    const newChoices = [...(editForm.choices || [])];
    newChoices[index].text = value;
    setEditForm((prev) => ({ ...prev, choices: newChoices }));
  };

  const handleSaveEdit = async () => {
    if (!editingQuestionId || !editForm) return;
    try {
      const res = await axios.patch(`/api/quiz/questions/${editingQuestionId}`, editForm);
      const updated = res.data;
      setSavedQuestions((prev) =>
        prev.map((q) => (q._id === updated._id ? updated : q))
      );
      setEditingQuestionId(null);
      alert("✅ Question updated!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update question");
    }
  };

  const handleDeleteQuestion = async (id: string | undefined) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      await axios.delete(`/api/quiz/questions/${id}`);
      setSavedQuestions((prev) => prev.filter((q) => q._id !== id));
      alert("🗑️ Question deleted");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete question");
    }
  };

  const averageScore = score !== null ? (score / savedQuestions.length) * 100 : null;

  return (
    <div>
      
      <div>
        <button
          onClick={loadQuestions}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-white ${
            loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Loading..." : "Load Questions"}
        </button>
      </div>

      {!submitted && savedQuestions.length > 0 && (
        <div className="space-y-4 mt-6">
          {savedQuestions.map((q, index) => (
            <div key={q._id} className="p-4 border rounded-lg bg-white">
              {editingQuestionId === q._id ? (
                <>
                  <input
                    className="w-full p-2 border rounded mb-2"
                    value={editForm.questionText || ""}
                    onChange={(e) => handleEditChange("questionText", e.target.value)}
                  />
                  {editForm.type === "choice" &&
                    editForm.choices?.map((c, i) => (
                      <div key={i} className="flex items-center mb-1">
                        <span className="mr-2">{c.letter}.</span>
                        <input
                          className="flex-1 p-1 border rounded"
                          value={c.text}
                          onChange={(e) => handleChoiceChange(i, e.target.value)}
                        />
                      </div>
                    ))}
                  {editForm.type === "text" && (
                    <textarea
                      className="w-full p-2 border rounded"
                      value={editForm.answerText || ""}
                      onChange={(e) => handleEditChange("answerText", e.target.value)}
                    />
                  )}
                  <input
                    className="mt-2 w-full p-1 border rounded"
                    placeholder="Correct Answer"
                    value={editForm.correctAnswer || ""}
                    onChange={(e) => handleEditChange("correctAnswer", e.target.value)}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      className="px-4 py-1 bg-green-600 text-white rounded"
                      onClick={handleSaveEdit}
                    >
                      Save
                    </button>
                    <button
                      className="px-4 py-1 bg-gray-400 text-white rounded"
                      onClick={() => setEditingQuestionId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-bold">
                    {index + 1}. {q.questionText}
                  </h3>
                  {q.type === "choice" ? (
                    <div className="mt-2 space-y-1">
                      {q.choices.map((c) => (
                        <label key={c.letter} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`answer-${q._id}`}
                            value={c.letter}
                            checked={answers[q._id || ""] === c.letter}
                            onChange={(e) => handleUserAnswer(q._id || "", e.target.value)}
                          />
                          {c.letter}. {c.text}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      value={answers[q._id || ""] || ""}
                      onChange={(e) => handleUserAnswer(q._id || "", e.target.value)}
                      placeholder="Your answer..."
                      className="border p-2 rounded-lg w-full mt-2"
                      rows={2}
                    />
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    Correct Answer: {q.correctAnswer}
                  </p>
                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={() => handleEditClick(q)}
                      className="text-blue-600 underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(q._id)}
                      className="text-red-600 underline"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          <button
            onClick={handleSubmitAnswers}
            className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 mt-4"
          >
            Submit Answers
          </button>
        </div>
      )}

      {submitted && (
        <div className="mt-6 p-4 bg-blue-100 border border-blue-400 rounded-lg text-blue-800">
          🎉 You scored <strong>{score}</strong> out of{" "}
          <strong>{savedQuestions.length}</strong>
          {averageScore !== null && <p>Score: {averageScore.toFixed(2)}%</p>}
        </div>
      )}
    </div>
  );
};

export default LoadQuestions;
