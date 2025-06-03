
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { FormState, CharacterType } from './types';
import { CHARACTER_TYPES, INITIAL_FORM_STATE } from './constants';
import { FormField } from './components/FormField';
import { SelectField } from './components/SelectField';
import { Button } from './components/Button';
import { GeneratedPromptDisplay } from './components/GeneratedPromptDisplay';
import { StarIcon, TrashIcon, SparklesIcon } from './components/Icons'; // Using Sparkles for AI generation might be nice

// Assume API_KEY is set in the environment
// Ensure process.env.API_KEY is available in your build environment or replace with a secure method for key management.
// For this example, we directly use it as per instructions, but in a real app, this needs careful handling.
const API_KEY = process.env.API_KEY;

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClearForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setGeneratedPrompt('');
    setError(null);
  };

  const handleSubmit = useCallback(async () => {
    if (!API_KEY) {
        setError("API Key is missing. Please configure the API_KEY environment variable.");
        setIsLoading(false);
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');

    const characterDescription = `
      Character Type: ${formData.characterType}
      Character Name: ${formData.characterName}
      Additional Face Details: ${formData.faceDetails}
      Profession (for context of face and clothing): ${formData.profession}
      Age (character's age): ${formData.age}
      Clothing Details (around the face, like collar, head accessories): ${formData.clothingDetails}
    `;

    const systemInstruction = `You are an expert prompt engineer for AI image generators. Your goal is to transform a basic character description into a highly detailed and specific prompt that an AI image generator can use to create consistent character visuals. The final prompt MUST be in English.

Based on the following character details:
${characterDescription}

Generate a comprehensive image prompt. Include aspects like:
- Detailed physical appearance (face shape, eyes, nose, mouth, hair style and color, skin tone, build).
- Specific clothing items and accessories, including colors and materials.
- Character's expression or mood.
- A suggested art style (e.g., photorealistic, anime, cartoon, 3D render, oil painting, watercolor).
- Lighting conditions (e.g., soft studio lighting, dramatic backlighting, golden hour).
- Camera angle (e.g., close-up portrait, medium shot, cowboy shot).
- Keywords for consistency if the character is to be used in multiple images (e.g., "consistent character design", "character sheet style").
- Optionally, suggest negative prompts if helpful (e.g., "ugly, deformed, blurry, bad anatomy").

The output should be a single block of text, ready to be pasted into an image generator. Focus on creating a prompt that yields visually striking and consistent results.`;

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17", // Recommended model
        contents: systemInstruction, // Using systemInstruction as the main content effectively makes it the prompt
      });
      
      setGeneratedPrompt(response.text);
    } catch (e) {
      console.error("Error generating prompt:", e);
      if (e instanceof Error) {
        setError(`Failed to generate prompt: ${e.message}. Check console for details.`);
      } else {
        setError("An unknown error occurred while generating the prompt.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData]);


  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">PROMPT GENERATOR FOR IMAGE CREATOR</h1>
          <p className="text-lg text-sky-600 font-semibold mt-1">BUAT KARAKTER AI KONSISTEN</p>
        </header>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
          <SelectField
            label="Pilih Character:"
            id="characterType"
            name="characterType"
            value={formData.characterType}
            onChange={handleChange}
            options={CHARACTER_TYPES}
          />
          <FormField
            label="NAMA TOKOH:"
            id="characterName"
            name="characterName"
            value={formData.characterName}
            onChange={handleChange}
            placeholder="Contoh: John Doe"
          />
          <FormField
            label="Detail Wajah Tambahan:"
            id="faceDetails"
            name="faceDetails"
            value={formData.faceDetails}
            onChange={handleChange}
            placeholder="Contoh: Mata tajam, hidung mancung, senyum tipis, kulit sawo matang, wajah oval, rambut hitam pendek, kacamata bulat, anting perak kecil."
            isTextarea
            rows={3}
          />
          <FormField
            label="PROFESI (untuk konteks wajah dan pakaian):"
            id="profession"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            placeholder="Contoh: Detektif (wajah serius, trench coat coklat), Penyihir (wajah misterius, jubah berbintang)"
          />
          <FormField
            label="UMUR (usia karakter):"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Contoh: 28 Tahun (wajah tegas, pakaian kasual modern), 70 Tahun (wajah bijaksana, pakaian tradisional)"
          />
          <FormField
            label="DETAIL PAKAIAN (sekitar wajah, seperti kerah, aksesoris kepala):"
            id="clothingDetails"
            name="clothingDetails"
            value={formData.clothingDetails}
            onChange={handleChange}
            placeholder="Contoh: Kemeja flanel (kerah terbuka), topi fedora, syal sutra melilit leher"
            isTextarea
            rows={2}
          />

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <Button type="submit" variant="primary" onClick={handleSubmit} isLoading={isLoading} disabled={isLoading}>
              <SparklesIcon className="w-5 h-5 mr-2" />
              Hasilkan Prompt
            </Button>
            <Button variant="secondary" onClick={handleClearForm} disabled={isLoading}>
              <TrashIcon className="w-5 h-5 mr-2" />
              Bersihkan
            </Button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <GeneratedPromptDisplay promptText={generatedPrompt} isLoading={isLoading} />
      </div>
      <footer className="text-center text-slate-600 mt-10 text-sm">
        <p>&copy; {new Date().getFullYear()} AI Character Prompt Generator. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
    