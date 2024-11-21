const express = require("express");
const bodyParser = require("body-parser");
const mime = require("mime");
const cors = require("cors");
const app = express();

app.use(bodyParser.json());
app.use(cors());

const isPrime = (num) => {
    if (!Number.isInteger(num) || num < 2) return false;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const decodeBase64File = (base64String) => {
    try {
        const buffer = Buffer.from(base64String, "base64");
        const mimeType = mime.getType(buffer);
        return {
            valid: !!mimeType,
            mimeType,
            sizeKB: Math.round(buffer.length / 1024),
        };
    } catch (error) {
        return { valid: false, mimeType: null, sizeKB: 0 };
    }
};

// POST /bfhl
app.post("/bfhl", (req, res) => {
    const { data, file_b64 } = req.body;

    const response = {
        is_success: false,
        user_id: "bhishek_parmar_21042003",
        email: "bhishekparmar210169@acropolis.in",
        roll_number: "0827CS211059",
        numbers: [],
        alphabets: [],
        highest_lowercase_alphabet: [],
        is_prime_found: false,
        file_valid: false,
        file_mime_type: null,
        file_size_kb: 0,
    };

    if (!Array.isArray(data)) {
        return res.status(400).json({ is_success: false, error: "Invalid input format." });
    }

    const numbers = [];
    const alphabets = [];
    const charFrequency = new Map();
    let hasPrime = false;

    data.forEach((item) => {
        if (!isNaN(item) && Number.isFinite(+item)) {
            const number = parseInt(item, 10);
            if (Number.isInteger(number)) {
                numbers.push(number);
                if (isPrime(number)) hasPrime = true;
            }
        } else if (/^[a-zA-Z]$/.test(item)) {
            alphabets.push(item);
            if (item >= "a" && item <= "z") {
                charFrequency.set(item, (charFrequency.get(item) || 0) + 1);
            }
        }
    });

    console.log(hasPrime);
    
    let mostFrequentChar = null;
    let maxFrequency = 0;
    charFrequency.forEach((frequency, char) => {
        if (frequency > maxFrequency) {
            mostFrequentChar = char;
            maxFrequency = frequency;
        }
    });

    response.numbers = numbers.map(String);
    response.alphabets = alphabets;
    response.highest_lowercase_alphabet = mostFrequentChar ? [mostFrequentChar] : [];
    response.is_prime_found = hasPrime;

    if (file_b64) {
        const { valid, mimeType, sizeKB } = decodeBase64File(file_b64);
        response.file_valid = valid;
        response.file_mime_type = mimeType;
        response.file_size_kb = sizeKB;
    }

    response.is_success = true;
    return res.json(response);
});


app.get("/bfhl", (req, res) => {
    const response = {
        operation_code: 1,
    };
    res.status(200).json(response);
});

app.get("/", (req, res) => {
    const response = {
        msg: "Welcome to the API!",
    };
    res.status(200).json(response);
});

const PORT = 5555;
app.listen(PORT, () => console.log(`Bajaj Finserv Health Challenge Server running on http://localhost:${PORT}`));
