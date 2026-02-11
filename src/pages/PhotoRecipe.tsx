import imageCompression from 'browser-image-compression';
import { useState } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";

const API_ENDPOINT = "https://n6mqku7u5b.execute-api.us-east-1.amazonaws.com/default/PhotoRecipeAnalyzer";

export default function PhotoRecipe() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string>("");

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(""); // Clear previous results
        }
    };

    const handleAnalyze = async () => {
        if (!selectedImage) {
            alert("Please select an image first");
            return;
        }

        setLoading(true);

        try {
            // Compress image if needed (target max 3MB to stay under 5MB after base64)
            const options = {
                maxSizeMB: 3,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            };

            const compressedFile = await imageCompression(selectedImage, options);
            console.log(`Original: ${(selectedImage.size / 1024 / 1024).toFixed(2)}MB`);
            console.log(`Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);

            // Convert compressed image to base64
            const reader = new FileReader();

            reader.onload = async () => {
                try {
                    const base64String = reader.result as string;
                    const base64Data = base64String.split(',')[1];

                    // Call Lambda via API Gateway
                    const response = await fetch(API_ENDPOINT, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            image: base64Data
                        })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        setResult(data.recipes);
                    } else {
                        setResult(`Error: ${data.error || 'Unknown error'}`);
                    }
                } catch (error) {
                    console.error("Error:", error);
                    setResult(`Error: ${error}`);
                } finally {
                    setLoading(false);
                }
            };

            reader.onerror = () => {
                setResult("Error reading image file");
                setLoading(false);
            };

            reader.readAsDataURL(compressedFile);

        } catch (error) {
            console.error("Error:", error);
            setResult(`Error: ${error}`);
            setLoading(false);
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
                    <div style={{ marginBottom: "20px" }}>
                        <img
                            src={previewUrl}
                            alt="Selected ingredients"
                            style={{ maxWidth: "400px", borderRadius: "8px" }}
                        />
                    </div>
                )}

                {selectedImage && (
                    <button
                        onClick={handleAnalyze}
                        className="search-button"
                        disabled={loading}
                    >
                        {loading ? "Analyzing..." : "Analyze Ingredients"}
                    </button>
                )}
            </div>

            <div className="result-container">
                {loading ? (
                    <div className="loader-container">
                        <p>Claude is analyzing your ingredients...</p>
                        <Loader size="large" />
                        <Placeholder size="large" />
                        <Placeholder size="large" />
                        <Placeholder size="large" />
                    </div>
                ) : (
                    result && <p className="result">{result}</p>
                )}
            </div>
        </main>
    );
}