import "./styles/index.css";
import App from "./components/App";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
    ApolloProvider,
    ApolloClient,
    createHttpLink,
    InMemoryCache
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { AUTH_TOKEN } from "./constants";

const httpLink = createHttpLink({
    uri: "http://localhost:4000"
});

/* 
    The underscore symbol is a valid identifier in JavaScript, and here,
    it is being used as a function parameter. A single underscore is a
    convention used by some JS programmers to indicate to other programmers
    that they should "ignore this binding/parameter."
 */
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem(AUTH_TOKEN);
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ""
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </BrowserRouter>
);