import React from "react";
import { gql, useLazyQuery } from "@apollo/client";
import Link from "./Link";

const FEED_SEARCH_QUERY = gql`
    query FeedSearchQuery($filter: String!) {
        feed(filter: $filter) {
            id
            links {
                id
                description
                url
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

export default function Search() {
    const [searchFilter, setSearchFilter] = React.useState("");
    const [executeSearch, { data }] = useLazyQuery(FEED_SEARCH_QUERY, { fetchPolicy: "no-cache"});

    return (
        <>
            <div>
                Search
                <input type="text" onChange={e => setSearchFilter(e.target.value)} />
                <button
                    onClick={() => 
                        executeSearch({
                            variables: { filter: searchFilter}
                        })
                    }
                >
                    Ok
                </button>
            </div>
            {
                data && data.feed.links.map((link, i) =>
                    <Link key={link.id} link={link} index={i} />
                )
            }
        </>
    );
}
