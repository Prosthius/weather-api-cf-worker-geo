const handler: ExportedHandler = {
  async fetch(request: any, env: any, ctx: any) {
    const API_KEY = env.API_KEY;
    const host = "https://api.openweathermap.org/geo/1.0";
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("content-type", "application/json;charset=UTF-8")

    // Get the value of the "city" query parameter from the request URL
    const url = new URL(request.url);
    const city = url.searchParams.get("city");
    const apiUrl = `${host}/direct?q=${city?.toLowerCase()},AU&limit=1&appid=${API_KEY}`;
    const init = {
      headers: headers
    };

    async function gatherResponse(response: any) {
      const { headers } = response;
      const contentType = headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        return JSON.stringify(await response.json());
      }
      return response.text();
    }
    
    try {
      const response = await fetch(apiUrl, init);
      const results = await gatherResponse(response);
      const data = JSON.parse(results);

      return new Response(results, init);
    } catch (error: any) {
      const errorMessage = `Error fetching data from OpenWeatherMap API: ${error.message}`;
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 400,
        headers: headers
      });
    }
  },
};

export default handler;