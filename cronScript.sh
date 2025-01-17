#!/bin/bash

# Load the .env file using node (local dotenv from node_modules)
PORT=$(node -e 'require("dotenv").config(); console.log(process.env.PORT || 3000);')
BASE_URL=$(node -e 'require("dotenv").config(); console.log(process.env.BASE_URL || "http://localhost");')

# Construct the API URL
API_URL="${BASE_URL}:${PORT}/api/github/fetchGithubRepos?language=$@"

# Print the constructed URL for debugging
echo "$API_URL"

# Make the GET request
curl -X GET "$API_URL"

# Print a success message
echo "API method called successfully"
