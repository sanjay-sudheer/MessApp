import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './viewMonthlyReport.css';

function ViewMonthlyReport() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [search, setSearch] = useState('');
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();

  const monthNames = ['','January','February','March','April','May','June',
    'July','August','September','October','November','December'];

  const fetchMonthlyReport = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('adminToken');
    if (!token) { navigate('/admin-login'); return; }
    try {
      const response = await fetch('https://messapp-ymg5.onrender.com/api/admin/monthly-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` },
        body: JSON.stringify({ month: parseInt(month), year: parseInt(year) }),
      });
      if (!response.ok) throw new Error('Failed to fetch the monthly report');
      const data = await response.json();
      setReportData(data.report);
      setSearch('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (month && year) fetchMonthlyReport();
    else setError('Please enter both month and year');
  };

  const MIN_PRESENTS = 10;
  const clampPresents = (v) => Math.max(MIN_PRESENTS, Number(v) || 0);

  const filteredData = reportData.filter((r) => {
    const q = search.toLowerCase();
    return r.name?.toLowerCase().includes(q) || r.admissionNumber?.toLowerCase().includes(q);
  });

  // ── Load script helper ──
  const loadScript = (src) => new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });

  // ── PDF Export — fully client-side via jsPDF (UMD from CDN) ──
  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js');

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();

      // Orange header bar
      doc.setFillColor(255, 85, 0);
      doc.rect(0, 0, pageW, 22, 'F');

      // White title text
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(255, 255, 255);
      doc.text('MESS ATTENDANCE — MONTHLY REPORT', 14, 14);

      // Period top-right
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`${monthNames[parseInt(month)].toUpperCase()} ${year}`, pageW - 14, 14, { align: 'right' });

      // Meta line
      doc.setFontSize(8);
      doc.setTextColor(150, 100, 50);
      const exportedAt = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
      const filterNote = search ? `  •  Filtered: "${search}"` : '';
      doc.text(`Exported: ${exportedAt}   •   ${filteredData.length} student(s)${filterNote}`, 14, 30);

      // Table
      doc.autoTable({
        startY: 35,
        head: [['Adm. No.', 'Name', 'Presents', 'Absences', 'Global Abs.', 'Normal Abs.', 'Month', 'Year']],
        body: filteredData.map(r => [
          r.admissionNumber, r.name,
          clampPresents(r.totalPresents), r.totalAbsences,
          r.globalAbsences, r.normalAbsences,
          r.month, r.year
        ]),
        headStyles: {
          fillColor: [255, 109, 46],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 8,
        },
        bodyStyles: { fontSize: 8.5, textColor: [26, 26, 26] },
        alternateRowStyles: { fillColor: [255, 250, 246] },
        columnStyles: {
          0: { fontStyle: 'bold', textColor: [255, 109, 46] },
          2: { fontStyle: 'bold', textColor: [22, 163, 74] },
          3: { fontStyle: 'bold', textColor: [220, 38, 38] },
        },
        margin: { left: 14, right: 14 },
        tableLineColor: [255, 224, 194],
        tableLineWidth: 0.3,
      });

      // Page footers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7.5);
        doc.setTextColor(180, 140, 100);
        doc.text(
          `Page ${i} of ${pageCount}  •  College Mess Portal`,
          pageW / 2,
          doc.internal.pageSize.getHeight() - 6,
          { align: 'center' }
        );
      }

      doc.save(`mess-report-${monthNames[parseInt(month)]}-${year}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('PDF export failed. Please check your connection and try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mainOuter">
      <div className="report-container">

        {/* ── Wave Header ── */}
        <div className="reportHeader">
          <div className="headerTitleBlock">
            <span className="headerPill">📊 Admin</span>
            <h1 className="headerTitle">Monthly Reports</h1>
            <p className="headerSubtitle">Attendance breakdown by student</p>
          </div>
          <div className="headerIconBadge">📈</div>
        </div>

        {/* ── Body ── */}
        <div className="reportBody">

          <span className="sectionLabel">🗓 Select Month & Year</span>
          {error && <div className="errorBox">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="date-selection-form">
            <label>
              Month
              <input type="number" value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="1 – 12" min="1" max="12" required />
            </label>
            <label>
              Year
              <input type="number" value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2024" min="2000" required />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? '⏳' : '→ Fetch'}
            </button>
          </form>

          {/* ── Results ── */}
          {loading ? (
            <div className="stateBox">
              <span className="stateIcon">⏳</span>
              Fetching report…
            </div>
          ) : reportData.length > 0 ? (
            <>
              <div className="divider" />

              {/* ── Search + Export ── */}
              <div className="searchExportRow">

                <div className="searchWrap">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2"/>
                    <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search name or admission no…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button className="clearBtn" onClick={() => setSearch('')}>✕</button>
                  )}
                </div>

                <button
                  className="exportBtn"
                  onClick={handleExportPDF}
                  disabled={exporting || filteredData.length === 0}
                  title="Export current view as PDF"
                >
                  {exporting ? (
                    '⏳'
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path d="M12 3v13M7 11l5 5 5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 20h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                      </svg>
                      <span className="exportLabel">Export PDF</span>
                    </>
                  )}
                </button>
              </div>

              <div className="resultsLabel">
                <span className="sectionLabel" style={{ margin: 0 }}>
                  {monthNames[parseInt(month)]} {year}
                </span>
                <span className="resultsCount">
                  {filteredData.length}{search ? ` of ${reportData.length}` : ''} student{filteredData.length !== 1 ? 's' : ''}
                </span>
              </div>

              {filteredData.length === 0 ? (
                <div className="stateBox">
                  <span className="stateIcon">🔎</span>
                  No students match "{search}"
                </div>
              ) : (
                <div className="tableWrapper">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Adm. No.</th>
                        <th>Name</th>
                        <th>Presents</th>
                        <th>Absences</th>
                        <th>Global Abs.</th>
                        <th>Normal Abs.</th>
                        <th>Month</th>
                        <th>Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((report, index) => (
                        <tr key={index}>
                          <td>{report.admissionNumber}</td>
                          <td>{report.name}</td>
                          <td>{clampPresents(report.totalPresents)}</td>
                          <td>{report.totalAbsences}</td>
                          <td>{report.globalAbsences}</td>
                          <td>{report.normalAbsences}</td>
                          <td>{report.month}</td>
                          <td>{report.year}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : !loading && !error ? (
            <div className="stateBox">
              <span className="stateIcon">📋</span>
              Enter a month and year above to fetch the report.
            </div>
          ) : null}

        </div>
      </div>
    </div>
  );
}

export default ViewMonthlyReport;