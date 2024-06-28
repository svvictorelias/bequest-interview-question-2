import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import Logo from "./assets/bequest_logo.jpeg";

const API_URL = "http://localhost:8080";

const buttonStyle = {
  fontSize: "1.2rem",
  padding: "10px 20px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "background-color 0.3s ease"
};

const inputStyle = {
  fontSize: "1.5rem",
  padding: "10px",
  width: "300px",
  maxWidth: "80%"
};

const messageStyle = {
  marginTop: "20px",
  fontSize: "1.2rem",
  fontStyle: "italic",
  color: "#28a745"
};

const errorMessageStyle = {
  ...messageStyle,
  color: "#dc3545"
};

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
  fontSize: "1.5rem",
  overflow: "hidden"
};

const linkContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "20px"
};

const logoStyle: React.CSSProperties = {
  position: "absolute",
  top: "20px",
  width: "200px"
};

function App() {
  const [data, setData] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messageStyleOverride, setMessageStyleOverride] = useState<
    React.CSSProperties | undefined
  >(undefined);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    setData(data);
  };

  const updateData = async () => {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });

    await getData();
  };

  const verifyData = async () => {
    const hmac = generateHMAC(data);
    const response = await fetch(`${API_URL}/verify`, {
      method: "POST",
      body: JSON.stringify({ data, hmac }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    const result = await response.json();
    setMessage(result.message);
    if (result.status === "error") {
      setMessageStyleOverride(errorMessageStyle);
    } else {
      setMessageStyleOverride(undefined);
    }
  };

  const recoverData = async () => {
    const response = await fetch(`${API_URL}/recover`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    const result = await response.json();
    setMessage(result.message);
    setData(result.data.data);
  };

  const generateHMAC = (data: string) => {
    const secret = "B3qu6st@V1ct0R";
    return CryptoJS.HmacSHA256(data, secret).toString(CryptoJS.enc.Hex);
  };

  return (
    <div style={containerStyle}>
      <img src={Logo} alt="Bequest Logo" style={logoStyle} />
      <div
        style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center" }}
      >
        Saved Data
      </div>
      <input
        style={inputStyle}
        type="text"
        value={data}
        onChange={e => setData(e.target.value)}
      />

      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button style={buttonStyle} onClick={updateData}>
          Update Data
        </button>
        <button style={buttonStyle} onClick={verifyData}>
          Verify Data
        </button>
        <button style={buttonStyle} onClick={recoverData}>
          Recover Data
        </button>
      </div>
      <div style={messageStyleOverride ?? messageStyle}>{message}</div>

      <div>
        <div style={linkContainerStyle}>
          <a
            href="https://www.linkedin.com/in/svvictorelias/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "1.5rem", color: "#0077b5" }}
          >
            LinkedIn
          </a>
          <p>
            {" <- "} Victor Elias {" -> "}
          </p>
          <a
            href="https://github.com/svvictorelias"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "1.5rem", color: "#333" }}
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
