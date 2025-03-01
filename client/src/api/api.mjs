

const API_URL = "http://localhost:3001/api";

async function fetchLastLotteryDraw() {

    const response = await fetch(`${API_URL}/lottery/last`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "HTTP error");
    }

    return data;
}

async function fetchNextLotteryDraw() {
    const response = await fetch(`${API_URL}/lottery/next`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "HTTP error");
    }
  
    return data;
}

async function login(username, password) {
    const response = await fetch(`${API_URL}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "An HTTP error occurred");
    }
    return data;
    
}
async function logout() {
    const response = await fetch(`${API_URL}/auth/current`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error(data.message || "HTTP error");
    }
}
async function getCurrentUser() {
    const response = await fetch(`${API_URL}/auth/current`,{
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    credentials: "include",
});
     const data = await response.json();
    if (!response.ok) {
     
        throw new Error(data.message || "HTTP error");
    }
   
    return data;
}
async function placeBet(numbers) {
    const response = await fetch(`${API_URL}/bet/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ numbers }),
      });
      
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "HTTP error");
    }
    return;
}
async function deleteBet() {
    const response = await fetch(`${API_URL}/bet/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
      const data = await response.json();
        throw new Error(data.message || "HTTP error");
    }
    return;
}


async function getUserLastBet() {
    const response = await fetch(`${API_URL}/bet/result`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "HTTP error");
    }
    return data;
}

async function getUserCurrentBet() {
    const response = await fetch(`${API_URL}/bet/status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "HTTP error");
    }
    return data;
}

async function fetchLeaderboard() {
    const response = await fetch(`${API_URL}/lottery/leaderboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "HTTP error");
    }
    return data;
}

const API ={
fetchLastLotteryDraw,
fetchNextLotteryDraw,
login,
logout,
getCurrentUser,
placeBet,
deleteBet,
getUserLastBet,
getUserCurrentBet,
fetchLeaderboard
}
export default API;