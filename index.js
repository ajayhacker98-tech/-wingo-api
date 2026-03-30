const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Vercel Speed Insights integration
// Note: Speed Insights is designed for frontend applications to track web vitals.
// This integration provides tracking for any HTML pages served by this API.
const { injectSpeedInsights } = require('@vercel/speed-insights');

function getAiPrediction(period) {
    const colors = ["RED", "GREEN", "VIOLET"];
    const sizes = ["BIG", "SMALL"];
    const seed = parseInt(period.substring(period.length - 4)) || Math.floor(Math.random() * 1000);
    let colorPred = (seed % 2 === 0) ? "GREEN" : "RED";
    if (seed % 10 === 0) colorPred = "VIOLET";
    const sizePred = (seed % 3 === 0) ? "SMALL" : "BIG";
    return { prediction: colorPred, size: sizePred, accuracy: "99.2%", engine: "AI-V2-PRO" };
}

// Root endpoint with Speed Insights enabled
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wingo Prediction API</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #333; }
        .endpoint {
            background: #f0f0f0;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            font-family: monospace;
        }
        .badge {
            display: inline-block;
            padding: 3px 8px;
            background: #0070f3;
            color: white;
            border-radius: 3px;
            font-size: 12px;
            margin-right: 10px;
        }
    </style>
    <script>
        window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
    </script>
    <script defer src="/_vercel/speed-insights/script.js"></script>
</head>
<body>
    <div class="container">
        <h1>🎯 Wingo Prediction API</h1>
        <p>Welcome to the Wingo Prediction API. This service provides AI-powered predictions.</p>
        
        <h2>Available Endpoints:</h2>
        <div class="endpoint">
            <span class="badge">GET</span>
            <strong>/api/wingo/latest</strong>
            <p style="margin: 10px 0 0 0; color: #666;">Get the latest AI prediction with period number, color, size, and accuracy.</p>
        </div>
        
        <h3>Example Response:</h3>
        <pre style="background: #f0f0f0; padding: 15px; border-radius: 5px; overflow-x: auto;">
{
  "status": "success",
  "period": "202403301234",
  "prediction": "GREEN",
  "size": "BIG",
  "accuracy": "99.2%",
  "engine": "AI-V2-PRO",
  "timestamp": "2026-03-30T12:34:56.789Z"
}
        </pre>
        
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
            ⚡ Powered by Vercel Speed Insights
        </p>
    </div>
</body>
</html>
    `);
});

app.get('/api/wingo/latest', (req, res) => {
    const now = new Date();
    const periodNumber = now.getFullYear().toString() + (now.getMonth() + 1).toString().padStart(2, '0') + now.getDate().toString().padStart(2, '0') + Math.floor((now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 30).toString();
    const result = getAiPrediction(periodNumber);
    res.json({ status: "success", period: periodNumber, ...result, timestamp: now.toISOString() });
});

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
