// "use client"; // 👈 Ajoute cette ligne en haut

// import { useState } from "react";

// const jobs = [
//   { company: "Ashford", title: "Lead QA", category: "Software", salary: "$800+" },
//   { company: "Tesla", title: "System Engineer", category: "Engineering", salary: "$1000+" },
// ];

// export default function JobList() {
//   const [selectedCategory, setSelectedCategory] = useState("");

//   const filteredJobs = selectedCategory
//     ? jobs.filter((job) => job.category === selectedCategory)
//     : jobs;

//   return (
//     <section className="py-10">
//       <h2 className="text-center text-3xl font-bold text-gray-800">Jobs of the day</h2>

//       <select className="mt-4 p-2 border rounded" onChange={(e) => setSelectedCategory(e.target.value)}>
//         <option value="">All Categories</option>
//         <option value="Software">Software</option>
//         <option value="Engineering">Engineering</option>
//       </select>

//       <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//         {filteredJobs.map((job, index) => (
//           <div key={index} className="p-4 border rounded-lg shadow-md">
//             <h3 className="text-xl font-bold">{job.company}</h3>
//             <p className="text-gray-600">{job.title}</p>
//             <p className="text-blue-500">{job.salary}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
"use client";

const jobs = [
  { company: "Ashford", title: "Lead QA", category: "Software", salary: "$800+" },
  { company: "Tesla", title: "System Engineer", category: "Engineering", salary: "$1000+" },
];

export default function JobList() {
  return (
    <section className="py-10">
      <h2 className="text-center text-3xl font-bold text-gray-800">Jobs of the day</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {jobs.map((job, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-md bg-white">
            <h3 className="text-xl font-bold">{job.company}</h3>
            <p className="text-gray-600">{job.title}</p>
            <p className="text-blue-500">{job.salary}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
