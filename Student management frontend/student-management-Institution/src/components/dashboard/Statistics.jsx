import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";
import Calendar from "../common/Calender";
import Card from "../common/Card";

function Statistics() {
  const [cards, setCards] = useState([
    { icon: "/public/student.svg", label: "Total Students", total: 0, percentage: "0%" },
    { icon: "/public/teacher.svg", label: "Total Teachers", total: 0, percentage: "0%" },
    { icon: "/public/staff.svg", label: "Total Staffs", total: 0, percentage: "0%" },
    { icon: "/public/subject.svg", label: "Total Subjects", total: 30, percentage: "0%" },
  ]);

  const [bookData, setBookData] = useState([]);
  const [lineData, setLineData] = useState([]);

  const updateCardData = (label, total, active) => {
    setCards((prev) =>
      prev.map((card) =>
        card.label === label
          ? {
              ...card,
              total,
              percentage: total > 0 ? `${((active / total) * 100).toFixed(1)}%` : "0%",
            }
          : card
      )
    );
  };

  const fetchData = async (url, label) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(url, {
        headers: { Authorization: `Token ${token}` },
      });
      const data = res.data;
      const total = data.length;
      const active = data.filter((item) => item.is_active).length;
      updateCardData(label, total, active);
      return { label, total, active };
    } catch (error) {
      console.error(`Error fetching ${label}:`, error);
      return { label, total: 0, active: 0 };
    }
  };

  useEffect(() => {
    async function loadData() {
      const student = await fetchData("http://127.0.0.1:8000/collegeapp/students/", "Total Students");
      const teacher = await fetchData("http://127.0.0.1:8000/collegeapp/faculties/", "Total Teachers");
      const staff = await fetchData("http://127.0.0.1:8000/collegeapp/coordinators/", "Total Staffs");

      setLineData([
        { name: "Active", Students: student.active, Teachers: teacher.active, Staffs: staff.active },
        { name: "Total", Students: student.total, Teachers: teacher.total, Staffs: staff.total },
      ]);
    }

    loadData();

    // Fetch books
    const token = localStorage.getItem("token");
    axios
      .get("http://127.0.0.1:8000/collegeapp/books/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        const grouped = res.data.reduce((acc, book) => {
          const category = book.category || "Others";
          acc[category] = (acc[category] || 0) + (book.quantity || 0);

          return acc;
        }, {});

        const chartData = Object.keys(grouped).map((key) => ({
          category: key,
          count: grouped[key],
        }));

        setBookData(chartData);
      })
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen text-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center">📊 Dashboard Overview</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-md p-4 border border-gray-200">
            <Card
              icon={card.icon}
              label={card.label}
              total={card.total}
              percentage={card.percentage}
              textColor="text-gray-900"
            />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <h2 className="text-xl font-bold mb-4">📈 Students / Teachers / Staff Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis dataKey="name" stroke="#333" />
              <YAxis stroke="#333" />
              <Tooltip contentStyle={{ backgroundColor: "#f9f9f9", border: "1px solid #ddd" }} />
              <Legend />
              <Line type="monotone" dataKey="Students" stroke="#2563eb" strokeWidth={2} />
              <Line type="monotone" dataKey="Teachers" stroke="#d946ef" strokeWidth={2} />
              <Line type="monotone" dataKey="Staffs" stroke="#059669" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Book Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <h2 className="text-xl font-bold mb-4">📚 Books by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis dataKey="category" stroke="#333" />
              <YAxis stroke="#333" />
              <Tooltip contentStyle={{ backgroundColor: "#f9f9f9", border: "1px solid #ddd" }} />
              <Legend />
              <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Calendar */}
      <div className="mt-6 bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-xl font-bold mb-4">📅 Calendar</h2>
        <Calendar onDateSelect={(date) => console.log("Selected Date:", date)} />
      </div>
    </div>
  );
}

export default Statistics;









// import React from 'react'
// import Card from '../common/Card'
// import Calendar from '../common/Calender'
// import DonutChart from '../common/DonutChart'

// function Statistics() {
//   const cards = [
//     {
//       icon: '/public/student.svg',
//       label: 'total students',
//       total: 3654,
//       percentage: '1.2%',
//       active: 3643,
//       inactive: 11
//     },
//     {
//       icon: '/public/teacher.svg',
//       label: 'total teachers',
//       total: 123,
//       percentage: '0.5%',
//       active: 120,
//       inactive: 3
//     },
//     {
//       icon: '/public/staff.svg',
//       label: 'total staffs',
//       total: 56,
//       percentage: '0.8%',
//       active: 54,
//       inactive: 2
//     },
//     {
//       icon: '/public/subject.svg',
//       label: 'total subjects',
//       total: 30,
//       percentage: '0%',
//       active: 30,
//       inactive: 0
//     }
//   ];

//   const handleDateSelect = (date) => {
//     console.log("Selected Date:", date);
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-6">
//       {cards.map((card, idx) => {
//         const chartData = [
//           { label: 'Active', value: card.active },
//           { label: 'Inactive', value: card.inactive },
//         ];

//         return (
//           <div key={idx} className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center">
//             {/* Top section with text info */}
//             <div className="w-full mb-4">
//               <Card
//                 icon={card.icon}
//                 label={card.label}
//                 total={card.total}
//                 percentage={card.percentage}
//                 active={card.active}
//                 inactive={card.inactive}
//               />
//             </div>

//             {/* Donut Chart */}
//             <div className="relative w-full flex justify-center">
//               <DonutChart data={chartData} centerLabel={`${card.active}/${card.total}`} />
//             </div>
//           </div>
//         );
//       })}

//       {/* Calendar */}
//       <div className="col-span-1 md:col-span-2 lg:col-span-1">
//         <Calendar onDateSelect={handleDateSelect} />
//       </div>
//     </div>
//   );
// }

// export default Statistics;


// import React, { useState } from 'react';
// import Calendar from '../common/Calender';
// import DonutChart from '../common/DonutChart';

// function Statistics() {
//   const cards = [
//     {
//       label: 'Students',
//       total: 3654,
//       active: 3643,
//       inactive: 11,
//     },
//     {
//       label: 'Teachers',
//       total: 123,
//       active: 120,
//       inactive: 3,
//     },
//     {
//       label: 'Staffs',
//       total: 56,
//       active: 54,
//       inactive: 2,
//     },
//     {
//       label: 'Subjects',
//       total: 30,
//       active: 30,
//       inactive: 0,
//     },
//   ];

//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const selected = cards[selectedIndex];

//   const chartData = [
//     { label: 'Active', value: selected.active },
//     { label: 'Inactive', value: selected.inactive },
//   ];

//   const handleDateSelect = (date) => {
//     console.log("Selected Date:", date);
//   };

//   return (
//     <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//       {/* Donut Chart Section */}
//       <div className="bg-white rounded-2xl shadow-md p-6 relative">
//         <h2 className="text-xl font-semibold mb-4 text-center">{selected.label}</h2>
//         <DonutChart data={chartData} centerLabel={`${selected.active}/${selected.total}`} />

//         {/* Button Group */}
//         <div className="mt-6 flex flex-wrap justify-center gap-3">
//           {cards.map((item, idx) => (
//             <button
//               key={idx}
//               onClick={() => setSelectedIndex(idx)}
//               className={`px-4 py-2 rounded-full border text-sm font-medium ${
//                 idx === selectedIndex
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
//               }`}
//             >
//               {item.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Calendar Section */}
//       <div>
//         <Calendar onDateSelect={handleDateSelect} />
//       </div>
//     </div>
//   );
// }

// export default Statistics;



// import React, { useState } from 'react';
// import DonutChart from '../common/DonutChart';
// import Calendar from '../common/Calender';
// import Card from '../common/Card';

// function Statistics() {
//   const cards = [
//     {
//       icon: '/public/student.svg',
//       label: 'Students',
//       total: 3654,
//       percentage: '1.2%',
//       active: 3643,
//       inactive: 11
//     },
//     {
//       icon: '/public/teacher.svg',
//       label: 'Teachers',
//       total: 123,
//       percentage: '0.5%',
//       active: 120,
//       inactive: 3
//     },
//     {
//       icon: '/public/staff.svg',
//       label: 'Staffs',
//       total: 56,
//       percentage: '0.8%',
//       active: 54,
//       inactive: 2
//     },
//     {
//       icon: '/public/subject.svg',
//       label: 'Subjects',
//       total: 30,
//       percentage: '0%',
//       active: 30,
//       inactive: 0
//     }
//   ];

//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const selectedCard = cards[selectedIndex];

//   const chartData = [
//     { label: 'Active', value: selectedCard.active },
//     { label: 'Inactive', value: selectedCard.inactive },
//   ];

//   const handleSliceClick = (entry) => {
//     alert(`${entry.label} clicked!\nCount: ${entry.value}`);
//   };

//   const handleDateSelect = (date) => {
//     console.log("Selected Date:", date);
//   };

//   return (
//     <div className="p-6 grid grid-cols-1 gap-6">
//       {/* Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {cards.map((card, idx) => (
//           <div
//             key={idx}
//             onClick={() => setSelectedIndex(idx)}
//             className={`cursor-pointer transition-transform duration-200 transform ${
//               idx === selectedIndex ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'
//             }`}
//           >
//             <Card
//               icon={card.icon}
//               label={card.label}
//               total={card.total}
//               percentage={card.percentage}
//               active={card.active}
//               inactive={card.inactive}
//             />
//           </div>
//         ))}
//       </div>

//       {/* Donut Chart */}
//       <div className="bg-white rounded-2xl shadow-md p-6 relative">
//         <h2 className="text-xl font-semibold mb-4 text-center text-blue-600">
//           {selectedCard.label} Overview
//         </h2>
//         <DonutChart
//           data={chartData}
//           centerLabel={`${selectedCard.active}/${selectedCard.total}`}
//           onSliceClick={handleSliceClick}
//         />
//       </div>

//       {/* Calendar */}
//       <div className="bg-white rounded-2xl shadow-md p-4">
//         <Calendar onDateSelect={handleDateSelect} />
//       </div>
//     </div>
//   );
// }

// export default Statistics;


// import React, { useState } from 'react';
// import Calendar from '../common/Calender';
// import DonutChart from '../common/DonutChart';
// import Card from '../common/Card'; // Make sure you already created this

// function Statistics() {
//   const cards = [
//     {
//       icon: '/public/student.svg',
//       label: 'Students',
//       total: 3654,
//       active: 3643,
//       inactive: 11,
//       percentage: '1.2%',
//     },
//     {
//       icon: '/public/teacher.svg',
//       label: 'Teachers',
//       total: 123,
//       active: 120,
//       inactive: 3,
//       percentage: '0.5%',
//     },
//     {
//       icon: '/public/staff.svg',
//       label: 'Staffs',
//       total: 56,
//       active: 54,
//       inactive: 2,
//       percentage: '0.8%',
//     },
//     {
//       icon: '/public/subject.svg',
//       label: 'Subjects',
//       total: 30,
//       active: 30,
//       inactive: 0,
//       percentage: '0%',
//     },
//   ];

//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const selected = cards[selectedIndex];

//   const chartData = [
//     { label: 'Active', value: selected.active },
//     { label: 'Inactive', value: selected.inactive },
//   ];

//   const handleSliceClick = (entry) => {
//     alert(`${entry.label} clicked: ${entry.value}`);
//   };

//   const handleDateSelect = (date) => {
//     console.log("Selected Date:", date);
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* Card Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {cards.map((card, idx) => (
//           <div
//             key={idx}
//             onClick={() => setSelectedIndex(idx)}
//             className={`cursor-pointer transition-transform duration-200 transform ${
//               idx === selectedIndex ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'
//             }`}
//           >
//             <Card
//               icon={card.icon}
//               label={card.label}
//               total={card.total}
//               percentage={card.percentage}
//               active={card.active}
//               inactive={card.inactive}
//             />
//           </div>
//         ))}
//       </div>

//       {/* Chart + Calendar Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Donut Chart */}
//         <div className="bg-white rounded-2xl shadow-md p-6">
//           <h2 className="text-xl font-semibold mb-4 text-center text-blue-600">
//             {selected.label} Overview
//           </h2>
//           <DonutChart
//             data={chartData}
//             centerLabel={`${selected.active}/${selected.total}`}
//             onSliceClick={handleSliceClick}
//           />
//         </div>

//         {/* Calendar */}
//         <div className="bg-white rounded-2xl shadow-md p-4">
//           <Calendar onDateSelect={handleDateSelect} />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Statistics;
