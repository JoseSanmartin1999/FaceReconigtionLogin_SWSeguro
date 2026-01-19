import { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

export const useFaceApi = () => {
    const [modelsLoaded, setModelsLoaded] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models';
            await Promise.all([
                faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            ]);
            setModelsLoaded(true);
            console.log("IA: Modelos cargados");
        };
        loadModels();
    }, []);

    return modelsLoaded;
};