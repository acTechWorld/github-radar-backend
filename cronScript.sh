#!/bin/bash

# Accept three variables as arguments
HOST="$1"      # First argument: Host (e.g., "http://localhost")
PORT="$2"      # Second argument: Port (e.g., "3000")
LANGUAGE="$3"  # Third argument: Language (e.g., "javascript")

# Construct the API URL
API_URL="${HOST}:${PORT}/api/github/fetchGithubRepos?language=${LANGUAGE}"

# Print the constructed URL for debugging
echo "Constructed API URL: $API_URL"

# Make the GET request
curl -X GET "$API_URL"

# Print a success message
echo "API method called successfully"
