'use client';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Jan', jobs: 20 },
  { month: 'Feb', jobs: 35 },
  { month: 'Mar', jobs: 40 },
  { month: 'Apr', jobs: 28 },
  { month: 'May', jobs: 50 },
  { month: 'Jun', jobs: 45 },
];

export default function JobAnalyticsGraph() {
  return (
    <div className="w-full max-w-4xl mx-auto my-8 bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold text-center mb-4">Job Postings Per Month</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="jobs" stroke="#2563eb" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
