const express = require('express');
const axios = require('axios');


const app = express();
const PORT = process.env.PORT || 5000;


//get available countries
app.get('/api/available-countries', async (req, res) => {
  try {
    const response = await axios.get('https://date.nager.at/api/v3/AvailableCountries');
    const countries = response.data;
    res.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error.message);
    res.status(500).json({ error: 'Failed to fetch available countries' });
  }
});


//get country info
app.get('/api/country-info/:countryCode', async (req, res) => {
    const { countryCode } = req.params;
 
    try {
      const bordersResponse = await axios.get(`https://date.nager.at/api/v3/CountryInfo/${countryCode}`);
      const countryInfo = bordersResponse.data;
 
      const populationResponse = await axios.get('https://countriesnow.space/api/v0.1/countries/population');
      const populationData = populationResponse.data.data.find(
        (country) => country.country === countryInfo.commonName || country.country === countryInfo.officialName
      );


      const flagResponse = await axios.get('https://countriesnow.space/api/v0.1/countries/flag/images');
      const flagData = flagResponse.data.data.find(
        (country) => country.iso2 === countryInfo.countryCode
      );
 
      const response = {
        commonName: countryInfo.commonName,
        officialName: countryInfo.officialName,
        region: countryInfo.region,
        borders: countryInfo.borders.map((border) => ({
          commonName: border.commonName,
          countryCode: border.countryCode,
        })),
        populationHistory: populationData
          ? populationData.populationCounts.map(({ year, value }) => ({ year, population: value }))
          : [],
        flagUrl: flagData ? flagData.flag : null,
      };
 
      res.json(response);
    } catch (error) {
      console.error('Error fetching country info:', error.message);
      res.status(500).json({ error: 'Failed to fetch country information' });
    }
  });


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



