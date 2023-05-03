
import {useEffect, useRef,useState} from 'react';


const Api_key = "b893bae8457222dc0a1eabc840f82dc8";

const App = () => {

  const [theme, setTheme] = useState(
    localStorage.getItem('theme') ? localStorage.getItem("theme") : "system"

  );
  const element =document.documentElement

  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  //console.log(darkQuery, "darkQuery");

  const options = [
    {
      icon: "sunny",
      text: 'light',
    },

    {
      icon: "moon",
      text: "dark",
    },

    {
      icon: "desktop-outline",
      text: "system",
    }
  ];



  function onWindowMatch () {
    if(localStorage.theme=== 'dark'  || 
    (!("theme" in  localStorage) && darkQuery.matches)
    ){
      element.classList.add("dark")
    }else{
      element.classList.remove("dark");
    }
    }

    onWindowMatch();
  
  useEffect (()=>{
    switch (theme) {
      case 'dark':
        element.classList.add('dark')
        localStorage.setItem('theme', 'dark')
        break;
      case 'light':
        element.classList.remove('dark');
        localStorage.setItem('theme', 'light')
        break
      default:
        localStorage.removeItem('theme');
        onWindowMatch()
        break;
    }

  },[theme]);

  darkQuery.addEventListener("change",(e) =>{
    if (!("theme" in localStorage)){
      if (e.matches){
        element.classList.add("dark")
      }else{
        element.classList.remove("dark");
      }


    }

  })

  const inputRef = useRef(null);
  const [apiData, setApiData] = useState(null);
  const [showWeather, setShowWeather] = useState(null);

  const [loading, setLoading] = useState(false);




  const WeatherTypes = [
    {
      type: "Clear",
      img: "https://cdn-icons-png.flaticon.com/512/6974/6974833.png",
    },
    {
      type: "Rain",
      img: "https://cdn-icons-png.flaticon.com/512/3351/3351979.png",
    },
    {
      type: "Snow",
      img: "https://cdn-icons-png.flaticon.com/512/642/642102.png",
    },
    {
      type: "Clouds",
      img: "https://cdn-icons-png.flaticon.com/512/414/414825.png",
    },
    {
      type: "Haze",
      img: "https://cdn-icons-png.flaticon.com/512/1197/1197102.png",
    },
    {
      type: "Smoke",
      img: "https://cdn-icons-png.flaticon.com/512/4380/4380458.png",
    },
    {
      type: "Mist",
      img: "https://cdn-icons-png.flaticon.com/512/4005/4005901.png",
    },
    {
      type: "Drizzle",
      img: "https://cdn-icons-png.flaticon.com/512/3076/3076129.png",
    },
  ];



  const fetchWeather = async () =>{
    const URL = ( `https://api.openweathermap.org/data/2.5/weather?q=${inputRef.current.value}&units=metric&appid=${Api_key}`);
    setLoading(true);
    // console.log(inputRef.current.value);

    fetch(URL)
    .then((res) => res.json())
    .then ((data) => {
      setApiData(null);
        if (data.cod == 404 || data.cod == 400) {
          // ARRAY OF OBJ
          setShowWeather([
            {
              type: "Not Found",
              img: "https://cdn-icons-png.flaticon.com/512/4275/4275497.png",
            },
          ]);
        }
        setShowWeather(
          WeatherTypes.filter(
            (weather) => weather.type === data.weather[0].main
          )
        );
       // console.log(data);
        setApiData(data);
        setLoading(false);
      })
      .catch((err) => {
        //console.log(err);
        setLoading(false);
      });
  };

  return (
   
    <div className=" bg-neutral-300 h-screen grid place-items-center dark:text-gray-100 dark:bg-neutral-800 duration-100">
      {/* <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin dark:border-violet-400"></div> */}
      <div className='fixed top-5 right-10 duration-100 dark:bg-neutral-800 bg-neutral-300rounded-xl'>

        {
          options?.map((opt)=> (

            <button 
            key={opt.text} 
            onClick={() => setTheme (opt.text)}
            className={`w-8 h-8 leading-9 text-xl rounded-full m-1 ${theme === opt.text && "text-sky-600"}`}>
            <ion-icon name={opt.icon}></ion-icon>
            </button>

          ))
        }

      </div>
      <div className="bg-neutral-800 text-neutral-300 w-96 p-4 rounded-3xl  dark:bg-neutral-300 dark:text-neutral-900 transition duration-400 ease-in-out hover:scale-105 hover:border-black border">
        <div className="flex items-center justify-between text-neutral-300 dark:text-neutral-900">
          <input
            type="text"
            ref={inputRef}
            placeholder="Enter Your Location" 
            className="text-xl border-b
          p-1  text-neutral-300 bg-neutral-800 font-semibold uppercase flex-1 dark:bg-neutral-300 dark:text-neutral-900"
          />

          <button onClick={fetchWeather}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/758/758651.png"
              alt="..."
              className="w-8"
            />
          </button>
        </div>
        <div
        className={`duration-300 delay-75  overflow-hidden
         ${showWeather ? "h-[27rem]" : "h-0"}`}
        >
          {loading ? (
            <div className="grid place-items-center h-full">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1477/1477009.png"
                alt="..."
                className="w-14 mx-auto mb-2 animate-spin"
              />
            </div>
          ) : (
            showWeather && (
              <div className="text-center flex flex-col gap-6 mt-10">
                {apiData && (
                  <p className="text-xl font-semibold text-neutral-300 dark:text-neutral-900">
                    {apiData?.name + "," + apiData?.sys?.country}
                  </p>
                )}
                <img
                  src={showWeather[0]?.img}
                  alt="..."
                  className="w-52 mx-auto"
                />
                <h3 className="text-2xl font-bold text-neutral-300">
                  {showWeather[0]?.type}
                </h3>

                {apiData && (
                  <>
                    <div className="flex justify-center ">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/7794/7794499.png"
                        alt="..."
                        className="h-9 mt-1"
                      />
                      <h2 className="text-4xl font-extrabold">
                        {apiData?.main?.temp}&#176;C
                      </h2>
                    </div>
                  </>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
  
  


export default App;
