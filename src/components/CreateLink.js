import React from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

export default function CreateLink() {
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({
        description: "",
        url: ""
    });

    const CREATE_LINK_MUTATION = gql`
        mutation PostMutation($description: String!, $url: String!) {
            post(description: $description, url: $url) {
                id
                createdAt
                url
                description
            }
        }
    `;
    
    /* 
        The useMutation hook does not automatically execute the mutation you pass it
        when the component renders. Instead, it returns a tuple with a mutate function
        in its first position. You then call the mutate function at any time to instruct
        Apollo Client to execute the mutation.
     */
    const [createLink] = useMutation(CREATE_LINK_MUTATION, {
        variables: {
            description: formData.description,
            url: formData.url
        },
        onCompleted: () => navigate("/")
    });

    return (
        <div>
            <form onSubmit={e => {e.preventDefault(); createLink()}}>
                <div className="flex flex-column mt3">
                    <input
                        className="mb2"
                        value={formData.description}
                        onChange={
                            e => setFormData({
                                ...formData,
                                description: e.target.value
                            })
                        }
                        type="text"
                        placeholder="A description for the link"
                    />
                    <input
                        className="mb2"
                        value={formData.url}
                        onChange={
                            e => setFormData({
                                ...formData,
                                url: e.target.value
                            })
                        }
                        type="text"
                        placeholder="The URL for the link"
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
