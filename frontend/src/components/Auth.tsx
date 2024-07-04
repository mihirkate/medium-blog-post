import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupInput } from "@mihirkate/medium-common";
import axios from "axios";
import { BACKEND_URL } from "../config";


export default function Auth({ type }: { type: "signup" | "signin" }) {
    const navigate = useNavigate();
    const [postInput, setPostInput] = useState<SignupInput>({
        name: "",
        username: "",
        password: ""
    });


    async function sendRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInput);
            console.log("Full response:", response); // Log the full response
            console.log("Response data:", response.data); // Log the data part of the response
            const jwt = response.data.jwt;
            console.log(jwt);
             // Access the 'jwt' key instead of 'token'
            localStorage.setItem("token", jwt);
            navigate("/blogs");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data);
                alert(`Error: ${error.response?.data?.message || "Unknown error"}`);
            } else {
                console.error("Unexpected error:", error);
                alert("Unexpected error occurred");
            }
        }
    }
    return (
        <div className="bg-slate-200 h-screen flex justify-center items-center">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <div className="text-3xl font-extrabold mt-2">
                        Create an Account
                    </div>
                    <div className="text-slate-700 mt-2">
                        {type === "signin" ? "Dont have an Account " : "Already have an account?"}
                        <Link className="underline ml-1" to={type === "signin" ? "/signup" : "/signin"} >
                            {type === "signin" ? "Signup" : "Sign In"}
                        </Link>
                    </div>
                </div>
                <form className="space-y-4">
                    {type === "signup" ? <LabelledInput
                        label="Name"
                        placeholder="Your name"
                        onChange={(e) => {
                            setPostInput({
                                ...postInput,
                                name: e.target.value,
                            });
                        }}
                    /> : null}
                    <LabelledInput
                        label="Username"
                        placeholder="mihirkate@gmail.com"
                        onChange={(e) => {
                            setPostInput({
                                ...postInput,
                                username: e.target.value,
                            });
                        }}
                    />
                    <LabelledInput
                        label="Password"
                        type="password"
                        placeholder="Abcd@123"
                        onChange={(e) => {
                            setPostInput({
                                ...postInput,
                                password: e.target.value,
                            });
                        }}
                    />
                    <button onClick={sendRequest} type="button" className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none
        focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
        dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700
        dark:border-gray-700">

                        {type === "signup" ? "signup" : "signin"}
                    </button>

                </form>
            </div>
        </div>
    );
}

interface LabelledInputProps {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputProps) {
    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-black">{label}</label>
            <input
                type={type || "text"}
                onChange={onChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder={placeholder}
                required
            />
        </div>
    );
}
