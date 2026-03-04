import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../component/admin/AdminLayout.jsx";
import UserManagement from "../component/admin/UserManagement.jsx";
import DashboardOverview from "../component/admin/DashboardOverview.jsx";
import { getAllUsers } from "../api/admin.api.js";
import useUserStore from "../store/userStore.js";
import DepositRequests from "../component/admin/DepositRequests.jsx";
import DepositNetworks from "../component/admin/DepositNetworks.jsx";
import { InvestmentsManagement } from "../component/admin/InvestmentsManagement.jsx";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // ✅ State
  const [investments, setInvestments] = useState([
    {
    id: 1,
    userName: "John Anderson",
    userEmail: "john.anderson@arbigrow.com",
    packageName: "Starter Package",
    amount: 1000,
    roi: 20,
    profitPaid: 200,
    status: "active",
  }

  ]);
  const [selectedInvestment, setSelectedInvestment] = useState(null)
  const [users, setUsers] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  // console.log("Token from store:", useUserStore.getState().token);
  // 🔥 Fetch Users API
  useEffect(() => {
    const fetchUsers = async () => {
      const token = useUserStore.getState().token;
      // console.log("Token in fetchUsers:", token);
      if (!token) return;

      try {
        const resData = await getAllUsers(token);
        // console.log("Fetched users:", resData);
        if (resData?.status === 200) {
          // ✅ Save users in state
          const usersArray = resData.data?.users || [];
          setUsers(usersArray);
          // console.log("Users array:", usersArray);
        } else {
          console.error(
            "Failed to fetch users: ",
            resData?.message || "Unknown error",
          );
        }
        // setUsers(usersArray);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🔹 Loading State
  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  // 🔹 Render page content based on active tab
  const renderPageContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardOverview users={users} />;
      case "users":
        return <UserManagement users={users} setUsers={setUsers} />;
         case "deposits":
      return <DepositRequests />;

    case "networks":
      return <DepositNetworks />;
      case "investments":
     return (
    <InvestmentsManagement
      investments={investments}
      setSelectedInvestment={setSelectedInvestment}
    />
  );
      case "reports":
      case "settings":
        return (
          <div className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
              <p className="text-gray-400">This page is under development</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

return (
  <AdminLayout
    activePage={activePage}
    setActivePage={setActivePage}
    navigate={navigate}
  >

    {renderPageContent()}

    {/* {selectedInvestment && (
      <InvestmentDetailsModal
        selectedInvestment={selectedInvestment}
        setSelectedInvestment={setSelectedInvestment}
        investments={investments}
        setInvestments={setInvestments}
      />
    )} */}

  </AdminLayout>
);
}
