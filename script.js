// const { NeuralNetwork } = require('brain.js');


//initialize nba teams

const nbaTeams = [
  { name: 'Atlanta Hawks', abbreviation: 'ATL', city: 'Atlanta' },
  { name: 'Boston Celtics', abbreviation: 'BOS', city: 'Boston' },
  { name: 'Philadelphia 76ers', abbreviation: 'PHI', city: 'Philadelphia' },
  { name: 'Miami Heat', abbreviation: 'MIA', city: 'Miami' },
  { name: 'Milwaukee Bucks', abbreviation: 'MIL', city: 'Milwaukee' },
  { name: 'Orlando Magic', abbreviation: 'ORL', city: 'Orlando' },
  { name: 'Indiana Pacers', abbreviation: 'IND', city: 'Indiana' },
  { name: 'New York Knicks', abbreviation: 'NYK', city: 'New York' },
  { name: 'Cleveland Cavaliers', abbreviation: 'CLE', city: 'Cleveland' },
  { name: 'Brooklyn Nets', abbreviation: 'BRK', city: 'Brooklyn' },
  { name: 'Toronto Raptors', abbreviation: 'TOR', city: 'Toronto' },
  { name: 'Chicago Bulls', abbreviation: 'CHI', city: 'Chicago' },
  { name: 'Charlotte Hornets', abbreviation: 'CHA', city: 'Charlotte' },
  { name: 'Washington Wizards', abbreviation: 'WAS', city: 'Washington' },
  { name: 'Detroit Pistons', abbreviation: 'DET', city: 'Detroit' },
  { name: 'Minnesota Timberwolves', abbreviation: 'MIN', city: 'Minnesota' },
  { name: 'Denver Nuggets', abbreviation: 'DEN', city: 'Denver' },
  { name: 'Oklahoma City Thunder', abbreviation: 'OKC', city: 'Oklahoma City' },
  { name: 'Dallas Mavericks', abbreviation: 'DAL', city: 'Dallas' },
  { name: 'Sacramento Kings', abbreviation: 'SAC', city: 'Sacramento' },
  { name: 'Los Angeles Lakers', abbreviation: 'LAL', city: 'Los Angeles' },
  { name: 'Phoenix Suns', abbreviation: 'PHX', city: 'Phoenix' },
  { name: 'Houston Rockets', abbreviation: 'HOU', city: 'Houston' },
  { name: 'New Orleans Pelicans', abbreviation: 'NOP', city: 'New Orleans' },
  { name: 'Golden State Warriors', abbreviation: 'GSW', city: 'Golden State' },
  { name: 'LA Clippers', abbreviation: 'LAC', city: 'Los Angeles' },
  { name: 'Utah Jazz', abbreviation: 'UTA', city: 'Utah' },
  { name: 'Memphis Grizzlies', abbreviation: 'MEM', city: 'Memphis' },
  { name: 'San Antonio Spurs', abbreviation: 'SAS', city: 'San Antonio' },
  { name: 'Portland Trail Blazers', abbreviation: 'POR', city: 'Portland' },

];

// Define an object to hold team records
const teamRecords = {};
// // Clear team records from local storage
// localStorage.removeItem('teamRecords');

// Function to initialize team records with zero wins and losses
const initializeTeamRecords = () => {
  const storedRecords = localStorage.getItem('teamRecords');
  if (storedRecords) {
    // Retrieve team records from local storage
    Object.assign(teamRecords, JSON.parse(storedRecords));
  } else {
    // Initialize team records if not available in local storage
    nbaTeams.forEach(team => {
      teamRecords[team.name] = { wins: 0, losses: 0 };
    });
  }
};
const updateTeamRecords = (winner, loser) => {
  teamRecords[winner].wins += 1;
  teamRecords[loser].losses += 1;

  // Save updated team records to local storage
  localStorage.setItem('teamRecords', JSON.stringify(teamRecords));
};

// Call initializeTeamRecords when the page loads
initializeTeamRecords();
const updateDisplayedTeamRecords = () => {
  nbaTeams.forEach(team => {
    const recordDropdown = document.querySelector(`.teamsdata .teams-list .team:nth-child(${nbaTeams.indexOf(team) + 1}) .record-dropdown`);
    recordDropdown.textContent = `Wins - ${teamRecords[team.name].wins}, Losses - ${teamRecords[team.name].losses}`;
  });
};
// Function to fetch data for a specific date
const fetchDataForDate = async (date) => {
  const apiKey = '4cb260e71cmsh32cdc11a07c5c97p1fa9f7jsn0b12c1c7d0c4';
  const url = `https://api-nba-v1.p.rapidapi.com/games?date=${date}`;
  const options = {
      method: 'GET',
      headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
      }
  };

  try {
      const response = await fetch(url, options);
      const data = await response.json();
      const gameResults = data.response;
      const winners = []; // Array to store winners


      gameResults.forEach(game => {
          const homeScore = game.scores.home.points;
          const awayScore = game.scores.visitors.points;
          const homeTeamName = game.teams.home.name;
          const awayTeamName = game.teams.visitors.name;
          const gameStatus = game.status;
          const currentTime = new Date().getTime();
          const gameTime = new Date(game.date).getTime();
          if (gameTime > currentTime && gameStatus !== 'closed') {
            // Display the upcoming game and prediction in a separate div
            const prediction = predictGameWinner(
              teamRecords[homeTeamName],
              teamRecords[awayTeamName],
              homeScore - awayScore,
              awayScore - homeScore
            );

          }
          let winner = '';
          let loser = '';
          let pointDiffhome = 0;
          let pointDiffaway = 0;
          if (homeScore > awayScore) {
              winner = homeTeamName;
              loser = awayTeamName;
          } else {
              winner = awayTeamName;
              loser = homeTeamName;
              pointDiff = awayScore - homeScore;
          }
          pointDiffhome = homeScore - awayScore;
          pointDiffaway = awayScore - homeScore;
          updateTeamRecords(winner, loser); // Update team records

          // Logging winners for verification
          console.log(`Winner: ${winner}`);
      });

      // Update HTML content with winners
      const gamestodaydiv = document.querySelector('.gamestoday .games-list');
      winners.forEach(winner => {
          const winnerElement = document.createElement('p');
          winnerElement.textContent = `Winner: ${winner}`;
          gamestodaydiv.appendChild(winnerElement);
      });
      updateDisplayedTeamRecords();
  } catch (error) {
      console.error(error);
  }
};
//Predicted Date function
const fetchDataForFutureDate = async (date) => {
  const apiKey = '4cb260e71cmsh32cdc11a07c5c97p1fa9f7jsn0b12c1c7d0c4';
  const url = `https://api-nba-v1.p.rapidapi.com/games?date=${date}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    const gameResults = data.response;
    
    const gamePredictionDiv = document.querySelector('.predictions');
    gamePredictionDiv.innerHTML = ''; // Clear the previous predictions

    gameResults.forEach(game => {
      const homeScore = game.scores.home.points;
      const awayScore = game.scores.visitors.points;
      const homeTeamName = game.teams.home.name;
      const awayTeamName = game.teams.visitors.name;

      if (game.status.clock === null) {
        const prediction = predictGameWinner(
          homeTeamName,
          awayTeamName,
          teamRecords[homeTeamName],
          teamRecords[awayTeamName],
          homeScore - awayScore,
          awayScore - homeScore
        );

        const gamePredictionElement = document.createElement('p');
        gamePredictionElement.textContent = `${homeTeamName} vs. ${awayTeamName} - Prediction: ${prediction}`;
        gamePredictionDiv.appendChild(gamePredictionElement);
      }
    });

  } catch (error) {
    console.error(error);
  }
};



// Function to get today's date in the required format (YYYY-MM-DD)
const getFormattedDate = () => {
  const today = new Date();
  
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  console.log('date' , year);
  console.log('date' , month);
  console.log('date' , day);
  return `${year}-${month}-${day}`;


};
const getFormattedPredictionDate = () => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1); // Add one day to the current date
  

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


// Function to handle button click event
const fetchDataButton = document.getElementById('fetchDataBtn');
fetchDataButton.addEventListener('click', async () => {
  const currentDate = getFormattedDate();
  await fetchDataForDate(currentDate);
});

const predictGamesButton = document.getElementById('TodaysGamesbutton');
predictGamesButton.addEventListener('click', async () => {
  const futureDate = getFormattedPredictionDate();
  await fetchDataForFutureDate(futureDate);
});


// Function to create the dropdown and display team records
const teamsDataDiv = document.querySelector('.teamsdata .teams-list');

// Function to create team elements with expandable dropdowns
const createTeamElements = () => {
  nbaTeams.forEach(team => {
    const teamElement = document.createElement('div');
    teamElement.classList.add('team');
    // Create team name element
    const teamName = document.createElement('p');
    teamName.textContent = `${team.name} >`;
    teamElement.appendChild(teamName);

    // Create team record dropdown
    // updateTeamRecords(winner, loser);
    const recordDropdown = document.createElement('p');
    recordDropdown.textContent = `Team record: Wins - ${teamRecords[team.name].wins}, Losses - ${teamRecords[team.name].losses}`;
// Assuming getTeamRecord() fetches team records based on team names
    recordDropdown.classList.add('record-dropdown');
    recordDropdown.style.display = 'none';

    // Event listener to toggle display of team record dropdown
    teamName.addEventListener('click', () => {
      if (recordDropdown.style.display === 'none') {
        recordDropdown.style.display = 'block';
        teamName.textContent = `${team.name} <`;
      } else {
        recordDropdown.style.display = 'none';
        teamName.textContent = `${team.name} >`;
      }
    });

    // Append elements to teamsDataDiv
    teamElement.appendChild(recordDropdown);
    teamsDataDiv.appendChild(teamElement);
  });
};

// Dummy function to get team records (Replace this with your logic)
const getTeamRecord = (teamName) => {
  // Replace this logic with your data retrieval
  return `Record for ${teamName}`;
};

// Call the function to create team elements with expandable dropdowns
createTeamElements();


// Function to predict the game winner based on team records
const predictGameWinner = (homeTeamName, awayTeamName, teamARecord, teamBRecord, teamAPointDiff, teamBPointDiff) => {

  const recordWeight = 1.0; // Weight for win records
  const homeTeamAdvantage = 0.02;
  const backToBackPenalty = 0.05;
  // const pointDiffWeight = 0.3; // going to keep point differential out for now
  const homeTeamrecord = teamARecord.wins / (teamARecord.wins + teamARecord.losses);
  const awayTeamrecord = teamBRecord.wins / (teamBRecord.wins + teamBRecord.losses);


  const weightedHomeTeamWinRecord = (homeTeamrecord * recordWeight) + homeTeamAdvantage;
  const weightedAwayTeamWinRecord = awayTeamrecord * recordWeight;

  // if (isHomeTeamBackToBack) {
  //   weightedHomeTeamWinRecord -= backToBackPenalty;
  // }

  // if (isAwayTeamBackToBack) {
  //   weightedAwayTeamWinRecord -= backToBackPenalty;
  // }

  // const weightedTeamA = weightedTeamAWinRecord + teamAPointDiff * pointDiffWeight;
  // const weightedTeamB = weightedTeamBWinRecord + teamBPointDiff * pointDiffWeight;

  if (weightedHomeTeamWinRecord > weightedAwayTeamWinRecord) {
    return homeTeamName; 
  } else if (weightedHomeTeamWinRecord < weightedAwayTeamWinRecord) {
    return awayTeamName; 
  } else {
    return 'Undecided'; 
  }
};

const calculateAccuracyButton = document.getElementById('calculateAccuracyBtn');
const predictionCheckboxes = document.querySelectorAll('.prediction-checkbox');

calculateAccuracyButton.addEventListener('click', () => {
  let correctPredictions = 0;
  let totalPredictions = 0;

  predictionCheckboxes.forEach(checkbox => {
    totalPredictions++;

    // Check if the prediction checkbox is checked and matches the actual prediction
    if (checkbox.checked && checkbox.dataset.prediction === checkbox.nextElementSibling.textContent) {
      correctPredictions++;
    }
  });

  // Calculate accuracy percentage
  const accuracyPercentage = (correctPredictions / totalPredictions) * 100;
  const accuracyDisplay = document.getElementById('accuracyPercentage');
  accuracyDisplay.textContent = accuracyPercentage.toFixed(2) + '%';
});

