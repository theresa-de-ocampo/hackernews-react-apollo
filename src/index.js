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

const httpLink = createHttpLink({
    uri: "http://localhost:4000"
});

const client = new ApolloClient({
    link: httpLink,
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