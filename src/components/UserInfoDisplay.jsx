import { useState, useEffect } from "react";
import api from "../services/api";

const getUserInfo = async () => {
    const token = localStorage.getItem('token');
    console.log(token);
    
    if (token) {
      try {
        const response = await api.get('/usuarios/user-info', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await response.data;
        localStorage.setItem("userInfo", JSON.stringify(userData));
        return userData; // Dados do usuário
      } catch (error) {
        console.error('Failed to fetch user info', error);
      }
    }
    return null;
  };

function UserInfoDisplay() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userData = await getUserInfo();
      if (userData) {
        setUserInfo(userData);
      }
    };

    fetchUserInfo();
  }, []);

  if (!userInfo) {
    return <p>Loading user information...</p>;
  }

  return (
    <div>
      <h1>Welcome, {userInfo.name}!</h1>
      <p>Email: {userInfo.email}</p>
      {/* Exiba outras informações conforme necessário */}
    </div>
  );
}

export default UserInfoDisplay;
