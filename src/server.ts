

import * as dotenv from 'dotenv';
import {  initCronsFetchGithubRepos } from './scripts/fetchGithubRepos'

dotenv.config();

import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


initCronsFetchGithubRepos()