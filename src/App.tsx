import type { FormEvent } from "react";
import { useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";

import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);
const amplifyClient = generateClient<Schema>({ authMode: "userPool" });

function App() {
    const [result, setResult] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData(event.currentTarget);
            const { data, errors } = await amplifyClient.queries.askBedrock({
                topic: formData.get("topic")?.toString() || "general",
            });
            if (!errors) {
                console.log("AI Response Data:", data); // Check your F12 console for this!
                setResult(data?.body || "No data returned");
            } else {
                console.log(errors);
            }
        } catch (e) {
            alert(`An error occurred: ${e}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Authenticator>
            {({ signOut }) => (
                <main className="app-container">
                    <div className="header-container">
                        <div className="sign-out-container">
                            <button onClick={signOut} className="sign-out-button">Sign Out</button>
                        </div>
                        <h1 className="main-header">
                            Meet Your Personal
                            <br />
                            <span className="highlight">Dad Joke AI</span>
                        </h1>
                        <p className="description">
                            Enter a topic and get a groan-worthy dad joke on demand...
                        </p>
                    </div>
                    <form onSubmit={onSubmit} className="form-container">
                        <div className="search-container">
                            <input
                                type="text"
                                className="wide-input"
                                id="topic"
                                name="topic"
                                placeholder="Enter a topic (e.g., cats, coffee, programming)"
                            />
                            <button type="submit" className="search-button">
                                Get Joke
                            </button>
                        </div>
                    </form>
                    <div className="result-container">
                        {loading ? (
                            <div className="loader-container">
                                <span className="claude-spinner"></span>
                                <span>Generating dad joke...</span>
                            </div>
                        ) : (
                            result && <p className="result">{result}</p>
                        )}
                    </div>
                </main>
            )}
        </Authenticator>
    );
}

export default App;// Test from machine 2
// Auto-start test
