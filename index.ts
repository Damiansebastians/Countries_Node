const fs = require('fs'); // file system
const path = require('path'); // routes absolute

interface CountryData {
  country: string;
  population: number;
  area: number;
  density?: number
}

//-------------------------------

const readData = () => {
  try {
    const pathCountries = path.join(__dirname, 'src/countries.txt');
    const countries: string = fs.readFileSync(pathCountries, 'utf-8');
    const lines = countries.split('\n');
    const countriesData: CountryData[] = [];

    for (const line of lines) {
      const countryDataMatches = line.match(/^(.*?)\s+(\d[\d,]*)\s+(\d[\d,]*)$/);
      if (countryDataMatches) {
        const [, country, population, area] = countryDataMatches;
        countriesData.push({
          country: country.trim(),
          population: parseInt(population.replace(/,/g, '')),
          area: parseInt(area.replace(/,/g, '')),
        });
    }
  }
    return countriesData;

  } catch (e) {
    if (typeof e === 'string') {
      e
    } else if (e instanceof Error) {
      e.message
    }
    return [];
  };
}

const countriesData = readData();

function calculateDensity(countriesData: CountryData[]){

  return countriesData.map(countryData => ({
    country: countryData.country,
    population: countryData.population,
    area: countryData.area,
    density: countryData.population / countryData.area,
  }));
}

const densities = calculateDensity(countriesData);

//--------------Ordenar
densities.sort((a, b) => b.density - a.density);

//---------------------
densities.forEach(data => {
  console.log(`${data.country}: Density = ${data.density.toFixed(2)} people/km²`);
});


const csvCountries = 'country,population,area,density\n' + densities.map(data => {
  return `${data.country},${data.population},${data.area},${data.density.toFixed(2)}`;
}).join('\n');


const outPathCountries = path.join(__dirname, 'src/countries.csv');
fs.writeFileSync(outPathCountries, csvCountries, 'utf-8');


