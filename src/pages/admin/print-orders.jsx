import React, { useEffect, useState } from "react";

const ADMIN_PASSWORD = "2StaceyS>@ne"; // Change this to your real password

const PrintOrdersAdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    // Simple localStorage token check
    const token = window.localStorage.getItem("adminToken");
    if (token === ADMIN_PASSWORD) setIsAdmin(true);
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    fetch("/api/admin-list-print-orders.js")
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
  }, [isAdmin]);

  // Filter orders by notes and date
  const filteredOrders = orders.filter(order => {
    const matchesNotes = order.notes?.toLowerCase().includes(search.toLowerCase());
    const matchesDate = dateFilter
      ? order.date && order.date.startsWith(dateFilter)
      : true;
    return matchesNotes && matchesDate;
  });

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  // CSV Export
  const exportCSV = () => {
    const header = [
      "Date",
      "Shirts",
      "Colors",
      "Underbase",
      "Notes",
      "Quote",
      "Artwork"
    ];
    const rows = filteredOrders.map(order => [
      order.date ? new Date(order.date).toLocaleString() : "",
      order.shirtCount,
      order.numColors,
      order.hasUnderbase ? "Yes" : "No",
      `"${order.notes?.replace(/"/g, '""') || ""}"`,
      `"${order.quote ? JSON.stringify(order.quote).replace(/"/g, '""') : ""}"`,
      order.artFileUrl ? window.location.origin + order.artFileUrl : ""
    ]);
    const csvContent =
      [header, ...rows]
        .map(row => row.join(","))
        .join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "print-orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Simple admin login UI
  if (!isAdmin) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Enter admin password"
          value={passwordInput}
          onChange={e => setPasswordInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && passwordInput === ADMIN_PASSWORD) {
              window.localStorage.setItem("adminToken", ADMIN_PASSWORD);
              setIsAdmin(true);
            }
          }}
        />
        <button
          onClick={() => {
            if (passwordInput === ADMIN_PASSWORD) {
              window.localStorage.setItem("adminToken", ADMIN_PASSWORD);
              setIsAdmin(true);
            }
          }}
        >
          Login
        </button>
      </div>
    );
  }

  if (loading) return <div>Loading print orders...</div>;
  if (!orders.length) return <div>No print orders found.</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Print Orders</h1>
      <div style={{ marginBottom: "1em" }}>
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginRight: "1em" }}
        />
        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          style={{ marginRight: "1em" }}
        />
        <button onClick={exportCSV}>Export CSV</button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Shirts</th>
            <th>Colors</th>
            <th>Underbase</th>
            <th>Notes</th>
            <th>Quote</th>
            <th>Artwork</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map((order, idx) => (
            <tr key={idx} style={{ borderBottom: "1px solid #ccc" }}>
              <td>{order.date ? new Date(order.date).toLocaleString() : ""}</td>
              <td>{order.shirtCount}</td>
              <td>{order.numColors}</td>
              <td>{order.hasUnderbase ? "Yes" : "No"}</td>
              <td>{order.notes}</td>
              <td>
                {order.quote && (
                  <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.9em" }}>
                    {JSON.stringify(order.quote, null, 2)}
                  </pre>
                )}
              </td>
              <td>
                {order.artFileUrl ? (
                  <a href={order.artFileUrl} target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                ) : (
                  "No file"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "1em" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            disabled={currentPage === i + 1}
            style={{
              marginRight: 4,
              fontWeight: currentPage === i + 1 ? "bold" : "normal"
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PrintOrdersAdminPage;