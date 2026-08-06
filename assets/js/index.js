// WRITE YOUR JS CODE HERE
//! Global Variables
let links = document.querySelectorAll('.nav-link');
let sections = document.querySelectorAll('section');
let spaceTodayData;
let dateObj;
const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const timeOptions = {hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC'};
let time;
let launchesCards = document.getElementById('launches-grid')

let planets = document.querySelectorAll('.planet-card');
let planetFacts = document.querySelectorAll('#planet-facts li span')
let planetIndex;
let mass;
let gravity;
let density;
let axialTilt;
let facts = []
let tableBody = document.querySelector('table tbody')

let launchesData;
let solarSystemData;


//! Functions
(async function (){
    setActivelinkAndSection(links, sections)
    spaceTodayData = await getData(`https://api.nasa.gov/planetary/apod?api_key=zYNZQH3V0KxKFZdv6dmWbZJjkFouTSKfJPbfzPUk`)
    showSpaceToday()
    launchesData = await getData(`https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10`)
    showCurrentLaunch()
    showAllUpcomingLaunches()
    solarSystemData = await getData(`https://solar-system-opendata-proxy.vercel.app/api/planets`)
    showPlanet('englishName','Earth')
    showAnyPlanet()
    planetComparison()
    
})();

function setActivelinkAndSection(links, sections) {
    links.forEach(element => {
    element.addEventListener('click', e => {
        setActiveLink(links, e.currentTarget)
        setActiveSection(sections, e.currentTarget)
    })
})
}

function setActiveLink (links, activeLink) {
    links.forEach(element => {
            element.classList.remove('bg-blue-500/10', 'text-blue-400')
            element.classList.add('text-slate-300','hover:bg-slate-800')
        })
        activeLink.classList.remove('text-slate-300','hover:bg-slate-800')
        activeLink.classList.add('bg-blue-500/10', 'text-blue-400')
}

function setActiveSection(sections, activeLink) {
    sections.forEach(section => {
            section.classList.add('hidden')
            if(activeLink.dataset.section == section.dataset.section) section.classList.remove('hidden')
        })
}

async function getData(apiUrl) {
  let response = await fetch(apiUrl)
  let data = await response.json();
  return data;
}

function showSpaceToday() {
  dateObj = new Date(spaceTodayData.date)
  let today = new Date()
  document.getElementById('apod-date').innerHTML = `Astronomy Picture of the Day - ${dateObj.toLocaleDateString('en-us', {year: 'numeric', month: 'long', day: 'numeric' })}`
  document.getElementById('apod-date-input').value = today.toISOString().split('T')[0]
  document.querySelector('.date-input-wrapper span').innerHTML = today.toLocaleDateString('en-us', {year: 'numeric', month: 'long', day: 'numeric' })
  document.getElementById('apod-image').src = spaceTodayData.url
  document.getElementById('apod-image').alt = spaceTodayData.title
  document.getElementById('apod-title').innerHTML = spaceTodayData.title
  document.getElementById('apod-date-detail').innerHTML = '<i class="far fa-calendar mr-2"></i>' + dateObj.toLocaleDateString('en-us', {year: 'numeric', month: 'long', day: 'numeric' })
  document.getElementById('apod-explanation').innerHTML = spaceTodayData.explanation
  document.getElementById('apod-copyright').innerHTML = `&copy; ${spaceTodayData.copyright}`
  document.getElementById('apod-date-info').innerHTML = dateObj.toLocaleDateString('en-us', {year: 'numeric', month: 'long', day: 'numeric' })
  document.getElementById('apod-media-type').innerHTML = spaceTodayData.media_type

}

function showCurrentLaunch() {
    dateObj = new Date(launchesData.results[0].net)
    time = new Intl.DateTimeFormat('en-us', timeOptions).format(dateObj);
    let imgLaunch = document.createElement('img')
    imgLaunch.src = launchesData.results[0].image.image_url
    imgLaunch.setAttribute('alt', launchesData.results[0].image.name)

    document.querySelector('#featured-launch #status').innerHTML = launchesData.results[0].status.abbrev
    document.querySelector('#featured-launch h3').innerHTML = launchesData.results[0].name
    document.querySelector('#featured-launch #provider').innerHTML = launchesData.results[0].launch_service_provider.name
    document.querySelector('#featured-launch #rocket-fullName').innerHTML = launchesData.results[0].rocket.configuration.full_name
    document.querySelector('#featured-launch #date').innerHTML = dateObj.toLocaleDateString('en-us', dateOptions)
    document.querySelector('#featured-launch #launch-time').innerHTML = time + ' UTC';
    document.querySelector('#featured-launch #launch-location').innerHTML = launchesData.results[0].pad.location.name
    document.querySelector('#featured-launch #launch-country').innerHTML = launchesData.results[0].pad.country.name
    document.querySelector('#featured-launch #launch-mission-description').innerHTML = launchesData.results[0].mission.description
    document.querySelector('#featured-launch #launch-img').appendChild(imgLaunch)
    imgLaunch.addEventListener('error', _ => {
      imgLaunch.style.display = 'none';
      imgLaunch.parentElement.querySelector('i').classList.remove('hidden')
    })
}

function showAllUpcomingLaunches() {
    let card = ``
    for(let i = 1; i < launchesData.results.length; i++) {
        dateObj = new Date(launchesData.results[i].net)
        time = new Intl.DateTimeFormat('en-us', timeOptions).format(dateObj);
        card += `<div
            class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer"
            >
              <div
                class="relative h-48 bg-slate-900/50 flex items-center justify-center"
              >
                <i class="fas fa-space-shuttle  text-5xl text-slate-700 hidden"></i>
                <img src="${launchesData.results[i].image.image_url}" alt="${launchesData.results[i].image.name}"/>
                
                <div class="absolute top-3 right-3">
                  <span
                    class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold"
                  >
                    ${launchesData.results[i].status.abbrev}
                  </span>
                </div>
              </div>
              <div class="p-5">
                <div class="mb-3">
                  <h4
                    class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
                  >
                    ${launchesData.results[i].name}
                  </h4>
                  <p class="text-sm text-slate-400 flex items-center gap-2">
                    <i class="fas fa-building text-xs"></i>
                    ${launchesData.results[i].launch_service_provider.name}
                  </p>
                </div>
                <div class="space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-calendar text-slate-500 w-4"></i>
                    <span class="text-slate-300">${dateObj.toLocaleDateString('en-us', dateOptions)}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-clock text-slate-500 w-4"></i>
                    <span class="text-slate-300">${time} UTC</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-rocket text-slate-500 w-4"></i>
                    <span class="text-slate-300">${launchesData.results[i].rocket.configuration.full_name}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                    <span class="text-slate-300 line-clamp-1">${launchesData.results[i].pad.location.name}</span>
                  </div>
                </div>
                <div
                  class="flex items-center gap-2 pt-4 border-t border-slate-700"
                >
                  <button
                    class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold"
                  >
                    Details
                  </button>
                  <button
                    class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <i class="far fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>`
    }
    launchesCards.innerHTML = card
    let images = launchesCards.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('error', () => {
        img.style.display = 'none';
        img.parentElement.querySelector('i').classList.remove('hidden')
      })
      
    })
}

function showPlanet(param1, param2) {
    solarSystemData.bodies.find(planetBody => {
        if (planetBody[param1] == param2) {

            planetIndex = solarSystemData.bodies.indexOf(planetBody)
        }
        
    })

    mass =  `${solarSystemData.bodies[planetIndex].mass.massValue} x 10<sup>${solarSystemData.bodies[planetIndex].mass.massExponent}</sup> Kg`
    density = `${solarSystemData.bodies[planetIndex].density} g/cm³`
    gravity = `${Math.trunc(solarSystemData.bodies[planetIndex].gravity * 100) / 100 } m/s²`
    axialTilt = `${solarSystemData.bodies[planetIndex].axialTilt}°`
    facts = [`Mass: ${mass}`, `Surface Gravity: ${gravity}`, `Density: ${density}`, `Axial Till: ${axialTilt}`]

    document.getElementById('planet-detail-name').innerHTML = solarSystemData.bodies[planetIndex].englishName
    document.getElementById('planet-detail-image').src = solarSystemData.bodies[planetIndex].image
    document.getElementById('planet-detail-description').innerHTML = solarSystemData.bodies[planetIndex].description
    document.getElementById('planet-distance').innerHTML = `${Math.ceil(solarSystemData.bodies[planetIndex].semimajorAxis/100_000)/10}M km`
    document.getElementById('planet-radius').innerHTML = `${Math.trunc(solarSystemData.bodies[planetIndex].meanRadius)/1000} km`
    document.getElementById('planet-mass').innerHTML = mass
    document.getElementById('planet-density').innerHTML = density
    document.getElementById('planet-orbital-period').innerHTML = `${solarSystemData.bodies[planetIndex].sideralOrbit} days`
    document.getElementById('planet-rotation').innerHTML = `${Math.round(solarSystemData.bodies[planetIndex].sideralRotation)} Hours`
    document.getElementById('planet-moons').innerHTML = `${solarSystemData.bodies[planetIndex].moons != null? solarSystemData.bodies[planetIndex].moons.length : 0 }`
    document.getElementById('planet-gravity').innerHTML = gravity;
    document.getElementById('planet-discoverer').innerHTML = solarSystemData.bodies[planetIndex].discoveredBy != '' ?  solarSystemData.bodies[planetIndex].discoveredBy : 'Known since antiquity';
    document.getElementById('planet-discovery-date').innerHTML = solarSystemData.bodies[planetIndex].discoveryDate != '' ?  solarSystemData.bodies[planetIndex].discoveryDate : 'Ancient';
    document.getElementById('planet-body-type').innerHTML = solarSystemData.bodies[planetIndex].bodyType;
    document.getElementById('planet-volume').innerHTML = `${solarSystemData.bodies[planetIndex].vol.volValue} x 10<sup>${solarSystemData.bodies[planetIndex].vol.volExponent}</sup> km³`

    for(let i=0; i < planetFacts.length; i++) {
        planetFacts[i].innerHTML = facts[i]
    }
    document.getElementById('planet-perihelion').innerHTML = `${Math.round(solarSystemData.bodies[planetIndex].perihelion / 1_000_000).toFixed(1)}M km`
    document.getElementById('planet-aphelion').innerHTML = `${Math.round(solarSystemData.bodies[planetIndex].aphelion / 1_000_000).toFixed(1)}M km`
    document.getElementById('planet-eccentricity').innerHTML = `${solarSystemData.bodies[planetIndex].eccentricity}`
    document.getElementById('planet-inclination').innerHTML = `${solarSystemData.bodies[planetIndex].inclination}°`
    document.getElementById('planet-axial-tilt').innerHTML = axialTilt
    document.getElementById('planet-temp').innerHTML = `${solarSystemData.bodies[planetIndex].avgTemp}°C`
    document.getElementById('planet-escape').innerHTML = `${solarSystemData.bodies[planetIndex].escape / 1000} km/s`
}

function showAnyPlanet() {
    planets.forEach(planet => {
        planet.addEventListener('click', e => {
            let planetId = e.currentTarget.dataset.planetId
            showPlanet('id', planetId)
        })
    })
}

function planetComparison() {
    let rowsData = ``
    let backgroundColors = {
        'mercury': '#eab308',
        'venus'  : '#f97316',
        'mars'  : '#ef4444',
        'earth' : '#3b82f6',
        'jupiter' : "#fb923c",
        'saturn' : '#facc15',
        'uranus' : '#06b6d4',
        'neptune' : '#2563eb'
    }
        let earthData = solarSystemData.bodies.find(body => body.englishName === 'Earth');
        let earthMass = earthData.mass.massValue * Math.pow(10, earthData.mass.massExponent);
        let planetMass;
    for(let i=0; i < solarSystemData.bodies.length; i++) {
        planetMass  = solarSystemData.bodies[i].mass.massValue * Math.pow(10, solarSystemData.bodies[i].mass.massExponent)
        rowsData+=`<tr class="hover:bg-slate-800/30 transition-colors">
            <td
            class="px-4 md:px-6 py-3 md:py-4 sticky left-0 bg-slate-800 z-10"
            >
            <div class="flex items-center space-x-2 md:space-x-3">
                <div
                class="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0"
                style="background-color: ${backgroundColors[solarSystemData.bodies[i].englishName.toLowerCase()]}"
                ></div>
                <span
                class="font-semibold text-sm md:text-base whitespace-nowrap"
                >${solarSystemData.bodies[i].englishName}</span
                >
            </div>
            </td>
            <td
            class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
            >
            ${(solarSystemData.bodies[i].semimajorAxis / 149_600_000).toFixed(2)}
            </td>
            <td
            class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
            >
            ${(solarSystemData.bodies[i].meanRadius * 2).toLocaleString()}
            </td>
            <td
            class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
            >
            ${(planetMass / earthMass).toFixed(3)}
            </td>
            <td
            class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
            >
            ${Math.floor(solarSystemData.bodies[i].sideralOrbit * 10) /10} days
            </td>
            <td
            class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
            >
            ${solarSystemData.bodies[i].moons != null? solarSystemData.bodies[i].moons.length : 0}
            </td>
            <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
            <span
                class="px-2 py-1 rounded text-xs bg-orange-500/50 text-orange-200"
                >${solarSystemData.bodies[i].type}</span
            >
            </td>
        </tr>`
    }
    tableBody.innerHTML = rowsData
}