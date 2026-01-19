import { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

interface Props {
    onDescriptorGenerated: (descriptor: number[]) => void;
}

type DetectionStatus =
    | 'initializing'
    | 'searching'
    | 'detected'
    | 'no-face'
    | 'multiple-faces'
    | 'low-quality';

export const FaceScanner = ({ onDescriptorGenerated }: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [status, setStatus] = useState<DetectionStatus>('initializing');
    const [detectionScore, setDetectionScore] = useState<number>(0);

    useEffect(() => {
        startVideo();
        return () => {
            // Cleanup: detener el stream de video cuando el componente se desmonte
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setStatus('searching');
                }
            })
            .catch((err) => {
                console.error("Error al acceder a la cámara:", err);
                setStatus('no-face');
            });
    };

    const handleVideoPlay = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        // Configurar las dimensiones del canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Detectar rostros continuamente cada 500ms
        const detectFaces = async () => {
            if (!video || !canvas) return;

            try {
                // Intentar detectar múltiples rostros primero
                const detections = await faceapi
                    .detectAllFaces(video)
                    .withFaceLandmarks()
                    .withFaceDescriptors();

                // Limpiar el canvas
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }

                if (detections.length === 0) {
                    setStatus('no-face');
                    setDetectionScore(0);
                } else if (detections.length > 1) {
                    setStatus('multiple-faces');
                    setDetectionScore(0);
                    // Dibujar todas las cajas de detección
                    faceapi.draw.drawDetections(canvas, detections);
                } else {
                    // Un solo rostro detectado
                    const detection = detections[0];
                    const score = detection.detection.score;
                    setDetectionScore(Math.round(score * 100));

                    if (score < 0.6) {
                        setStatus('low-quality');
                    } else {
                        setStatus('detected');
                        // Convertir Float32Array a array normal
                        const descriptorArray = Array.from(detection.descriptor);
                        console.log('✅ Descriptor generado:', descriptorArray.length, 'elementos');
                        onDescriptorGenerated(descriptorArray);
                    }

                    // Dibujar la caja de detección y landmarks
                    faceapi.draw.drawDetections(canvas, detection);
                    faceapi.draw.drawFaceLandmarks(canvas, detection);
                }
            } catch (error) {
                console.error("Error en detección facial:", error);
                setStatus('no-face');
            }
        };

        // Ejecutar la primera detección inmediatamente
        detectFaces();

        // Continuar detectando cada 500ms
        const interval = setInterval(detectFaces, 500);

        // Cleanup cuando el video se detenga
        return () => clearInterval(interval);
    };

    const getStatusMessage = () => {
        switch (status) {
            case 'initializing':
                return { text: '🔄 Iniciando cámara...', color: 'text-blue-600', bg: 'bg-blue-50' };
            case 'searching':
                return { text: '🔍 Buscando rostro...', color: 'text-yellow-600', bg: 'bg-yellow-50' };
            case 'detected':
                return {
                    text: `✅ Rostro detectado correctamente (${detectionScore}%)`,
                    color: 'text-green-600',
                    bg: 'bg-green-50'
                };
            case 'no-face':
                return { text: '⚠️ No se detectó rostro. Acércate a la cámara.', color: 'text-orange-600', bg: 'bg-orange-50' };
            case 'multiple-faces':
                return { text: '⚠️ Se detectaron múltiples rostros. Solo debe haber una persona.', color: 'text-red-600', bg: 'bg-red-50' };
            case 'low-quality':
                return { text: '⚠️ Detección baja. Mejora la iluminación o alineación.', color: 'text-yellow-600', bg: 'bg-yellow-50' };
            default:
                return { text: 'Preparando...', color: 'text-gray-600', bg: 'bg-gray-50' };
        }
    };

    const statusInfo = getStatusMessage();

    return (
        <div className="relative flex flex-col items-center">
            <div className="relative inline-block">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    onPlay={handleVideoPlay}
                    className={`rounded-lg border-4 ${status === 'detected' ? 'border-green-500' :
                        status === 'no-face' || status === 'multiple-faces' ? 'border-red-500' :
                            'border-blue-500'
                        } w-full max-w-md`}
                    style={{ maxWidth: '640px' }}
                />
                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 rounded-lg"
                    style={{ maxWidth: '640px' }}
                />
            </div>

            <div className={`mt-3 px-4 py-2 rounded-lg ${statusInfo.bg} ${statusInfo.color} font-semibold text-center w-full max-w-md`}>
                {statusInfo.text}
            </div>

            <p className="text-xs text-gray-500 mt-2 text-center">
                💡 Consejo: Asegúrate de tener buena iluminación y mira directamente a la cámara
            </p>
        </div>
    );
};