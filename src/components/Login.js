import React from "react";
import { AUTH_TOKEN } from "../constants";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({
        login: true,
        email: "",
        password: "",
        name: ""
    });

    const SIGNUP_MUTATION = gql`
        mutation SignupMutation (
            $email: String!
            $password: String!
            $name: String!
        ) {
            signup (
                email: $email
                password: $password
                name: $name
            ) {
                token
            }
        }
    `;
    const LOGIN_MUTATION = gql`
        mutation LoginMutation (
            $email: String!
            $password: String!
        ) {
            login(
                email: $email
                password: $password
            ) {
                token
            }
        }
    `;

    const [login] = useMutation(LOGIN_MUTATION, {
        variables: {
            email: formData.email,
            password: formData.password
        },
        onCompleted: ({ login }) => {
            localStorage.setItem(AUTH_TOKEN, login.token);
            navigate("/");
        }
    });
    const [signup] = useMutation(SIGNUP_MUTATION, {
        variables: {
            email: formData.email,
            password: formData.password,
            name: formData.name
        },
        onCompleted: ({ signup }) => {
            localStorage.setItem(AUTH_TOKEN, signup.token);
            navigate("/");
        }
    });

    return (
        <div>
            <h4 className="mv3">{formData.login ? "Login" : "Sign Up"}</h4>
            <div className="flex flex-column">
                {
                    !formData.login && (
                        <input 
                            value={formData.name}
                            onChange={e => setFormData({
                                ...formData,
                                name: e.target.value
                            })}
                            type="text"
                            placeholder="Your name"
                        />
                    )
                }
                <input
                    value={formData.email}
                    onChange={e => setFormData({
                        ...formData,
                        email: e.target.value
                    })}
                    type="text"
                    placeholder="Your email address"
                />
                <input
                    value={formData.password}
                    onChange={e => setFormData({
                        ...formData,
                        password: e.target.value
                    })}
                    type="password"
                    placeholder="Choose a safe password"
                />
                <div className="flex mt3">
                    <button
                        className="pointer mr2 button"
                        onClick={formData.login ? login : signup}
                    >
                        {formData.login ? "login" : "create account"}
                    </button>
                    <button
                        className="pointer button"
                        onClick={e => setFormData({
                            ...formData,
                            login: !formData.login
                        })}
                    >
                        {
                            formData.login ? "Don't have an account?" : "Already have an account?"
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}