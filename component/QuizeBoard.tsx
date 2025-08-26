"use client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import axios from "axios";

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

export default function QuizeBoard({ jobId }: { jobId: string }) {
  const {data:session} = useSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const employerId = session?.user?.id;

  const addQuestion = (type: "choice" | "text") => {
    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now(),
        type,
        questionText: "",
        selectedOption: "",
        answerText: "",
        choices:
          type === "choice"
            ? [
                { letter: "A", text: "" },
                { letter: "B", text: "" },
                { letter: "C", text: "" },
                { letter: "D", text: "" },
              ]
            : [],
      },
    ]);
  };

  const handleCancelQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleQuestionTextChange = (id: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, questionText: value } : q))
    );
  };

  const handleChoiceTextChange = (
    questionId: number,
    letter: string,
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: q.choices.map((c) =>
                c.letter === letter ? { ...c, text: value } : c
              ),
            }
          : q
      )
    );
  };

  const handleOptionChange = (id: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, selectedOption: value } : q))
    );
  };

  const handleAnswerTextChange = (id: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, answerText: value } : q))
    );
  };

  const handleSaveQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      for (const q of questions) {
        if (
          (q.type === "choice" && !q.selectedOption) ||
          (q.type === "text" && (q.answerText ?? "").trim() === "")
        ) {
          setError("❌ Correct answers for all questions must be provided");
          setSaving(false);
          return;
        }

        const payload =
          q.type === "choice"
            ? {
              jobId,
                questionText: q.questionText,
                type: "choice",
                choices: q.choices,
                correctAnswer: q.selectedOption,
              }
            : {
              jobId,
                questionText: q.questionText,
                type: "text",
                correctAnswer: q.answerText,
              };

        await fetch("/api/quiz/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        console.log("Saving question:", payload);
      }

      //To add notification
      /*await axios.post('api/quiz/addNotification',{
        jobId:jobId,
        employerId:employerId
      }, {
          withCredentials: true
        })*/

      alert("✅ Questions saved successfully!");
      setQuestions([]);

      setError("");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save questions");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-x-3">
        <button
          onClick={() => addQuestion("choice")}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Add Choice Question
        </button>
        <button
          onClick={() => addQuestion("text")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Add Text Question
        </button>
      </div>

      {questions.length > 0 && (
        <form onSubmit={handleSaveQuestions} className="space-y-6">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="p-4 border rounded-lg shadow-sm bg-gray-50 relative"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">
                  Question {index + 1} ({q.type})
                </h2>
                <button
                  type="button"
                  onClick={() => handleCancelQuestion(q.id!)}
                  className="text-red-600 hover:underline text-sm"
                >
                  ❌ Cancel
                </button>
              </div>

              <textarea
                value={q.questionText}
                onChange={(e) =>
                  handleQuestionTextChange(q.id as number, e.target.value)
                }
                placeholder="Write your question..."
                className="border rounded-lg p-2 w-full mb-3"
                rows={2}
              />

              {q.type === "choice" && (
                <div className="space-y-3 mb-3">
                  {q.choices.map((c) => (
                    <div key={c.letter} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`choice-${q.id}`}
                        value={c.letter}
                        checked={q.selectedOption === c.letter}
                        onChange={(e) =>
                          handleOptionChange(q.id as number, e.target.value)
                        }
                      />
                      <span className="font-bold">{c.letter}:</span>
                      <input
                        type="text"
                        value={c.text}
                        onChange={(e) =>
                          handleChoiceTextChange(
                            q.id as number,
                            c.letter,
                            e.target.value
                          )
                        }
                        placeholder={`Enter choice ${c.letter}`}
                        className="border p-2 rounded-lg flex-1"
                      />
                    </div>
                  ))}
                </div>
              )}

              {q.type === "text" && (
                <textarea
                  value={q.answerText}
                  onChange={(e) =>
                    handleAnswerTextChange(q.id as number, e.target.value)
                  }
                  placeholder="Correct Answer..."
                  className="border rounded-lg p-2 w-full"
                  rows={2}
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={saving}
            className={`px-4 py-2 rounded-lg text-white ${
              saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "Saving..." : "Save All"}
          </button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
      )}
    </div>
  );
}
