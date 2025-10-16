import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5000/api/users")
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching users:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="text-center mt-10">Loading users...</p>;

    const handleSubmit = (e) => {
        e.preventDefault();

        const foundUser = users.find(
            (user) => user.login === login && user.password === password
        );

        if (foundUser) {
            setError("");
            navigate("/stock");
        } else {
            setError("Invalid login or password");
        }
    };

    return (
        <div className="h-screen w-screen flex">
            <div className="w-1/2 flex flex-col justify-center items-center bg-gray-100">
                <h2 className="text-xl font-semibold text-[40px] text-[#400000] mb-[80px] font-['Craftwork_Grotesk']">
                    Welcome to WMSB
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col space-y-6 w-2/3 max-w-sm"
                >
                    <div>
                        <label
                            htmlFor="login"
                            className="block text-[#400000] text-[22px] mb-4 font-['Craftwork_Grotesk'] text-sm font-semibold"
                        >
                            Login
                        </label>
                        <input
                            id="login"
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            className="w-full rounded-lg border border-[#400000] px-2 py-2 focus:outline-none focus:ring-1 focus:ring-[#7c0a02]"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-[#400000] font-['Craftwork_Grotesk'] text-sm font-semibold text-[22px] mb-4 mt-[30px]"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-[#400000] px-2 py-2 focus:outline-none focus:ring-1 focus:ring-[#7c0a02] mb-[50px]"
                        />
                    </div>

                    {error && (
                        <p className="text-red-600 text-center mb-2 font-['Craftwork_Grotesk']">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-[#8B0A02] text-white text-[20px] font-['Craftwork_Grotesk'] font-medium py-2 px-20 rounded-lg hover:bg-[#6f0801] transition-all"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>

            <div className="w-1/2 bg-[#400000] flex items-center justify-center">
                <h1 className="text-white text-6xl font-['Craftwork_Grotesk'] font-bold">
                    WMSB
                </h1>
            </div>
        </div>
    );
};

export default LoginPage;
