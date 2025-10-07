const apiKey = '55d6def4ee7b03374761bd44de1ea49d';


async function getforecastData(city){
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
    try{
        if(!response.ok){
            throw new Error('somthing went wrong');
        }
        return await response.json();
    }catch(error){
        console.log('error fetching forecastData');
    }
}



document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('sub-btn');
    btn.addEventListener('click', async () => {
        const city = document.getElementById('input-box').value;
        const forecastData = await getforecastData(city);
        console.log('done');
        console.log(forecastData);
        formatForecastData(forecastData );
    });
});





function formatForecastData(forecastData){
    let days = [[], [], [], [], [], []];
    let currday = new Date(forecastData.list[0].dt * 1000);
    console.log(currday);
    let index = 0; 
    for(i = 1; i < forecastData.list.length; i++){
        let date = new Date(forecastData.list[i].dt * 1000);
        if(date.getUTCDate() === currday.getUTCDate()){
            days[index].push(forecastData.list[i]);
        }else{
            index++;
                days[index].push(forecastData.list[i]);
                currday = date;
        }
    }
    for(i = 0; i < 6; i++){
        console.log('day', i + 1 , ': ');
        for(j = 0; j < days[i].length; j++){
            console.log(new Date(days[i][j].dt * 1000).getUTCDate(), days[i][j].dt_txt);
        }
    }
}


