import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <div className="flex pal justify-between nowrap orange">
            <div className="flex flex-fixed black">
                <Link to="/" className="no-underline black">
                    <div className="fw7 mr1">Hacker News</div>
                </Link>
                <Link to="/" className="ml1 no-underline black">
                    new
                </Link>
                <Link to="/create" className="ml1 no-underline black">
                    submit
                </Link>
            </div>
        </div>
    );
}
