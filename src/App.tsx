import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import TextRecipe from "./pages/TextRecipe";
import PhotoRecipe from "./pages/PhotoRecipe";

function App() {
    return (
        <Authenticator>
            {({ signOut }) => (
                <BrowserRouter>
                    <div className="app-wrapper">
                        <nav className="nav-container">
                            <div className="nav-links">
                                <Link to="/" className="nav-link">Text Recipe</Link>
                                <Link to="/photo-recipe" className="nav-link">Photo Recipe</Link>
                            </div>
                            <button onClick={signOut} className="sign-out-button">
                                Sign Out
                            </button>
                        </nav>

                        <Routes>
                            <Route path="/" element={<TextRecipe />} />
                            <Route path="/photo-recipe" element={<PhotoRecipe />} />
                        </Routes>
                    </div>
                </BrowserRouter>
            )}
        </Authenticator>
    );
}

export default App;