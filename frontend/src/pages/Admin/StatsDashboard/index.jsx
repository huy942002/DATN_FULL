// === Frontend ReactJS Code ===
// src/components/StatsDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import config from '../../../api/apiSevices';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

export default function StatsDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 29))
  );
  const [endDate, setEndDate] = useState(new Date());
  const token = localStorage.getItem('token');

  const fetchData = () => {
    setLoading(true);
    setError(null);
    const params = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      granularity: 'DAILY'
    };
    config
      .get('/stats/revenue', { params, headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setData(res.data))
      .catch(() => setError('Không lấy được dữ liệu'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Summary calculations
  const totalGross = data.reduce((sum, d) => sum + Number(d.totalRevenue), 0);
  const totalDiscount = data.reduce((sum, d) => sum + Number(d.totalDiscount), 0);
  const totalOrders = data.reduce((sum, d) => sum + d.totalOrders, 0);
  const totalCustomers = data.reduce((sum, d) => sum + d.totalCustomers, 0);

  // Chart setup: only gross and discount
  const chartData = {
    labels: data.map((d) => d.period),
    datasets: [
      {
        label: 'Doanh thu gộp',
        data: data.map((d) => d.totalRevenue),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      },
      {
        label: 'Tổng giảm giá',
        data: data.map((d) => d.totalDiscount),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
        barThickness: 5
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 12 } } },
      title: {
        display: true,
        text: `Thống kê doanh thu (từ ${startDate.toISOString().split('T')[0]} đến ${endDate.toISOString().split('T')[0]})`,        
        font: { size: 18 }
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}`
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Ngày', font: { size: 14 } },
        ticks: { maxRotation: 90, minRotation: 45, font: { size: 10 } }
      },
      y: {
        title: { display: true, text: 'VND', font: { size: 14 } },
        ticks: { callback: (val) => formatCurrency(val), font: { size: 10 } }
      }
    }
  };

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-extrabold text-indigo-600">Dashboard Doanh Thu</h1>
          <p className="mt-2 text-gray-600">Theo dõi chi tiết doanh thu hàng ngày</p>
        </header>

        <section className="flex flex-col md:flex-row items-center md:justify-between bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700">Từ ngày</label>
              <DatePicker
                selected={startDate}
                onChange={setStartDate}
                dateFormat="yyyy-MM-dd"
                className="mt-1 block w-full border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Đến ngày</label>
              <DatePicker
                selected={endDate}
                onChange={setEndDate}
                dateFormat="yyyy-MM-dd"
                className="mt-1 block w-full border-gray-300 rounded-md"
              />
            </div>
          </div>
          <button
            onClick={fetchData}
            className="mt-4 md:mt-0 bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Thống kê
          </button>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
            <span className="text-gray-500">Doanh thu gộp</span>
            <span className="mt-2 text-2xl font-bold text-indigo-600">{formatCurrency(totalGross)}</span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
            <span className="text-gray-500">Tổng giảm giá</span>
            <span className="mt-2 text-2xl font-bold text-red-600">{formatCurrency(totalDiscount)}</span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
            <span className="text-gray-500">Số đơn hàng</span>
            <span className="mt-2 text-2xl font-bold text-yellow-600">{totalOrders}</span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
            <span className="text-gray-500">Khách hàng</span>
            <span className="mt-2 text-2xl font-bold text-purple-600">{totalCustomers}</span>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow" style={{ height: '350px' }}>
          {loading ? (
            <p className="text-center text-gray-500 mt-24">Đang tải dữ liệu...</p>
          ) : error ? (
            <p className="text-center text-red-500 mt-24">{error}</p>
          ) : (
            <Bar data={chartData} options={options} />
          )}
        </section>
      </div>
    </div>
  );
}
