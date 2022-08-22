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
import { split } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

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

// Create a new WebSocketLink that represents the WebSocket connection
const wsLink = new WebSocketLink({
    uri: "ws://localhost:4000/graphql",
    options: {
        reconnect: true,
        connectionParams: {
            authToken: localStorage.getItem(AUTH_TOKEN)
        }
    }
});

/* 
    Directional Composition
    You might want your link chain's execution to branch, depending on the details
    of the operation being performed. You can define this logic with the split method
    of an Apollo instance. This method takes three parameters:
        (1) test
            A function that takes in the current Operation, and returns either true
            or false depending on its details.
        (2) left
            The link to execute next if the test function returns true.
        (3) right
            An optional link to execute next if the test function returns false.
            If this is not provided, the request handler's forward parameter is used.
        
    split is used to "route" a request to a specific middleware link.
 */
const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return (
            kind === "OperationDefinition" && operation === "subscription"
        )
    },
    wsLink,
    authLink.concat(httpLink)
);

const client = new ApolloClient({
    link,
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