import React, { useState } from "react";
import "./App.css";
import jwtdecode from "jwt-decode";
import axios from "axios";

function App() {
    const [user, setUser]: any = useState();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const refreshToken = async () => {
        try {
            const res = await axios.post("/refresh", {
                token: user.refreshToken,
            });
            setUser({
                ...user,
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken,
            });
            return res.data;
        } catch (err) {
            console.log(err);
        }
    };

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(
        async (config: any) => {
            let currentDate = new Date();
            const decodedToken: any = jwtdecode(user.accessToken);
            if (decodedToken.exp * 1000 < currentDate.getTime()) {
                const data = await refreshToken();
                config.headers["authorization"] = "Bearer " + data.accessToken;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        },
    );

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const res = await axios.post("/login", { username, password });
            setUser(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async (id: any) => {
        setSuccess(false);
        setError(false);
        try {
            await axiosJWT.delete("/users/" + id, {
                headers: { authorization: "Bearer " + user.accessToken },
            });
            setSuccess(true);
        } catch (err) {
            setError(true);
        }
    };
    return (
        <>
            <div className="container">
                {user ? (
                    <div className="home">
                        <span>
                            Welcome to the{" "}
                            <b>{user.isAdmin ? "admin" : "user"}</b> dashboard{" "}
                            <b>{user.username}</b>.
                        </span>
                        <span>Delete Users:</span>
                        <button
                            className="deleteButton"
                            onClick={() => handleDelete(3)}
                        >
                            Delete John
                        </button>
                        <button
                            className="deleteButton"
                            onClick={() => handleDelete(2)}
                        >
                            Delete Jane
                        </button>
                        {error && (
                            <span className="error">
                                You are not allowed to delete this user!
                            </span>
                        )}
                        {success && (
                            <span className="success">
                                User has been deleted successfully...
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="login">
                        <form onSubmit={handleSubmit}>
                            <span className="formTitle">Lama Login</span>
                            <input
                                type="text"
                                placeholder="username"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="submit" className="submitButton">
                                Login
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}

export default App;
