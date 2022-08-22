import React from "react";
import Link from "./Link";
import { LINKS_PER_PAGE } from "../constants";
import { useQuery, gql } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";

/* 
    With the useQuery hook, all we need to do is pass a GraphQL query document in,
    and Apollo will take care of the fetching and will surface the returned data, and
    any errors for us.
*/
export const FEED_QUERY = gql`
    query FeedQuery (
        $take: Int
        $skip: Int
        $orderBy: LinkOrderByInput
    ) {
        feed(take: $take, skip: $skip, orderBy: $orderBy) {
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
            count
        }
    }
`;

const NEW_LINKS_SUBSCRIPTION = gql`
    subscription {
        newLink {
            id
            url
            description
            createdAt
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
`;

const NEW_VOTES_SUBSCRIPTION = gql`
    subscription {
        newVote {
            id
            link {
                id
                url
                description
                createdAt
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
            user {
                id
            }
        }
    }
`;

export default function LinkList() {
    const location = useLocation();
    const navigate = useNavigate();
    const isNewPage = location.pathname.includes("new");
    const pageIndexParams = location.pathname.split("/");
    const page = parseInt(pageIndexParams[pageIndexParams.length - 1]);
    const pageIndex = page ? (page - 1) * LINKS_PER_PAGE  : 0;
    const { data, loading, error, subscribeToMore } = useQuery(FEED_QUERY, {
        variables: getQueryVariables(isNewPage, page),
        fetchPolicy: "cache-and-network"
    });
    console.log(data);

    function getQueryVariables(isNewPage, page) {
        const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
        const take = isNewPage ? LINKS_PER_PAGE : 100;
        const orderBy = { createdAt: "desc" };
        console.log(isNewPage);
        console.log(take);
        return { take, skip, orderBy};
    }

    function getLinksToRender(isNewPage, data) {
        if (isNewPage)
            return data.feed.links;
        const rankedLists = data.feed.links.slice();
        rankedLists.sort((l1, l2) => l2.votes.length - l1.votes.length);
        return rankedLists;
    }

    /* 
        The subscribeToMore function takes in a single object as an argument. 
        This object requires configuration for how to listen, and respond to a subscription.
     */
    subscribeToMore({
        document: NEW_LINKS_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const newLink = subscriptionData.data.newLink;
            const exists = prev.feed.links.find(
                ({ id }) => id === newLink.id
            );
            if (exists) return prev;

            return Object.assign({}, prev, {
                feed: {
                    links: [newLink, ...prev.feed.links],
                    count: prev.feed.links.length + 1,
                    __typename: prev.feed.__typename
                }
            });
        }
    });

    subscribeToMore({
        document: NEW_VOTES_SUBSCRIPTION
    });

    return (
        <>
            { loading && <p>Loading...</p> }
            { error && <pre>{JSON.stringify(error, null, 4)}</pre>}
            {
                data && (
                    <>
                        {
                            getLinksToRender(isNewPage, data).map((link, i) =>
                                <Link key={link.id} link={link} index={i + pageIndex} />
                            )
                        }
                        {
                            isNewPage && (
                                <div className="flex ml4 mv3 gray">
                                    <div
                                        className="pointer mr2"
                                        onClick={() => {
                                            if (page > 1)
                                                navigate(`/new/${page - 1}`)
                                        }}
                                    >
                                        Previous
                                    </div>
                                    <div
                                        className="pointer"
                                        onClick={() => {
                                            if (page <= data.feed.count / LINKS_PER_PAGE)
                                                navigate(`/new/${page + 1}`)
                                        }}
                                    >
                                        Next
                                    </div>
                                </div>
                            )
                        }
                    </>
                )
            }
        </>
    );
}