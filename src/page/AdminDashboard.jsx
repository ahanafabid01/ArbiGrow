import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../component/admin/AdminLayout.jsx";
import UserManagement from "../component/admin/UserManagement.jsx";
import DashboardOverview from "../component/admin/DashboardOverview.jsx";
import { getAllUsers } from "../api/admin.api.js";
import useUserStore from "../store/userStore.js";
import DepositRequests from "../component/admin/DepositRequests.jsx";
import WithdrawalRequests from "../component/admin/WithdrawalRequests.jsx";
import DepositNetworks from "../component/admin/DepositNetworks.jsx";
import { InvestmentsManagement } from "../component/admin/InvestmentsManagement.jsx";
import RoiManagement from "../component/admin/RoiManagement.jsx";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const logout = useUserStore((state) => state.logout);

  const [users, setUsers] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = useUserStore.getState().token;
      if (!token) {
        setLoading(false);
        logout();
        navigate("/login");
        return;
      }

      try {
        const resData = await getAllUsers(token);
        if (resData?.status === 200) {
          const usersArray = resData.data?.users || [];
          setUsers(usersArray);
        } else {
          console.error(
            "Failed to fetch users: ",
            resData?.message || "Unknown error",
          );
        }
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          logout();
          navigate("/login");
          return;
        }
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [logout, navigate]);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  const renderPageContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardOverview users={users} />;
      case "users":
        return <UserManagement users={users} setUsers={setUsers} />;
      case "deposits":
        return <DepositRequests />;
      case "withdrawals":
        return <WithdrawalRequests />;
      case "networks":
        return <DepositNetworks />;
      case "investments":
        return <InvestmentsManagement />;
      case "roi":
        return <RoiManagement />;
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
    </AdminLayout>
  );
}
