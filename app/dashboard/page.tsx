"use client";
import {useState } from "react";
import styles from "./dashboard.module.css"; // Style CSS
import Link from "next/link";

export default function Dashboard() {
  const [applications] = useState([]);
  
  

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <p className={styles.subtitle}>Here{" ' "}s an overview of your application status and opportunities</p>

        <div className={styles.jobApplications}>
          <h3>Your Applications</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application, index) => (
                <tr key={index}>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.opportunities}>
          <h3>New Opportunities</h3>
          <ul>
            <li><Link href="/job/1">Frontend Developer at Web Solutions</Link></li>
            <li><Link href="/job/2">Backend Developer at Code Masters</Link></li>
            <li><Link href="/job/3">Data Analyst at Data Insights</Link></li>
          </ul>
        </div>
        
        <div className={styles.profile}>
          <h3>Your Profile</h3>
          <Link href="/profile" className={styles.editProfile}>
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
