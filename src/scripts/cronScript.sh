

# Load environment variables from the .env file
API_URL="http://localhost:3000/api/github/fetchGithubRepos?language=$@"
echo "$API_URL"
curl -X GET "$API_URL"