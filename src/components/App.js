import CreateLink from "./CreateLink";
import Header from "./Header";
import LinkList from "./LinkList";
import Login from "./Login";
import React from "react";
import Search from "./Search";
import { Routes, Route } from "react-router-dom";

export default function App() {
    return (
        <div className="center w85">
            <Header />
            <div className="ph3 pv1 background-gray">
                <Routes>
                    <Route path="/" element={<LinkList />} />
                    <Route path="/create" element={<CreateLink />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/search" element={<Search />} />
                </Routes>
            </div>
        </div>
    );
}