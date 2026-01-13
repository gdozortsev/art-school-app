export interface Program{
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  programs: string[];  
  type: string;        
  enrollment: string;  
  tuition: string;     
  website: string;     
  x: number;           
  y: number;           
}

export const stateNames: Record<string, string> = {
  "01": "Alabama",
  "02": "Alaska",
  "04": "Arizona",
  "05": "Arkansas",
  "06": "California",
  "08": "Colorado",
  "09": "Connecticut",
  "10": "Delaware",
  "11": "District of Columbia",
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
  "25": "Massachusetts",
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
  "56": "Wyoming",
  "72": "Puerto Rico"
};

export function getStateName(id: number | string | undefined) {
  // Handle both string and number IDs, pad with leading zero if needed
  const paddedId = String(id).padStart(2, '0');
  return stateNames[paddedId] || `State ${id}`;
}

// Sample data structure for art programs
export const sample_programs = [
  {
    id: 1,
    name: "Rhode Island School of Design",
    shortName: "RISD",
    city: "Providence",
    state: "Rhode Island",
    stateId: "44",
    latitude: 41.8268,
    longitude: -71.4025,
    type: "University",
    programs: ["Fine Arts", "Graphic Design", "Industrial Design", "Illustration"],
    enrollment: 2500,
    tuition: "High",
    website: "https://www.risd.edu"
  },
  {
    id: 2,
    name: "California Institute of the Arts",
    shortName: "CalArts",
    city: "Valencia",
    state: "California",
    stateId: "06",
    latitude: 34.4144,
    longitude: -118.5661,
    type: "University",
    programs: ["Animation", "Fine Arts", "Film", "Theater"],
    enrollment: 1500,
    tuition: "High",
    website: "https://www.calarts.edu"
  },
  {
    id: 3,
    name: "School of the Art Institute of Chicago",
    shortName: "SAIC",
    city: "Chicago",
    state: "Illinois",
    stateId: "17",
    latitude: 41.8781,
    longitude: -87.6298,
    type: "University",
    programs: ["Fine Arts", "Fashion Design", "Architecture", "Photography"],
    enrollment: 3600,
    tuition: "High",
    website: "https://www.saic.edu"
  },
  {
    id: 4,
    name: "Pratt Institute",
    shortName: "Pratt",
    city: "Brooklyn",
    state: "New York",
    stateId: "36",
    latitude: 40.6926,
    longitude: -73.9639,
    type: "University",
    programs: ["Architecture", "Industrial Design", "Interior Design", "Fine Arts"],
    enrollment: 4700,
    tuition: "High",
    website: "https://www.pratt.edu"
  },
  {
    id: 5,
    name: "Savannah College of Art and Design",
    shortName: "SCAD",
    city: "Savannah",
    state: "Georgia",
    stateId: "13",
    latitude: 32.0809,
    longitude: -81.0912,
    type: "University",
    programs: ["Graphic Design", "Animation", "Fashion", "Game Design"],
    enrollment: 14000,
    tuition: "High",
    website: "https://www.scad.edu"
  },
  // Add more programs here...
];

// Filter categories
export const filterOptions = {
  type: ["University", "College", "Art School", "Community College"],
  programs: [
    "Fine Arts",
    "Graphic Design",
    "Industrial Design",
    "Illustration",
    "Animation",
    "Film",
    "Theater",
    "Fashion Design",
    "Architecture",
    "Photography",
    "Interior Design",
    "Game Design",
    "Digital Media",
    "Sculpture",
    "Painting",
    "Ceramics"
  ],
  tuition: ["Low", "Medium", "High"],
  enrollment: ["Small (<1000)", "Medium (1000-5000)", "Large (>5000)"]
};