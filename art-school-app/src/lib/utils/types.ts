import { School, Program as P } from "@prisma/client"

export type SchoolWithPrograms = School & {
    Program: P[]
};

export const stateNames: Record<string, string> = {
  "01": "Alabama",
  "02": "Alaska",
  "04": "Arizona",
  "05": "Arkansas",
  "06": "California",
  "08": "Colorado",
  "09": "Connecticut",
  "10": "Delaware",
  "11": "Washington DC",
  "12": "Florida",
  "13": "Georgia",
  "15": "Hawaii",
  "16": "Idaho",
  "17": "Illinois",
  "18": "Indiana",
  "19": "Iowa",
  "20": "Kansas",
  "21": "Kentucky",
  "22": "Louisiana",
  "23": "Maine",
  "24": "Maryland",
  "25": "Massacussetts",
  "26": "Michigan",
  "27": "Minnesota",
  "28": "Mississippi",
  "29": "Missouri",
  "30": "Montana",
  "31": "Nebraska",
  "32": "Nevada",
  "33": "New Hampshire",
  "34": "New Jersey",
  "35": "New Mexico",
  "36": "New York",
  "37": "North Carolina",
  "38": "North Dakota",
  "39": "Ohio",
  "40": "Oklahoma",
  "41": "Oregon",
  "42": "Pennsylvania",
  "44": "Rhode Island",
  "45": "South Carolina",
  "46": "South Dakota",
  "47": "Tennessee",
  "48": "Texas",
  "49": "Utah",
  "50": "Vermont",
  "51": "Virginia",
  "53": "Washington",
  "54": "West Virginia",
  "55": "Wisconsin",
  "56": "Wyoming"
};

export const TOP_CITIES = new Set([
  // Alabama
  "Birmingham", "Montgomery", "Huntsville",
  // Alaska
  "Anchorage", "Fairbanks", "Juneau",
  // Arizona
  "Phoenix", "Tucson", "Mesa",
  // Arkansas
  "Little Rock", "Fort Smith", "Fayetteville",
  // California
  "Los Angeles", "San Diego", "San Jose",
  // Colorado
  "Denver", "Colorado Springs", "Aurora",
  // Connecticut
  "Bridgeport", "New Haven", "Hartford",
  // Delaware
  "Wilmington", "Dover", "Newark",
  // Florida
  "Jacksonville", "Miami", "Tampa",
  // Georgia
  "Atlanta", "Augusta", "Columbus",
  // Hawaii
  "Honolulu", "Pearl City", "Hilo",
  // Idaho
  "Boise", "Meridian", "Nampa",
  // Illinois
  "Chicago", "Aurora", "Naperville",
  // Indiana
  "Indianapolis", "Fort Wayne", "Evansville",
  // Iowa
  "Des Moines", "Cedar Rapids", "Davenport",
  // Kansas
  "Wichita", "Overland Park", "Kansas City",
  // Kentucky
  "Louisville", "Lexington", "Bowling Green",
  // Louisiana
  "New Orleans", "Baton Rouge", "Shreveport",
  // Maine
  "Portland", "Lewiston", "Bangor",
  // Maryland
  "Baltimore", "Frederick", "Rockville",
  // Massachusetts
  "Boston", "Worcester", "Springfield",
  // Michigan
  "Detroit", "Grand Rapids", "Warren",
  // Minnesota
  "Minneapolis", "Saint Paul", "Rochester",
  // Mississippi
  "Jackson", "Gulfport", "Southaven",
  // Missouri
  "Kansas City", "Saint Louis", "Springfield",
  // Montana
  "Billings", "Missoula", "Great Falls",
  // Nebraska
  "Omaha", "Lincoln", "Bellevue",
  // Nevada
  "Las Vegas", "Henderson", "Reno",
  // New Hampshire
  "Manchester", "Nashua", "Concord",
  // New Jersey
  "Newark", "Jersey City", "Paterson",
  // New Mexico
  "Albuquerque", "Las Cruces", "Rio Rancho",
  // New York
  "New York", "Buffalo", "Rochester",
  // North Carolina
  "Charlotte", "Raleigh", "Greensboro",
  // North Dakota
  "Fargo", "Bismarck", "Grand Forks",
  // Ohio
  "Columbus", "Cleveland", "Cincinnati",
  // Oklahoma
  "Oklahoma City", "Tulsa", "Norman",
  // Oregon
  "Portland", "Salem", "Eugene",
  // Pennsylvania
  "Philadelphia", "Pittsburgh", "Allentown",
  // Rhode Island
  "Providence", "Cranston", "Warwick",
  // South Carolina
  "Columbia", "Charleston", "North Charleston",
  // South Dakota
  "Sioux Falls", "Rapid City", "Aberdeen",
  // Tennessee
  "Nashville", "Memphis", "Knoxville",
  // Texas
  "Houston", "San Antonio", "Dallas",
  // Utah
  "Salt Lake City", "West Valley City", "Provo",
  // Vermont
  "Burlington", "South Burlington", "Rutland",
  // Virginia
  "Virginia Beach", "Norfolk", "Chesapeake",
  // Washington
  "Seattle", "Spokane", "Tacoma",
  // West Virginia
  "Charleston", "Huntington", "Morgantown",
  // Wisconsin
  "Milwaukee", "Madison", "Green Bay",
  // Wyoming
  "Cheyenne", "Casper", "Laramie",
  // DC
  "Washington",
]);


export const programs = [
  "Visual Arts",
  "Architecture and Design",
  "Dance",
  "Fashion",
  "Film",
  "Game and Media Arts",
  "Music",
  "Theater"
];