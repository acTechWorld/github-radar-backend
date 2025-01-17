#!/bin/bash

# Accept three variables as arguments
BASE_URL="$1"
LANGUAGE="$2"  # Third argument: Language (e.g., "javascript")

# Construct the API URL
API_URL="${BASE_URL}/api/github/fetchGithubRepos?language=${LANGUAGE}"

# Print the constructed URL for debugging
echo "Constructed API URL: $API_URL"

# Make the GET request
curl -X GET "$API_URL"

# Print a success message
echo "API method called successfully"
