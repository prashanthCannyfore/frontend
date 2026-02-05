import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Searchbar = () => {

    const [keyword, setKeyword] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const navigate = useNavigate();
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Check if browser supports speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            setIsSupported(true);
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setKeyword(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(keyword.trim()){
            navigate(`/products/${keyword}`)
        } else {
            navigate('/products');
        }
    }

    const toggleVoiceRecognition = () => {
        if (!isSupported) {
            alert('Voice recognition is not supported in your browser. Please try Chrome or Edge.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full sm:w-9/12 px-1 sm:px-4 py-1.5 flex justify-between items-center shadow-md bg-white rounded-sm overflow-hidden">
            <input 
                value={keyword} 
                onChange={(e) => setKeyword(e.target.value)} 
                className="text-sm flex-1 outline-none border-none placeholder-gray-500" 
                type="text" 
                placeholder={isListening ? "Listening..." : "Search for products, brands and more"} 
            />
            <div className="flex items-center gap-2">
                {isSupported && (
                    <button 
                        type="button" 
                        onClick={toggleVoiceRecognition}
                        className={`p-1 rounded-full transition-colors ${
                            isListening 
                                ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                                : 'text-gray-500 hover:text-primary-blue hover:bg-blue-50'
                        }`}
                        title={isListening ? "Stop voice input" : "Start voice input"}
                    >
                        {isListening ? <MicOffIcon fontSize="small" /> : <MicIcon fontSize="small" />}
                    </button>
                )}
                <button type="submit" className="text-primary-blue">
                    <SearchIcon />
                </button>
            </div>
        </form>
    );
};

export default Searchbar;
