import React from "react";

export default function Link(props) {
    const { link } = props;
    return (
        <div>
            <div>
                {link.description} ({link.url})
            </div>
        </div>
    );
}