import React, { useState, useEffect, useRef } from 'react';
const useScript = url => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, [url]);
};

export default function InstantWin() {
    useScript('https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js');

    const prizes = [
        "Big-Prize Entry",
        "+0.2 raffle entries",
        "consolation 5 credits"
    ];
    const selectedPrize = prizes[Math.floor(Math.random() * prizes.length)];
    const scratchCardData = {
        title: "INSTANT-WIN SCRATCH CARD",
        description: "As a thank you for your purchase, you get one scratch. Good luck!",
        prize: selectedPrize
    };
    return (
        <div className="bg-gray-100 min-h-full flex W-FULL flex-col items-center justify-center font-sans p-4">
            <div className="flex flex-col items-center justify-center py-12 text-center w-full max-w-lg">
                <h1 className="text-3xl font-black text-gray-800 mb-4">{scratchCardData.title}</h1>
                <p className="text-gray-600 mb-8">{scratchCardData.description}</p>
                
                <ScratchCard prize={scratchCardData.prize} />
            </div>
        </div>
    );
}
function ScratchCard({ prize }) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (isAnimating) {
            const timer = setTimeout(() => setIsAnimating(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isAnimating]);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#111D5E');
        gradient.addColorStop(1, '#253888'); 
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'rgba(255, 255, 255, 0.8)';
        context.font = 'bold 24px Inter, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2);

    }, []); 
    const getBrushPos = (x, y) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        return {
            x: (x - rect.left) * (canvas.width / rect.width),
            y: (y - rect.top) * (canvas.height / rect.height)
        };
    };
    const scratch = (x, y) => {
        const context = canvasRef.current.getContext('2d');
        context.globalCompositeOperation = 'destination-out';
        context.beginPath();
        context.arc(x, y, 25, 0, 2 * Math.PI, true);
        context.fill();
    };
    const handleScratch = (e) => {
        if (isRevealed) return;
        let isDrawing = e.buttons === 1 || e.type.startsWith('touch');
        if (!isDrawing) return;
        e.preventDefault(); 
        let brushPos;
        if (e.type.startsWith('mouse')) {
            brushPos = getBrushPos(e.clientX, e.clientY);
        } else if (e.type.startsWith('touch')) {
            brushPos = getBrushPos(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        } else {
            return;
        }
        scratch(brushPos.x, brushPos.y);
    };
    const handleScratchEnd = () => {
        if (isRevealed) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentPixels = 0;
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) {
                transparentPixels++;
            }
        }

        const totalPixels = canvas.width * canvas.height;
        const revealPercentage = (transparentPixels / totalPixels) * 100;
        if (revealPercentage > 10) {
            setIsRevealed(true);
            setIsAnimating(true); 
            if (typeof window.confetti === 'function') {
                window.confetti({
                    particleCount: 150,
                    spread: 90,
                    origin: { y: 0.6 },
                    colors: ['#FF7A00', '#111D5E', '#FFFFFF']
                });
            }
        }
    };

    return (
        <>
            <div 
                className={`relative rounded-lg shadow-2xl w-full max-w-md h-48 sm:h-56 transition-transform duration-300 ease-in-out ${isAnimating ? 'scale-110' : 'scale-100'}`}
            >
                <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-lg border-4 border-gray-200">
                    <p className="text-lg text-gray-700">You've won:</p>
                    <h2 className="text-4xl font-black text-orange-500 px-4 text-center">{prize}</h2>
                </div>
                {!isRevealed && (
                    <canvas
                        ref={canvasRef}
                        className="absolute top-0 left-0 w-full h-full rounded-lg cursor-grab"
                        onMouseDown={handleScratch}
                        onMouseMove={handleScratch}
                        onMouseUp={handleScratchEnd}
                        onTouchStart={handleScratch}
                        onTouchMove={handleScratch}
                        onTouchEnd={handleScratchEnd}
                    />
                )}
            </div>
            <div className="mt-8 h-12 flex items-center justify-center">
                <button
                    id="claim-button"
                    className={`bg-orange-500 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-500 transform disabled:opacity-50 disabled:cursor-not-allowed ${isRevealed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={() => setShowModal(true)}
                    disabled={!isRevealed}
                >
                    Claim Your Prize
                </button>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-60 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full text-center">
                        <h3 className="text-2xl font-bold text-[#111D5E] mb-4">Prize Claimed!</h3>
                        <p className="text-gray-600 mb-6">Your prize of "{prize}" has been added to your account. Happy playing!</p>
                        <button 
                            className="bg-[#FF7A00] text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
                            onClick={() => setShowModal(false)}
                        >
                            Awesome!
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
