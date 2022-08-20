import React from "react";
import Link from "./Link";
import { useQuery, gql } from "@apollo/client";

/* 
    With the useQuery hook, all we need to do is pass a GraphQL query document in,
    and Apollo will take care of the fetching and will surface the returned data, and
    any errors for us.
*/
export const FEED_QUERY = gql`
    {
        feed {
            id
            links {
                id
                createdAt
                url
                description
                postedBy {
                    id
                    name
                }
                votes {
                    id
                    user {
                        id
                    }
                }
            }
        }
    }
`;

export default function LinkList() {
    const { data } = useQuery(FEED_QUERY);

    return (
        <div>
            { data && data.feed.links.map((link, i) => <Link key={link.id} link={link} index={i} />) }
        </div>
    );
}
