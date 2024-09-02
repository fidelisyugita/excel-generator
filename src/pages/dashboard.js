import { useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import styles from '../styles/Dashboard.module.css';

function Dashboard() {
  const { data: session } = useSession();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDownload = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        'https://fidel.com/search',
        { startDate, endDate },
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
      );

      const jsonData = response.data;
      const worksheet = XLSX.utils.json_to_sheet(jsonData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'report.xlsx');
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating the Excel file:', error);
      alert('An error occurred while generating the Excel file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome, {session?.user.email}</h1>
      <form onSubmit={handleDownload} className={styles.form}>
        <label className={styles.label}>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>
    </div>
  );
}

export default Dashboard;
