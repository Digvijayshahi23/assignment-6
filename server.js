// Import the required core modules
const http = require('http');
const fs = require('fs').promises; // Use promises version for asynchronous file operations
const path = require('path');

// Define the port the server will listen on
const PORT = 3000;

// Helper function to serve a file asynchronously
async function serveFile(res, filePath, contentType, statusCode = 200) {
    try {
        // Read the file asynchronously
        const data = await fs.readFile(filePath);
        
        // Set the appropriate HTTP response headers
        res.writeHead(statusCode, { 'Content-Type': contentType });
        
        // Send the file content to the client
        res.end(data);
    } catch (err) {
        // If file is not found or another error occurs, serve the 404 page
        console.error(`Error reading file ${filePath}:`, err);
        
        try {
            // Attempt to read the 404 HTML file
            const errorPage = await fs.readFile(path.join(__dirname, 'public', '404.html'));
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(errorPage);
        } catch (err404) {
            // Fallback plain text 404 if the 404.html file is also missing
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    }
}

// Create the web server
const server = http.createServer(async (req, res) => {
    // Determine the requested URL
    let url = req.url;
    
    // Normalize root URL to /home
    if (url === '/') {
        url = '/home';
    }

    // Log the request
    console.log(`Received request for: ${url}`);

    // Routing logic
    if (url === '/home') {
        await serveFile(res, path.join(__dirname, 'public', 'home.html'), 'text/html');
    } 
    else if (url === '/about') {
        await serveFile(res, path.join(__dirname, 'public', 'about.html'), 'text/html');
    } 
    else if (url === '/contact') {
        await serveFile(res, path.join(__dirname, 'public', 'contact.html'), 'text/html');
    } 
    else if (url === '/services') { // Additional route for meaningful content
        await serveFile(res, path.join(__dirname, 'public', 'services.html'), 'text/html');
    }
    else if (url === '/style.css') { // Route to serve CSS for styling
        await serveFile(res, path.join(__dirname, 'public', 'style.css'), 'text/css');
    }
    else {
        // Any other route results in a 404 Not Found
        await serveFile(res, 'nonexistent', 'text/html', 404); // Force a throw to serve 404 page
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running and listening on http://localhost:${PORT}`);
    console.log('Available routes:');
    console.log('  - http://localhost:3000/home');
    console.log('  - http://localhost:3000/about');
    console.log('  - http://localhost:3000/contact');
    console.log('  - http://localhost:3000/services');
});
