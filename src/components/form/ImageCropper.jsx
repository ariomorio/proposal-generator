import React, { useRef, useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

export default function ImageCropper({ image, onCropComplete, onCancel, aspect = 1 }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropChange = useCallback((location) => setCrop(location), []);
    const onZoomChange = useCallback((z) => setZoom(z), []);

    const handleCropComplete = useCallback((_, croppedAreaPx) => {
        setCroppedAreaPixels(croppedAreaPx);
    }, []);

    const createCroppedImage = useCallback(async () => {
        if (!croppedAreaPixels || !image) return;
        const img = new Image();
        img.src = image;
        await new Promise(r => { img.onload = r; });

        const canvas = document.createElement('canvas');
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
            img,
            croppedAreaPixels.x, croppedAreaPixels.y,
            croppedAreaPixels.width, croppedAreaPixels.height,
            0, 0,
            croppedAreaPixels.width, croppedAreaPixels.height
        );

        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            onCropComplete(url, blob);
        }, 'image/jpeg', 0.9);
    }, [croppedAreaPixels, image, onCropComplete]);

    if (!image) return null;

    return (
        <div className="cropper-overlay">
            <div className="cropper-container">
                <div className="cropper-area">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={onCropChange}
                        onZoomChange={onZoomChange}
                        onCropComplete={handleCropComplete}
                    />
                </div>
                <div className="cropper-controls">
                    <label className="form-label">ズーム</label>
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="zoom-slider"
                    />
                    <div className="cropper-actions">
                        <button className="btn btn-secondary" onClick={onCancel}>キャンセル</button>
                        <button className="btn btn-primary" onClick={createCroppedImage}>トリミング確定</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
