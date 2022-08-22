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
    const { data, subscribeToMore } = useQuery(FEED_QUERY);

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
        <div>
            { data && data.feed.links.map((link, i) => <Link key={link.id} link={link} index={i} />) }
        </div>
    );
}