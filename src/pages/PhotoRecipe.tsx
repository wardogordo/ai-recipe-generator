import { useState } from "react";

export default function PhotoRecipe() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <main className="app-container">
            <div className="header-container">
                <h1 className="main-header">
                    Photo-Based
                    <br />
                    <span className="highlight">Recipe AI</span>
                </h1>
                <p className="description">
                    Upload a photo of your ingredients and let AI suggest recipes!
                </p>
            </div>

            <div className="form-container">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ marginBottom: "20px" }}
                />

                {previewUrl && (
                    <div>
                        <h3>Preview:</h3>
                        <img
                            src={previewUrl}
                            alt="Selected ingredients"
                            style={{ maxWidth: "400px", marginTop: "10px" }}
                        />
                    </div>
                )}
            </div>

            <div className="result-container">
                <p>Coming soon: Recipe analysis will appear here!</p>
            </div>
        </main>
    );
}