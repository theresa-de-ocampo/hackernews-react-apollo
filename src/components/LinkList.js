import React from "react";
import Link from "./Link";
import { useQuery, gql } from "@apollo/client";

export default function LinkList() {
    /* 
        With the useQuery hook, all we need to do is pass a GraphQL query document in,
        and Apollo will take care of the fetching and will surface the returned data, and
        any errors for us.
     */
    const FEED_QUERY = gql`
        {
            feed {
                id
                links {
                    id
                    createdAt
                    url
                    description
                }
            }
        }
    `;

    const { data } = useQuery(FEED_QUERY);

    return (
        <div>
            { data && data.feed.links.map(link => <Link key={link.id} link={link} />) }
        </div>
    );
}
